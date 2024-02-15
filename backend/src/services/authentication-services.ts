import { compare, hash } from 'bcrypt';

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

export const hashPassword = async (password: string) => {
  return await hash(password, 10);
};