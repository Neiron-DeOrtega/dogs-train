import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class BestDogVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  dogOwner: User;  

  @ManyToOne(() => User)
  voter: User;  
}
