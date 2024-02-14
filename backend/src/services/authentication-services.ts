import { compare, hash } from 'bcrypt';
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { Response } from 'express';

export const verifyUserByEmail = (user: any, shouldExist: boolean) => {
    if (shouldExist) {
        if (!user) {
            const error = new Error("User is not registered.");
            error.cause = 401;
            throw error;
    };
    } else  {
        if (user) {
            const error = new Error("User is already registered.");
            error.cause = 401;
            throw error;
            };
    }
};

export const verifyUserByTokenId = (user: any) => {
    if (!user) {
        const error = new Error("User not registered OR token malfunctioned");
        error.cause = 401;
        throw error;
    }
}

export const verifyPassword = async (passwordToVerify: string, existingPassword: string) => {
    await compare(passwordToVerify, existingPassword);
        if (!verifyPassword) {
            const error = new Error("Incorrect password.");
            error.cause = 403;
            throw error;
        };
};

export const verifyTokenId = (userId: any, jwtId: any) => {
    if (userId !== jwtId) {
        const error = new Error("Permissions did not match.");
        error.cause = 403;
        throw error;
    }
};

export const getToken = (userId: any, userEmail: string, tokenttl: string) => {
    createToken(userId, userEmail, tokenttl);  
};

export const createCookie = (res: Response, token: any, expires: any) => {
    res.cookie(COOKIE_NAME, token, {
        path: "/", 
        domain: "localhost", 
        expires,
        httpOnly: true,
        signed: true,
   });
};

export const clearCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        domain: "localhost",
        signed: true,
        path: "/",
    });
};

export const hashPassword = async (password: string) => {
  return await hash(password, 10);
};