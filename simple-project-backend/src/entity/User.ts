import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Post } from "./Post"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    login: string

    @Column()
    password: string

    @OneToMany(() => Post, (post) => post.user)
    post: Post[]

}
