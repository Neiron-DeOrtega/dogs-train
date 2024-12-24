import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { TrainingSurvey } from '../entity/TrainingSurvey';
import { ExerciseRating } from '../entity/ExerciseRating';
import { TrainingSurveyUser } from '../entity/TrainingSurveyUser';

class TrainingController {
    async submit(req: Request, res: Response): Promise<void> {
        try {
            const { userId, surveyId, exerciseRatings, bestDogOwnerId } = req.body;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ result: false, message: "Пользователь не найден" });
                return;
            }
    
            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            const survey = await surveyRepository.findOne({
                where: { id: surveyId },
                relations: ["trainingSurveyUsers", "exerciseRatings"]
            });
            if (!survey) {
                res.status(404).json({ result: false, message: "Опрос не найден" });
                return;
            }
    
            const surveyUserRepository = AppDataSource.getRepository(TrainingSurveyUser);
            const FoundedSurveyUser = await surveyUserRepository.findOne({
                where: { user: user, survey: survey }
            });

            if (FoundedSurveyUser) {
                return res.status(400).send({result: false, message: "Этот опрос уже пройден"})
            }


            const surveyUser = new TrainingSurveyUser

            surveyUser.user = user 
            surveyUser.survey = survey
    
            if (bestDogOwnerId) {
                const bestDogOwner = await userRepository.findOne({ where: { id: bestDogOwnerId } });
                if (bestDogOwner) {
                    surveyUser.bestDogOwner = bestDogOwner;
                } else {
                    res.status(404).json({ result: false, message: "Лучший владелец собаки не найден" });
                    return;
                }
            }

            await surveyUserRepository.save(surveyUser);

            console.log(surveyUser)
    
            const exerciseRatingRepository = AppDataSource.getRepository(ExerciseRating);
            for (const rating of exerciseRatings) {
                const exerciseRating = await exerciseRatingRepository.findOne({
                  where: { 
                    survey: survey,
                    exerciseName: rating.exerciseName, 
                  }
                });
              
                if (exerciseRating) {
                  exerciseRating.rating = rating.rating;
                  exerciseRating.trainingSurveyUser = surveyUser
                  await exerciseRatingRepository.save(exerciseRating);
                }
              }  
              console.log(surveyUser)
    
            res.status(200).json({ result: true, message: "Опрос завершен успешно" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ result: false, message: "Внутренняя ошибка сервера" });
        }
    }
    

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { userId, date, exerciseRatings } = req.body; 
        
            // Находим пользователя
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ result: false, message: "Пользователь не найден" });
            }
        
            const survey = new TrainingSurvey();
            survey.date = date;
            survey.isConfirmed = false;
        
            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            await surveyRepository.save(survey);
        
            for (const { exerciseName } of exerciseRatings) {
                const exerciseRating = new ExerciseRating();
                exerciseRating.exerciseName = exerciseName;  
                exerciseRating.survey = survey;               
                exerciseRating.rating = null;                 
        
                await AppDataSource.getRepository(ExerciseRating).save(exerciseRating);
            }
        
            res.status(201).json({ result: true, message: "Опрос создан успешно", surveyId: survey.id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ result: false, message: "Внутренняя ошибка сервера" });
        }
    }            
    
    async confirm(req: Request, res: Response): Promise<void> {
        try {
            const { sid } = req.params;

            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            const survey = await surveyRepository.findOne({
                where: { id: sid },
            });

            if (!survey) {
                return res.status(404).json({ result: false, message: "Survey not found" });
            }

            if (survey.isConfirmed) {
                return res.status(400).json({ result: false, message: "Survey is already confirmed" });
            }

            survey.isConfirmed = true;
            await surveyRepository.save(survey);

            res.status(200).json({ result: true, message: "Survey confirmed successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ result: false, message: "Internal server error" });
        }
    }
}

export default new TrainingController();
