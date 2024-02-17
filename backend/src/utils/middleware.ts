import { NextFunction, Response, Request } from 'express';
import { AuthenticationService } from '../services/authentication-services.js';
import { UserService } from '../services/user-services.js';

const authService = new AuthenticationService();
const userService = new UserService();

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): Response<any> | void => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const cause = err.cause || message;
    return res.status(statusCode).json({ message, cause });
};
