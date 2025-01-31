import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

export const tokenVerify = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(401).send({ message: "Пользователь не авторизован" });
    }

    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
        
        req.body.userId = payload.id;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({ message: "Токен истёк" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).send({ message: "Невалидный токен" });
        } else {
            return res.status(401).send({ message: "Ошибка при проверке токена" });
        }
    }
};