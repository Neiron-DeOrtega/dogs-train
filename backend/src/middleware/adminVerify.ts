import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
const jwt = require('jsonwebtoken')

export const adminVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body

        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOne({
            where: {
                id: userId
            },
        })

        if (user.isAdmin) {
            next()
        } else {
            res.status(403).send({result: false, error: 'access denied'})
        }
    } catch (error) {
        res.status(400).send({result: false, error: error.message})
    }
}