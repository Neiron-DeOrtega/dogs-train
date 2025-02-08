import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { User } from "./User";
import { TrainingSurvey } from "./TrainingSurvey";
import { ExerciseRating } from "./ExerciseRating";

@Entity()
export class TrainingSurveyUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.trainingSurveyUsers)
  user: User | null; 

  @ManyToOne(() => TrainingSurvey, (survey) => survey.trainingSurveyUsers, { onDelete: "CASCADE" })
  survey: TrainingSurvey; 

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL'})
  bestDogOwner: User | null; 

  @OneToMany(() => ExerciseRating, (rating) => rating.trainingSurveyUser)
  exerciseRatings: ExerciseRating[];
}
