import { compare, hash } from 'bcrypt';
export class AuthenticationService {
    async verifyUserByEmail(user, shouldExist) {
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
                error.cause = 409;
                throw error;
            }
            ;
        }
    }
    ;
    verifyUserByTokenId(user) {
        if (!user) {
            const error = new Error("User not registered OR token malfunctioned");
            error.cause = 401;
            throw error;
        }
    }
    ;
    async verifyPassword(passwordToVerify, existingPassword) {
        if (!(await compare(passwordToVerify, existingPassword))) {
            const error = new Error("Incorrect password.");
            error.cause = 403;
            throw error;
        }
    }
    ;
    verifyTokenId(userId, jwtId) {
        if (userId !== jwtId) {
            const error = new Error("Permissions did not match.");
            error.cause = 403;
            throw error;
        }
    }
    ;
    async hashPassword(password) {
        return await hash(password, 10);
    }
    ;
}
//# sourceMappingURL=authentication-service.js.map