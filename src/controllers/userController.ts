import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
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
            console.error(error)
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

            const accessToken = jwt.sign({userId: newUser.id}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '2h'})
            const refreshToken = jwt.sign({userId: newUser.id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '14d'})

            res.status(201).send({result: true, accessToken, refreshToken})
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const {userId, name, dogName, phoneNumber} = req.body

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.findOneBy({id: userId})

            user.name = name
            user.dogName = dogName
            user.phoneNumber = phoneNumber

            await AppDataSource.manager.save(user)

            res.status(200).send({result: true, user: user})
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { userId } = req.body;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId });
    
            if (!user) {
                throw new Error('User not found');
            }
    
            await userRepository.remove(user);
    
            res.status(200).send({ result: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }

    async getStats(req: Request, res: Response) {
        const { uid } = req.params;
    
        try {
            const userRepository = AppDataSource.getRepository(User);
    
            // Загружаем все необходимые связи
            const user = await userRepository.findOne({
                where: { id: uid },
                relations: [
                    'trainingSurveyUsers',
                    'trainingSurveyUsers.survey',
                    'trainingSurveyUsers.survey.exerciseRatings',
                    'trainingSurveyUsers.bestDogOwner',
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
    
                return {
                    surveyId: trainingSurvey.id,
                    date: trainingSurvey.date,
                    isConfirmed: trainingSurvey.isConfirmed,
                    exerciseRatings: trainingSurvey.exerciseRatings.map(rating => ({
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
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }    

    async getUserById(req: Request, res: Response) {
        try {
            const { uid } = req.params;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { id: Number(uid) },
                relations: ['surveys', 'surveys.exerciseRatings'],
            });
    
            if (!user) {
                throw new Error('User not found');
            }
    
            res.status(200).send({ result: true, user });
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
    
            const users = await userRepository.find({
                relations: ['surveys', 'surveys.exerciseRatings'],
            });
    
            res.status(200).send({ result: true, users });
        } catch (error) {
            console.error(error);
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
