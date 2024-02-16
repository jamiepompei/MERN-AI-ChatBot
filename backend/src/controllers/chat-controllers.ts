import { NextFunction, Response, Request } from "express";
import { UserService } from "../services/user-services.js";
import { verifyUserByTokenId } from "../services/authentication-services.js";
import { ChatService } from "../services/chat-services.js";

const chatService = new ChatService();
const userService = new UserService();

export const generateChatCompletionController = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
   try {
    console.log("received the following message to reply to {message} ", message);
    const userId = res.locals.jwtData.id;
    const chats = await chatService.generateChatCompletion(userId, message);
    return res.status(200).json({ chats });
   } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
   }
};

export const sendChatsToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // user token check
        const user = await userService.getUserById(res.locals.jwtData.id);
        
        //TO DO refactor to a permission service
        if (!user) {
            return res.status(401).send("User not registered OR token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            console.log("could not get chats because perms did not match")
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message});
    }
};

export const deleteChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // user token check
        const user = await userService.getUserById(res.locals.jwtData.id);
        //TO DO refactor to permission service
        if (!user) {
            return res.status(401).send("User not registered OR token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        user.chats = [];
        console.log("user chats {user.chats} ", user.chats);
        await userService.saveUser(user.name, user.email, user.password);
        return res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message});
    }
};