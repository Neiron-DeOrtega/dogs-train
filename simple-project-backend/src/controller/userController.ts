import { Request, Response } from 'express'
import { User } from '../entity/User'
import { AppDataSource } from '../data-source'
const sha256 = require('sha256')
const jwt = require('jsonwebtoken')

class UserController {
    async login(req: Request, res: Response) {
        try {
            const {login, password} = req.body

            const hashedPassword = sha256(password)

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.findOne({
                where: {
                    login: login
                }
            })

            if (!user) {
                return res.status(404).send({message: 'User not found'})
            }

            if (user.password !== hashedPassword) {
                return res.status(401).send({message: 'Invalid password'})
            }

            const accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '2h'})
            const refreshToken = jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '14d'})

            return res.status(200).send({message: 'Logged in successfully', accessToken, refreshToken})
        } catch (error) {
            return res.status(500).send({message: 'Internal server error'})
        }
    }

    async register(req: Request, res: Response) {
        try {
            const {login, password} = req.body

            const hashedPassword = sha256(password)

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.findOne({
                where: {
                    login: login
                }
            })

            if (user) {
                return res.status(400).send({message: 'User already exists'})
            }

            const newUser = new User
            newUser.login = login
            newUser.password = hashedPassword

            await userRepository.save(newUser)

            const accessToken = jwt.sign({id: newUser.id}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '2h'})
            const refreshToken = jwt.sign({id: newUser.id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '14d'})

            return res.status(201).send({message: 'User created successfully', accessToken, refreshToken})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    }
}

module.exports = new UserController