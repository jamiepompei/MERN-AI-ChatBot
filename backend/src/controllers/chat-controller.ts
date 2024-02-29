import { NextFunction, Response, Request } from "express";
import { UserService } from "../services/user-service.js";
import { AuthenticationService } from "../services/authentication-service.js";
import { ChatService } from "../services/chat-service.js";
import { errorMiddleware } from "../utils/error-middleware.js";
import { ChatDTO } from "../models/User.js";

const chatService = new ChatService();
const userService = new UserService();
const authService = new AuthenticationService();

export const generateChatCompletionController = async (req: Request, res: Response, next: NextFunction) => {
   try {
    const { message } = req.body;
    const { id } = res.locals.jwtData;
    const chats: ChatDTO[] = await chatService.generateChatCompletion(id, message);
    return res.status(200).json({ chats });
   } catch (error) {
    return next(error);
   }
};

export const sendChatsToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(res.locals.jwtData.id);
        authService.verifyUserByTokenId(user);
        authService.verifyTokenId(user._id.toString(), res.locals.jwtData.id.toString());
        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
        return next(error);
    }
};

export const deleteChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(res.locals.jwtData.id);
        authService.verifyUserByTokenId(user);
        authService.verifyTokenId(user._id.toString(), res.locals.jwtData.id.toString());
        user.chats = [];
        await userService.updateUserChats(user);
        return res.status(200).json({ message: "OK" });
    } catch (error) {
        return next(error);
    }
};

export default errorMiddleware;