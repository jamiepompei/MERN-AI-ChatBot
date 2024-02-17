import { compare, hash } from 'bcrypt';
import { IUser } from '../models/user.js';

export class AuthenticationService {

    async verifyUserByEmail(user: IUser, shouldExist: boolean): Promise<void> {
        if (shouldExist) {
            if (!user) {
                const error = new Error("User is not registered.");
                error.cause = 401;
                throw error;
        };
        } else  {
            if (user) {
                const error = new Error("User is already registered.");
                error.cause = 409;
                throw error;
                };
        }
    };

  verifyUserByTokenId(user: IUser): void {
        if (!user) {
            const error = new Error("User not registered OR token malfunctioned");
            error.cause = 401;
            throw error;
        }
    }

    async verifyPassword(passwordToVerify: string, existingPassword: string): Promise<void> {
        if (!(await compare(passwordToVerify, existingPassword))) {
            const error = new Error("Incorrect password.");
            error.cause = 403;
            throw error;
        }
    };

    verifyTokenId(userId: string, jwtId: string): void {
        if (userId !== jwtId) {
            const error = new Error("Permissions did not match.");
            error.cause = 403;
            throw error;
        }
    };

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    };
}