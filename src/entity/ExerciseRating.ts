import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TrainingSurvey } from "./TrainingSurvey";

@Entity()
export class ExerciseRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exerciseName: string; 

  @Column()
  rating: number; 

  @ManyToOne(() => TrainingSurvey, (survey) => survey.exerciseRatings)
  survey: TrainingSurvey;
}
