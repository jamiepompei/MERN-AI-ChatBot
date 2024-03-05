import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME, TOKEN_EXPIRATION } from "../utils/constants.js";
import { UserService } from "../services/user-service.js";
import { AuthenticationService } from "../services/authentication-service.js";
import { errorMiddleware } from '../utils/error-middleware.js';
const userService = new UserService();
const authenticationService = new AuthenticationService();
export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        return next(error);
    }
};
export const userLoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new Error("No User exists!");
        }
        await authenticationService.verifyUserByEmail(user, true);
        await authenticationService.verifyPassword(password, user.password);
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, TOKEN_EXPIRATION);
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
    }
    catch (error) {
        return next(error);
    }
};
export const userSignupController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        if (user) {
            throw new Error("User already exists.");
        }
        await authenticationService.verifyUserByEmail(user, false);
        const hashedPassword = await authenticationService.hashPassword(password);
        const userToSave = await userService.saveUser(name, email, hashedPassword);
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(userToSave._id.toString(), userToSave.email, TOKEN_EXPIRATION);
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
    }
    catch (error) {
        return next(error);
    }
};
export const userLogoutController = async (req, res, next) => {
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
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        return next(error);
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(res.locals.jwtData.id);
        authenticationService.verifyUserByTokenId(user);
        authenticationService.verifyTokenId(user._id.toString(), res.locals.jwtData.id.toString());
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        return next(error);
    }
    ;
};
export default errorMiddleware;
//# sourceMappingURL=user-controller.js.map