import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { ExerciseRating } from "./ExerciseRating";

@Entity()
export class TrainingSurvey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ default: false }) 
  isCompleted: boolean;  

  @ManyToOne(() => User, (user) => user.surveys)
  user: User;

  @OneToMany(() => ExerciseRating, (rating) => rating.survey)
  exerciseRatings: ExerciseRating[];

  @ManyToOne(() => User)
  bestDogOwner: User;
}
