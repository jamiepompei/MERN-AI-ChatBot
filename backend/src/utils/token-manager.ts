import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: any, email: any, expiresIn: string) => {
    const payload = { id, email };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not received" })
    }
    return new Promise<void>((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                console.log(err)
                reject(err.message);
                return res.status(401).json({ message: "Token expired" })
            } else {
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        });
    });
};