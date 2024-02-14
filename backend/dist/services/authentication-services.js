import { compare, hash } from 'bcrypt';
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const verifyUserByEmail = (user, shouldExist) => {
    if (shouldExist) {
        if (!user) {
            const error = new Error("User is not registered.");
            error.cause = 401;
            throw error;
        }
        ;
    }
    else {
        if (user) {
            const error = new Error("User is already registered.");
            error.cause = 401;
            throw error;
        }
        ;
    }
};
export const verifyUserByTokenId = (user) => {
    if (!user) {
        const error = new Error("User not registered OR token malfunctioned");
        error.cause = 401;
        throw error;
    }
};
export const verifyPassword = async (passwordToVerify, existingPassword) => {
    await compare(passwordToVerify, existingPassword);
    if (!verifyPassword) {
        const error = new Error("Incorrect password.");
        error.cause = 403;
        throw error;
    }
    ;
};
export const verifyTokenId = (userId, jwtId) => {
    if (userId !== jwtId) {
        const error = new Error("Permissions did not match.");
        error.cause = 403;
        throw error;
    }
};
export const getToken = (userId, userEmail, tokenttl) => {
    createToken(userId, userEmail, tokenttl);
};
export const createCookie = (res, token, expires) => {
    res.cookie(COOKIE_NAME, token, {
        path: "/",
        domain: "localhost",
        expires,
        httpOnly: true,
        signed: true,
    });
};
export const clearCookie = (res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        domain: "localhost",
        signed: true,
        path: "/",
    });
};
export const hashPassword = async (password) => {
    return await hash(password, 10);
};
//# sourceMappingURL=authentication-services.js.map