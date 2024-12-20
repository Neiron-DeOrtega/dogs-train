import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken')

export const tokenVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)

        if (!token) {
            throw new Error('token is empty')
        }
    
        const tokenResponse = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        req.body.userId = tokenResponse.userId
        next()
    } catch (error) {
        console.error(error)
        res.status(400).send({result: false, error: error.message})
    }
}