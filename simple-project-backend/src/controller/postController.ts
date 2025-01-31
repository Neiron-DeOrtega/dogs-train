import { Request, Response } from 'express'
import { User } from '../entity/User'
import { AppDataSource } from '../data-source'
import { upload } from '../multer'
import { Post } from '../entity/Post'
import { Media } from '../entity/Media'
import path = require('path')
const sha256 = require('sha256')
const jwt = require('jsonwebtoken')
const fs = require('fs/promises')

type ImageType = 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp';

class PostController {
    async createPost(req: Request, res: Response) {
        try {
            const {text, userId} = req.body
            let files = req.files as Express.Multer.File[]
            if (!files) {
                files = []
            }

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.findOne({where: {id: userId}})

            const postRepository = AppDataSource.getRepository(Post)
            const post = new Post()
            post.text = text
            post.user = user
            post.date = new Date()
            await postRepository.save(post)

            const mediaRepository = AppDataSource.getRepository(Media)
            for (const file of files) {
                const media = new Media()
                media.post = post
                media.mimeType = file.mimetype
                media.fileName = file.originalname
                media.filePath = file.path
                await mediaRepository.save(media)
            }
            return res.status(201).json({message: 'Post created successfully'})
        } catch (error) {
            return res.status(500).json({message: 'Error creating post', error})
        }
    }

    async getPosts(req: Request, res: Response) {
        try {
            const { id } = req.params
            const numberId = !!Number(id) ? Number(id) : 0

            if (numberId === 0) {
                return res.status(400).send({ error: 'Некорректный идентификатор страницы' });
            }

            const postRepository = AppDataSource.getRepository(Post)
            const mediaRepository = AppDataSource.getRepository(Media)
            const postsCount = await postRepository.count()
            const posts = await postRepository.find({
                order: {
                    date: 'DESC'
                },
                take: 10,
                skip: 10 * (numberId - 1),
                relations: ['media', 'user']
            })

            if (posts.length === 0) {
                return res.status(200).send({ message: 'Посты не найдены', postsWithMedia: [] });
            }

            const postsWithMedia = await Promise.all(posts.map(async (post) => {
                if (post.media && post.media.length > 0) {
                    const media = await Promise.all(post.media.map(async (media) => {

                        const fileBuffer = await fs.readFile(media.filePath);
                        const base64 = fileBuffer.toString('base64'); 
                        const base64WithPrefix = `data:${media.mimeType};base64,${base64}`;

                        return {
                            ...media,
                            id: media.id, 
                            fileName: media.fileName,
                            base64: base64WithPrefix
                        }
                    }))

                    return {
                        ...post,
                        id: post.id,
                        text: post.text,
                        user: post.user.login,
                        date: post.date,
                        media: media
                    }
                } else {
                    return {
                        ...post,
                        id: post.id,
                        text: post.text,
                        user: post.user.login,
                        date: post.date,
                        media: []
                    }
                }
            }))
            
            return res.status(200).send({postsWithMedia, postsCount})
            

        } catch (error) {
            return res.status(500).send({ error: 'Произошла ошибка при получении постов' });
        }
    }

    async getMyPosts(req: Request, res: Response) {
        try {
            const { id } = req.params
            const {userId} = req.body
            const numberId = !!Number(id) ? Number(id) : 0

            if (numberId === 0) {
                return res.status(400).send({ error: 'Некорректный идентификатор страницы' });
            }

            const postRepository = AppDataSource.getRepository(Post)
            const mediaRepository = AppDataSource.getRepository(Media)
            const postsCount = (await postRepository.find({
                where: {
                    user: {
                        id: userId
                    }
                }
            })).length
            const posts = await postRepository.find({
                order: {
                    date: 'DESC'
                },
                take: 10,
                skip: 10 * (numberId - 1),
                relations: ['media', 'user'],
                where: {
                    user: {
                        id: userId
                    }
                }
            })

            if (posts.length === 0) {
                return res.status(200).send({ message: 'Посты не найдены', postsWithMedia: [] });
            }

            const postsWithMedia = await Promise.all(posts.map(async (post) => {
                if (post.media && post.media.length > 0) {
                    const media = await Promise.all(post.media.map(async (media) => {

                        const fileBuffer = await fs.readFile(media.filePath);
                        const base64 = fileBuffer.toString('base64'); 
                        const base64WithPrefix = `data:${media.mimeType};base64,${base64}`;

                        return {
                            ...media,
                            id: media.id, 
                            fileName: media.fileName,
                            base64: base64WithPrefix
                        }
                    }))

                    return {
                        ...post,
                        id: post.id,
                        text: post.text,
                        user: post.user.login,
                        date: post.date,
                        media: media
                    }
                } else {
                    return {
                        ...post,
                        id: post.id,
                        text: post.text,
                        user: post.user.login,
                        date: post.date,
                        media: []
                    }
                }
            }))
            
            return res.status(200).send({postsWithMedia, postsCount})
            

        } catch (error) {
            return res.status(500).send({ error: 'Произошла ошибка при получении постов' });
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const {pid} = req.params

            const postRepository = AppDataSource.getRepository(Post)
            const post = await postRepository.findOne({
                where: {
                    id: parseInt(pid)
                },
                relations: ['media']
            })

            if (!post) {
                return res.status(404).send({message: "Пост не найден"})
            }

            if (post.media.length > 0) {
                post.media.forEach((media) => {
                    fs.unlink(media.filePath)
                })
            }

            await postRepository.remove(post)

            return res.status(200).send({message: 'Пост успешно удален'})

        } catch (error) {
            return res.status(500).send({message: 'Внутренняя ошибка сервера'})
        }
    }

    async editPost(req: Request, res: Response) {
        try {
            const {text} = req.body
            const {pid} = req.params

            const postRepository = AppDataSource.getRepository(Post)
            const post = await postRepository.findOne({
                where: {
                    id: Number(pid)
                }
            })

            if (!post) {
                return res.status(404).send({message: "Пост не найден"})
            }

            post.text = text

            await postRepository.save(post)

            return res.status(200).send({message: "Пост успешно отредактирован", post})
        } catch (error) {
            return res.status(500).send({message: error})
        }
    }
}

module.exports = new PostController