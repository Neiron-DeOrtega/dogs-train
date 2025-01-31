import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filePath: string; 

    @Column()
    fileName: string; 

    @Column()
    mimeType: string; 

    @ManyToOne(() => Post, (post) => post.media, {onDelete: 'CASCADE'})
    post: Post;
}