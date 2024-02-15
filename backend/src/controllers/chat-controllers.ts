import { NextFunction, Response, Request } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";


export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
   try {
    console.log("received the following message to reply to {message} ", message);
    //TO DO refactor to service to find user
        const user = await User.findById(res.locals.jwtData.id);
        console.log("user {user}", user);
        if(!user) return res.status(401).json({message:"User not registered or token malfunctioned"}); 

        // grab chats of user
        // TO DO refactor to get chats to chat service
        const chats = user.chats.map(({role, content}) => ({ role, content })) as ChatCompletionRequestMessage[];
            chats.push({ content: message, role: "user" });
            user.chats.push({content: message, role: "user"});
        
        // send all chats with new one to openai api
        // TO DO refactor to openAIApi service 
        const config = configureOpenAI();
        const openAI = new OpenAIApi(config);
        const chatResponse = [];
        console.log(chatResponse);
        // @-ts-ignore
        //remove this once api key can be accessed
        user.chats.push({id: "helloid", role: "assistant", content: "hello, testing...testing..."});
        // await openAI.createChatCompletion({ model:"gpt-3.-turbo", messages: chats, });
        // user.chats.push(chatResponse.data.choices[0].message);

        // TO DO refactor to user service
        await user.save();
        return res.status(200).json({ chats: user.chats });
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