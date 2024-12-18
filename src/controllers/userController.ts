import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
const sha1 = require('sha1')
const jwt = require('jsonwebtoken')

class UserController {
    async login(req: Request, res: Response) {
        try {
            const {phoneNumber, password} = req.body

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.findOneBy({phoneNumber: phoneNumber})

            if (sha1(password) === user.password) {
                const accessToken = jwt.sign({uid: user.id}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '2h'})
                const refreshToken = jwt.sign({uid: user.id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '14d'})

                res.status(200).send({result: true, accessToken, refreshToken})
            } else {
                throw new Error('invalid password')
            }
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {name, dogName, password, phoneNumber} = req.body
            const hashedPassword = sha1(password)

            const newUser = new User()

            newUser.name = name
            newUser.dogName = dogName
            newUser.password = hashedPassword
            newUser.phoneNumber = phoneNumber

            await AppDataSource.manager.save(newUser)

            const accessToken = jwt.sign({uid: newUser.id}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '2h'})
            const refreshToken = jwt.sign({uid: newUser.id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '14d'})

            res.status(201).send({result: true, accessToken, refreshToken})
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const {id, name, dogName, phoneNumber} = req.body

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.findOneBy({id: id})

            user.name = name
            user.dogName = dogName
            user.phoneNumber = phoneNumber

            await AppDataSource.manager.save(user)

            res.status(200).send({result: true, user: user})
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.body;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id });
    
            if (!user) {
                throw new Error('User not found');
            }
    
            await userRepository.remove(user);
    
            res.status(200).send({ result: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }

    async getStats(req: Request, res: Response) {

    }

    async getUserById(req: Request, res: Response) {
        try {
            const { uid } = req.params;
    
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { id: Number(uid) },
                relations: ['surveys', 'surveys.exerciseRatings'],
            });
    
            if (!user) {
                throw new Error('User not found');
            }
    
            res.status(200).send({ result: true, user });
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
    
            const users = await userRepository.find({
                relations: ['surveys', 'surveys.exerciseRatings'],
            });
    
            res.status(200).send({ result: true, users });
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
}

export default new UserController();
