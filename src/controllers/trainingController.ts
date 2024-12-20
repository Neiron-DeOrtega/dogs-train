import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { TrainingSurvey } from '../entity/TrainingSurvey';
import { ExerciseRating } from '../entity/ExerciseRating';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

class TrainingController {
    async send(req: Request, res: Response): Promise<void> {
        try {
            const { userId, surveyId, exerciseRatings, bestDogOwnerId } = req.body;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }
    
            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            const survey = await surveyRepository.findOne({
                where: { id: surveyId },
                relations: ["exerciseRatings"]
            });
            if (!survey) {
                res.status(404).json({ message: "Survey not found" });
                return
            }

            if (!survey.isConfirmed) {
                res.status(400).json({ message: "Survey is not confirmed by admin yet" });
                return
            } else if (survey.isCompleted) {
                res.status(400).json({ message: "Survey is already completed" });
                return;
            }
    
            survey.user = user;

            const exerciseRatingRepository = AppDataSource.getRepository(ExerciseRating);
            const ratingArray = exerciseRatings.map((rating) => {
                const newRating = new ExerciseRating();
                newRating.exerciseName = rating.exerciseName;
                newRating.rating = rating.rating;
                newRating.survey = survey;

                return newRating
            })
            
            if (bestDogOwnerId) {
                const bestDogOwner = await userRepository.findOneBy({id: bestDogOwnerId});
                if (bestDogOwner) {
                    console.log(ratingArray)
                    survey.bestDogOwner = bestDogOwner;
                    survey.isCompleted = true;   
                    survey.exerciseRatings = ratingArray
                    await surveyRepository.save(survey);
                    await Promise.all(ratingArray.map((newRating) => exerciseRatingRepository.save(newRating)));

                    res.status(200).json({ message: "Survey submitted successfully" });
                    return
                } else {
                    res.status(404).json({ message: "Best dog owner not found" });
                    return
                }
            }
     
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }    

    async create(req: Request, res: Response) {
        try {
            const { userId, date, exerciseRatings } = req.body;
    
            const survey = new TrainingSurvey();
            survey.date = date;
            survey.isConfirmed = false;
    
            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            await surveyRepository.save(survey);
    
            const exerciseRatingRepository = AppDataSource.getRepository(ExerciseRating);
            for (const rating of exerciseRatings) {
                const newRating = new ExerciseRating();
                newRating.exerciseName = rating.exerciseName;
                newRating.rating = rating.rating; 
                newRating.survey = survey;
    
                await exerciseRatingRepository.save(newRating);
            }
    
            res.status(201).json({ message: "Survey created successfully", surveyId: survey.id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }    
    

    async confirm(req: Request, res: Response) {
        try {
            const { sid } = req.params;

            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            const survey = await surveyRepository.findOne({
                where: { id: sid }, 
                relations: ["user"],       
            });
            if (!survey) {
                return res.status(404).json({ message: "Survey not found" });
            }

            if(survey.isConfirmed) {
                return res.status(400).json({ message: "Survey is already confirmed" });
            }

            survey.isConfirmed = true;
            await surveyRepository.save(survey);

            res.status(200).json({ message: "Survey confirmed successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async loadSurvey(req: Request, res: Response) {
        try {
            const { userId } = req.body

            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            const survey = await surveyRepository.findOne({
                where: {
                    user: { id: userId },
                    isConfirmed: true,
                    isCompleted: false
                },
                relations: ['user', 'exerciseRatings'] 
            });

            if (survey) {
                return res.json({ result: true, survey });
            }

            return res.json({ result: false, message: 'Опрос еще не доступен или уже завершен.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ result: false, message: 'Ошибка при загрузке опроса' });
        }
    }
}

export default new TrainingController();
