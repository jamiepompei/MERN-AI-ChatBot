import { NextFunction, Response, Request } from "express";
import { getAllUsers, getUserByEmail, saveUser, getUserById } from "../services/user-services.js";
import { verifyPassword, verifyUserByEmail, getToken, createCookie, clearCookie, hashPassword, verifyUserByTokenId, verifyTokenId } from "../services/authentication-services.js";

export const getAllUsersController = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try {
        const users = getAllUsers();
        return res.status(200).json({ message: "OK", users});
    } catch (error){ 
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message})
    }
};

export const userLoginController = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        verifyUserByEmail(user, true);
        await verifyPassword(password, user.password);
        handleClearAndCreateCookie(res,user);
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error){ 
        // TO DO fix error handling
        console.log(error);
        if (error.status === 401) {
            throw new Error("User is not registered. Sign up and then try logging in.");
        }
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userSignupController = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const user = await getUserByEmail(email);
        verifyUserByEmail(user, false);
        const hashedPassword = await hashPassword(password);
        await saveUser(name, email, hashedPassword);
        handleClearAndCreateCookie(res, user);
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error){ 
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message});
    }
};

export const userLogoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserById(res.locals.jwtData.id);
        verifyUserByTokenId(user);
        verifyTokenId(user._id.toString(), res.locals.jwtData.id);
        handleClearCookie(res);
        return res.status(200).json({ message: "OK"});
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message});
    }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserById(res.locals.jwtData.id);
        verifyUserByTokenId(user);
        verifyTokenId(user._id.toString(), res.locals.jwtData.id);
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message});
    };
}

// Helper method to handle token-related logic
const handleClearAndCreateCookie = (res: Response, user: any) => {
    clearCookie(res);
    const token = getToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    createCookie(res, token, expires);
};

const handleClearCookie = (res: Response) => {
    clearCookie(res);
};