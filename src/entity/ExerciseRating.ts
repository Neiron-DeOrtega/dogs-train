import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TrainingSurvey } from "./TrainingSurvey";
import { TrainingSurveyUser } from "./TrainingSurveyUser";

@Entity()
export class ExerciseRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exerciseName: string; 

  @Column({ nullable: true })
  rating: number; 

  @ManyToOne(() => TrainingSurvey, (survey) => survey.exerciseRatings)
  survey: TrainingSurvey;

  @ManyToOne(() => TrainingSurveyUser, (tsu) => tsu.exerciseRatings)
  trainingSurveyUser: TrainingSurveyUser;
}
