import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { User } from "./User"
import { Media } from "./Media";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 1500})
    text: string

    @OneToMany(() => Media, (media) => media.post, {onDelete: "CASCADE"})
    media: Media[];

    @Column()
    date: Date

    @ManyToOne(() => User, (user) => user.post)
    user: User

}
