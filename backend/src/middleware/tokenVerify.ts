import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken')

export const tokenVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('token is empty')
        } else {
            const token = req.headers.authorization.split(' ')[1]
            console.log(req.headers.authorization)
            const tokenResponse = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
            req.body.userId = tokenResponse.userId
            next()
        }

    } catch (error) {
        res.status(400).send({result: false, error: error.message})
    }
}