import { NextFunction, Response, Request } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
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
        //TO DO refactor to user service
        const user = await User.findById(res.locals.jwtData.id);
        //TO DO refactor to a permission service
        if (!user) {
            console.log("could not get chats due to bad user")
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
        //TO DO refactor to user service
        const user = await User.findById(res.locals.jwtData.id);
        //TO DO refactor to permission service
        if (!user) {
            return res.status(401).send("User not registered OR token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        // @ts-ignore
        user.chats = [];
        console.log("user chats {user.chats} ", user.chats);
        // TO DO refactor to user service
        await user.save();
        return res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message});
    }
};