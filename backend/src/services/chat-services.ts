import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { getUserById, saveUser } from "./user-services.js";
import { verifyUserByTokenId } from "./authentication-services.js";
import { configureOpenAI } from "../config/openai-config.js";
import User, { IUser, User as UserDocument } from "../models/User.js";
import { Types } from "mongoose";


// Cast the document to User interface

// const user: User = UserDocument.toObject() as User;

export class ChatService {
    
    async generateChatCompletion(userId: Types.ObjectId, message: string): Promise<string[]> {
        try {
            const user: IUser = await getUserById(userId);
            console.log("user {user}", user);
            verifyUserByTokenId(user);
            const chats =  this.getUserChats(user, message);
            const config = configureOpenAI();
            const openAI = new OpenAIApi(config);

            // @ts-ignore
            // remove this once api key can be accessed
            user.chats.push({ id: "helloid", role: "assistant", content: "hello, testing...testing..." });

            // const chatResponse = await openAI.createChatCompletion({ model: "gpt-3.-turbo", messages: chats });
            // user.chats.push(chatResponse.data.choices[0].message);

            await saveUser(user.name, user.email, user.password);
            return user.chats.map(chat => chat.content);
        } catch (error) {
            console.log(error);
            throw new Error("Error generating chat completion");
        }
    }

    private getUserChats(user: User, message: string): ChatCompletionRequestMessage[] {
        const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[];
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        return chats;
    };
}