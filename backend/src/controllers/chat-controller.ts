import { NextFunction, Response, Request } from "express";
import { UserService } from "../services/user-service.js";
import { AuthenticationService } from "../services/authentication-service.js";
import { ChatService } from "../services/chat-service.js";
import { errorMiddleware } from "../utils/error-middleware.js";

const chatService = new ChatService();
const userService = new UserService();
const authService = new AuthenticationService();

export const generateChatCompletionController = async (req: Request, res: Response, next: NextFunction) => {
    const message  = req.body;
   try {
    const userId = res.locals.jwtData.id;
    const chats = await chatService.generateChatCompletion(userId, message.getReader.toString());
    return res.status(200).json({ chats });
   } catch (error) {
    return next(error);
   }
};

export const sendChatsToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(res.locals.jwtData.id);
        
        authService.verifyUserByTokenId(user);
        authService.verifyTokenId(user._id.toString(),res.locals.jwtData.id.toString())
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
       
        await userService.saveUser(user.name, user.email, user.password);
        return res.status(200).json({ message: "OK" });
    } catch (error) {
        return next(error);
    }
};
export default errorMiddleware;