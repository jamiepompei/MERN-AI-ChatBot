import { AuthenticationService } from '../services/authentication-services.js';
import { UserService } from '../services/user-services.js';
const authService = new AuthenticationService();
const userService = new UserService();
export const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const cause = err.cause || message;
    return res.status(statusCode).json({ message, cause });
};
//# sourceMappingURL=middleware.js.map