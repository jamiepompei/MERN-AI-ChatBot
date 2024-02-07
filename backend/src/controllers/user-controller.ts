import { Request } from "express-validator/src/base.js";
import User from "../models/User.js"
import { NextFunction, Response } from "express";

export const getAllUsers = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users});
    } catch (error){ 
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message})
    }
}