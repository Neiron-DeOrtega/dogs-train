import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TrainingSurveyUser } from "./TrainingSurveyUser";
import { ExerciseRating } from "./ExerciseRating";

@Entity()
export class TrainingSurvey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date; 

  @Column({ default: false })
  isConfirmed: boolean; 

  @OneToMany(() => TrainingSurveyUser, (tsu) => tsu.survey)
  trainingSurveyUsers: TrainingSurveyUser[]; 

  @OneToMany(() => ExerciseRating, (rating) => rating.survey, { cascade: true })
  exerciseRatings: ExerciseRating[]; 
}
