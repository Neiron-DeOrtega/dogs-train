import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TrainingSurvey } from "./TrainingSurvey";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dogName: string;

  @Column()
  password: string;

  @Column({unique: true})
  phoneNumber: string;

  @Column({default: false})
  isAdmin: boolean;

  @OneToMany(() => TrainingSurvey, (survey) => survey.user)
  surveys: TrainingSurvey[];
}
