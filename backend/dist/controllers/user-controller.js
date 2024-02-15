import { getAllUsers, getUserByEmail, saveUser, getUserById } from "../services/user-services.js";
import { verifyPassword, verifyUserByEmail, hashPassword, verifyUserByTokenId, verifyTokenId } from "../services/authentication-services.js";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsersController = async (req, res, next) => {
    try {
        const users = getAllUsers();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "ERROR",
            cause: error.message
        });
    }
};
export const userLoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        console.log("User " + user);
        verifyUserByEmail(user, true);
        await verifyPassword(password, user.password);
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
    }
    catch (error) {
        console.log(error);
        if (error.cause === 401) {
            return res.status(401).json({
                message: "User is not registered. Sign up and then try logging in.",
                cause: error.message
            });
        }
        else if (error.cause === 403) {
            return res.status(403).json({
                message: "Incorrect password.",
                cause: error.message
            });
        }
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const userSignupController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await getUserByEmail(email);
        verifyUserByEmail(user, false);
        const hashedPassword = await hashPassword(password);
        const userToSave = await saveUser(name, email, hashedPassword);
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
    }
    catch (error) {
        console.log(error);
        if (error.cause === 401) {
            return res.status(401).json({
                message: "User is already registered. Navigate to the login page and login.",
                cause: error.message
            });
        }
        return res.status(200).json({
            message: "ERROR",
            cause: error.message
        });
    }
};
export const userLogoutController = async (req, res, next) => {
    try {
        const user = await getUserById(res.locals.jwtData.id);
        verifyUserByTokenId(user);
        verifyTokenId(user._id.toString(), res.locals.jwtData.id);
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        if (error.cause === 401) {
            return res.status(401).json({
                message: "Authentication error validating user. Navigate to the login page and login again.",
                cause: error.message
            });
        }
        else if (error.cause === 403) {
            return res.status(403).json({
                message: "Authentication error validating token. Navigate to the login page and login again.",
                cause: error.message
            });
        }
        return res.status(200).json({
            message: "ERROR",
            cause: error.message
        });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        const user = await getUserById(res.locals.jwtData.id);
        verifyUserByTokenId(user);
        verifyTokenId(user._id.toString(), res.locals.jwtData.id);
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        if (error.cause === 401) {
            return res.status(401).json({
                message: "Authentication error validating user. Navigate to the login page and login again.",
                cause: error.message
            });
        }
        else if (error.cause === 403) {
            return res.status(403).json({
                message: "Authentication error validating token. Navigate to the login page and login again.",
                cause: error.message
            });
        }
        return res.status(200).json({
            message: "ERROR",
            cause: error.message
        });
    }
    ;
};
//# sourceMappingURL=user-controller.js.map