import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TrainingSurveyUser } from "./TrainingSurveyUser";

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

  @Column({ unique: true })
  phoneNumber: string; 

  @Column({ default: false })
  isAdmin: boolean; 

  @OneToMany(() => TrainingSurveyUser, (tsu) => tsu.user)
  trainingSurveyUsers: TrainingSurveyUser[]; 
}
