import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { TrainingSurvey } from '../entity/TrainingSurvey';
import { ExerciseRating } from '../entity/ExerciseRating';
import { TrainingSurveyUser } from '../entity/TrainingSurveyUser';
import { Not } from 'typeorm';

class TrainingController {
    async submit(req: Request, res: Response): Promise<void> {
        try {
            const { userId, surveyId, exerciseRatings, bestDogOwnerId } = req.body;
    
            const userRepository = AppDataSource.getRepository(User);
            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            const surveyUserRepository = AppDataSource.getRepository(TrainingSurveyUser);
            const exerciseRatingRepository = AppDataSource.getRepository(ExerciseRating);
    
            // Проверка пользователя
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ result: false, message: "Пользователь не найден" });
                return;
            }
    
            // Проверка опроса
            const survey = await surveyRepository.findOne({
                where: { id: surveyId },
                relations: ["exerciseRatings"],
            });
            if (!survey) {
                res.status(404).json({ result: false, message: "Опрос не найден" });
                return;
            }
    
            // Проверка, проходил ли пользователь этот опрос
            const existingSurveyUser = await surveyUserRepository.findOne({
                where: { user: user, survey: survey },
            });
            if (existingSurveyUser) {
                res.status(400).json({ result: false, message: "Этот опрос уже пройден" });
                return;
            }
    
            // Создание записи о прохождении опроса
            const surveyUser = surveyUserRepository.create({ user, survey });
    
            // Добавление лучшего владельца собаки (если есть)
            if (bestDogOwnerId) {
                const bestDogOwner = await userRepository.findOne({ where: { id: bestDogOwnerId } });
                if (!bestDogOwner) {
                    res.status(404).json({ result: false, message: "Лучший владелец собаки не найден" });
                    return;
                }
                surveyUser.bestDogOwner = bestDogOwner;
            }
    
            await surveyUserRepository.save(surveyUser);
    
            // Обработка переданных рейтингов
            for (const exercise of exerciseRatings) {
                let newExercise = new ExerciseRating
                newExercise.rating = exercise.rating
                newExercise.trainingSurveyUser = surveyUser
                newExercise.exerciseName = exercise.exerciseName
                newExercise.survey = survey
    
                await exerciseRatingRepository.save(newExercise);
            }
    
            res.status(200).json({ result: true, message: "Опрос завершен успешно" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ result: false, message: "Внутренняя ошибка сервера" });
        }
    }    

    async create(req: Request, res: Response) {
        try {
            const { date, exerciseRatings } = req.body;
    
            if (!date || !exerciseRatings) {
                return res.status(400).json({ 
                    result: false, 
                    message: "Пожалуйста, укажите дату и список оценок упражнений." 
                });
            }
    
            // Преобразуем дату в начало дня в формате UTC
            const parsedDate = new Date(date);
            const utcDate = new Date(Date.UTC(
                parsedDate.getUTCFullYear(),
                parsedDate.getUTCMonth(),
                parsedDate.getUTCDate()
            ));
    
            // Создаем опрос
            const survey = new TrainingSurvey();
            survey.date = utcDate;
            survey.isConfirmed = false;
    
            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            await surveyRepository.save(survey);
    
            // Создаем оценки упражнений
            for (const { exerciseName } of exerciseRatings) {
                const exerciseRating = new ExerciseRating();
                exerciseRating.exerciseName = exerciseName;
                exerciseRating.survey = survey;
                exerciseRating.rating = null;
    
                await AppDataSource.getRepository(ExerciseRating).save(exerciseRating);
            }
    
            res.status(201).json({ 
                result: true, 
                message: "Опрос создан успешно", 
                surveyId: survey.id 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                result: false, 
                message: "Внутренняя ошибка сервера" 
            });
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

    async delete(req: Request, res: Response) {
        try {
            const { sid } = req.params

            console.log(sid)

            const surveyRepository = AppDataSource.getRepository(TrainingSurvey)
            const survey = await surveyRepository.findOneBy({id: sid})

            if (!survey) {
                return res.status(404).send({result: false, error: "Опрос не найден"})
            }

            await surveyRepository.remove(survey)
            res.status(200).send({result: true, message: "Опрос удален успешно"})
        } catch (error) {
            res.status(400).send({result: false, error: error.message})
        }
    }
    
    async loadUnconfirmedSurveys(req: Request, res: Response) {
        try {
          const trainingSurveyRepository = AppDataSource.getRepository(TrainingSurvey);
    
          const unconfirmedSurveys = await trainingSurveyRepository.find({
            where: { isConfirmed: false },
            relations: ["exerciseRatings"], 
          });

          if (!unconfirmedSurveys) {
            return res.status(404).json({ result: false, error: "Опросы не найдены" });
          }
    
          const response = unconfirmedSurveys?.map((survey) => ({
            id: survey.id,
            date: survey.date.toISOString().split("T")[0],
            exercises: survey.exerciseRatings.map((exercise) => ({
              id: exercise.id,
              exerciseName: exercise.exerciseName,
            })),
          }));
    
          res.status(200).json(response);
        } catch (error) {
          console.error("Ошибка при загрузке опросов:", error);
          res.status(500).json({ error: "Ошибка сервера" });
        }
      }

      async loadSurvey(req: Request, res: Response) {
        try {
            const { userId } = req.body;

            console.log('7')
    
            const surveyRepository = AppDataSource.getRepository(TrainingSurvey);
            const exerciseRatingsRepository = AppDataSource.getRepository(ExerciseRating);    

            const latestSurvey = await surveyRepository.findOne({
                where: { isConfirmed: true },
                order: { id: "DESC" },
                relations: ["exerciseRatings"],
            });
    
            if (!latestSurvey) {
                return res.status(404).json({ result: false, error: "No confirmed surveys found" });
            }

            const resultSurvey = latestSurvey.exerciseRatings.filter((exercise) => {
                return exercise.rating === null 
            })
    
            // Проверяем, есть ли записи в ExerciseRating для текущего пользователя
            const existingRatings = await exerciseRatingsRepository.find({
                where: {
                    trainingSurveyUser: { user: { id: userId } },
                    survey: { id: latestSurvey.id },
                },
            });
    
            if (existingRatings.length > 0) {
                return res.status(200).send({result: false, message: "Опрос уже пройден"})
            }
    
            const userRepository = AppDataSource.getRepository(User);
            const usersList = await userRepository.find({
                where: { id: Not(userId) },
                select: ["id", "name", "dogName"],
            });
    
            return res.status(200).json({
                result: true,
                survey: {
                    id: latestSurvey.id,
                    exerciseRatings: resultSurvey,
                    usersList: usersList,
                },
            });
        } catch (error) {
            res.status(400).send({
                result: false,
                error: error.message,
            });
        }
    }
}    
    

export default new TrainingController();
