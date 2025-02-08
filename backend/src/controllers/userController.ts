import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { TrainingSurvey } from '../entity/TrainingSurvey';
const sha1 = require('sha1')
const jwt = require('jsonwebtoken')

class UserController {
    async login(req: Request, res: Response) {
        try {
            const {phoneNumber, password} = req.body

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.findOneBy({phoneNumber: phoneNumber})

            if (sha1(password) === user.password) {
                const accessToken = jwt.sign({userId: user.id}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '2h'})
                const refreshToken = jwt.sign({userId: user.id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '14d'})

                res.status(200).send({result: true, accessToken, refreshToken})
                return
            } else {
                throw new Error('invalid password')
            }
        } catch (error) {            
            res.status(400).send(error.message)
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {name, dogName, password, phoneNumber} = req.body
            const hashedPassword = sha1(password)

            const newUser = new User()

            newUser.name = name
            newUser.dogName = dogName
            newUser.password = hashedPassword
            newUser.phoneNumber = phoneNumber

            await AppDataSource.manager.save(newUser)

            res.status(201).send({result: true})
        } catch (error) {            
            res.status(400).send({result: false, message: error.message})
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const { name, dogName, phoneNumber } = req.body;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ phoneNumber: phoneNumber });
    
            if (!user) {
                return res.status(404).send({ result: false, message: "Пользователь не найден" });
            }
    
            if (user.name !== name) user.name = name;
            if (user.dogName !== dogName) user.dogName = dogName;
            if (user.phoneNumber !== phoneNumber) user.phoneNumber = phoneNumber
    
            await AppDataSource.manager.save(user);
    
            res.status(200).send({ result: true, user });
        } catch (error) {
            res.status(400).send({ result: false, message: error.message });
        }
    }
    

    async delete(req: Request, res: Response) {
        try {
            const { uid } = req.params;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: uid });
    
            if (!user) {
                throw new Error('User not found');
            }
    
            await userRepository.remove(user);
    
            res.status(200).send({ result: true, message: 'User deleted successfully' });
        } catch (error) {
            res.status(400).send({result: false, message: error.message});
        }
    }

    async getAverageRatingsByDate(req: Request, res: Response): Promise<void> {
        try {
            const { date } = req.body;
    
            if (!date) {
                return res.status(400).json({
                    result: false,
                    message: "Пожалуйста, укажите дату в запросе."
                });
            }
    
            const parsedDate = new Date(date);
            const utcDate = new Date(Date.UTC(
                parsedDate.getUTCFullYear(),
                parsedDate.getUTCMonth(),
                parsedDate.getUTCDate()
            ));
    
            const trainingSurveys = await AppDataSource.getRepository(TrainingSurvey).find({
                where: { date: utcDate },
                relations: ["trainingSurveyUsers", "trainingSurveyUsers.user", "trainingSurveyUsers.exerciseRatings"],
            });

            console.log(trainingSurveys)
    
            if (!trainingSurveys.length) {
                return res.status(404).json({
                    result: false,
                    message: "Опросы на указанную дату не найдены."
                });
            }
    
            const dogRatings: Record<string, number[]> = {};
    
            trainingSurveys.forEach((survey) => {
                survey.trainingSurveyUsers.forEach((tsu) => {
                    const dogName = tsu.user.dogName;
    
                    if (tsu.exerciseRatings && tsu.exerciseRatings.length > 0) {
                        const ratings = tsu.exerciseRatings.map((rating) => rating.rating).filter((r) => r !== null);
    
                        if (!dogRatings[dogName]) {
                            dogRatings[dogName] = [];
                        }
    
                        dogRatings[dogName].push(...ratings);
                    }
                });
            });
    
            const result = Object.entries(dogRatings).map(([dogName, ratings]) => {
                const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                return { dogName, averageRating: +averageRating.toFixed(2) }; 
            });
    
            return res.status(200).json({ date: utcDate.toISOString().split("T")[0], result });
        } catch (error) {
            console.error("Ошибка при обработке запроса:", error);
            return res.status(500).json({
                result: false,
                message: "Произошла ошибка на сервере."
            });
        }
    }

    async getStats(req: Request, res: Response) {
        const { uid } = req.params;
    
        try {

            console.log('before query')
            const userRepository = AppDataSource.getRepository(User);
    
            const user = await userRepository.findOne({
                where: { id: uid },
                relations: [
                    'trainingSurveyUsers',
                    'trainingSurveyUsers.survey',
                    'trainingSurveyUsers.survey.exerciseRatings',
                    'trainingSurveyUsers.bestDogOwner',
                    'trainingSurveyUsers.survey.exerciseRatings.trainingSurveyUser',
                    'trainingSurveyUsers.survey.exerciseRatings.trainingSurveyUser.user'  
                ],
            });
    
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
    
            const surveyStats = user.trainingSurveyUsers.map(surveyUser => {
                const trainingSurvey = surveyUser.survey;
    
                if (!trainingSurvey) {
                    return null; 
                }
                console.log('after 1')
                const userExerciseRatings = (trainingSurvey.exerciseRatings || []).filter(rating => {
                    console.log(rating)
                    const isUserRating = rating.trainingSurveyUser && rating.trainingSurveyUser.user.id === user.id;
                    return isUserRating;
                });
                
                
                
                console.log('after 2')
    
                return {
                    surveyId: trainingSurvey.id,
                    date: trainingSurvey.date,
                    isConfirmed: trainingSurvey.isConfirmed,
                    exerciseRatings: userExerciseRatings.map(rating => ({
                        exerciseName: rating.exerciseName,
                        rating: rating.rating,
                    })),
                    bestDogOwner: surveyUser.bestDogOwner
                        ? {
                              id: surveyUser.bestDogOwner.id,
                              name: surveyUser.bestDogOwner.name,
                              dogName: surveyUser.bestDogOwner.dogName,
                          }
                        : null,
                };
            }).filter(stat => stat !== null)
    
            return res.json({
                user: { id: user.id, name: user.name, dogName: user.dogName },
                surveys: surveyStats,
            });
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }    

    async getUserByPhone(req: Request, res: Response) {
        try {
            const { phoneNumber } = req.body;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { phoneNumber: phoneNumber },
                relations: ['trainingSurveyUsers', 'trainingSurveyUsers.exerciseRatings'],
            });
    
            if (!user) {
                throw new Error('User not found');
            }
    
            res.status(200).send({ result: true, user });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
    
            const users = await userRepository.find({
                relations: ['trainingSurveyUsers', 'trainingSurveyUsers.exerciseRatings'],
            });
    
            res.status(200).send({ result: true, users });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async protected(req: Request, res: Response) {
        try {
            res.status(200).send({result: true})
        } catch (error) {
            res.status(400).send({result: false, error: error.message})
        }
    }

    async protectedAdmin(req: Request, res: Response) {
        try {
            res.status(200).send({result: true, isAdmin: true})
        } catch (error) {
            res.status(400).send({result: false, isAdmin: false, error: error.message})
        }
    }
}

export default new UserController();
