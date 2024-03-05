import { NextFunction, Response, Request } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): Response<any> | void => {
    console.error(err);
    const statusCode = res.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const cause = err.cause || message; 
    return res.status(statusCode).json({ message, cause });
};
