import { NextFunction, Response, Request } from "express";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { UserService } from "../services/user-service.js";
import { AuthenticationService } from "../services/authentication-service.js";
import { errorMiddleware } from '../utils/error-middleware.js';

const userService = new UserService();
const authenticationService = new AuthenticationService();

export const getAllUsersController = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({ message: "OK", users});
    } catch (error){ 
        return next(error);
    }
};

export const userLoginController = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        console.log("User " + user);
        authenticationService.verifyUserByEmail(user, true);
        await authenticationService.verifyPassword(password, user.password);
        
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        console.log("token " + token);
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
             path: "/", 
             domain: "localhost", 
             expires,
             httpOnly: true,
             signed: true,
        });
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error) { 
        return next(error);
    }
};

export const userSignupController = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        authenticationService.verifyUserByEmail(user, false);
        const hashedPassword = await authenticationService.hashPassword(password);
        const userToSave = await userService.saveUser(name, email, hashedPassword);
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(userToSave._id.toString(), userToSave.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
             path: "/", 
             domain: "localhost", 
             expires,
             httpOnly: true,
             signed: true,
        });
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error) { 
        return next(error);
    }
};

export const userLogoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(res.locals.jwtData.id);
        authenticationService.verifyUserByTokenId(user);
        authenticationService.verifyTokenId(user._id.toString(), res.locals.jwtData.id.toString());
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        return res.status(200).json({ message: "OK"});
    } catch (error) {
        return next(error);
    }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(res.locals.jwtData.id);
        authenticationService.verifyUserByTokenId(user);
        authenticationService.verifyTokenId(user._id.toString(), res.locals.jwtData.id.toString());
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
        return next(error);
    };
}
export default errorMiddleware;