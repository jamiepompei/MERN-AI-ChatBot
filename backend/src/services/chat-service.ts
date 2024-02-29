import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { AuthenticationService } from "./authentication-service.js";
import { configureOpenAI } from "../config/openai-config.js";
import { UserDTO, ChatDTO } from "../models/User.js";
import { Types } from "mongoose";
import { UserService } from "./user-service.js";


const userService = new UserService();
const authService = new AuthenticationService();

export class ChatService {

    async generateChatCompletion(userId: Types.ObjectId, message: string): Promise<ChatDTO[]> {
        try {
            const user: UserDTO = await userService.getUserById(userId);
            authService.verifyUserByTokenId(user);
            const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[];
            chats.push({ content: message, role: "user" });
            user.chats.push({
               content: message, role: "user",
            });

            const config = configureOpenAI();
            const openAI = new OpenAIApi(config);

            const chatResponse = await openAI.createChatCompletion({ model: "gpt-3.5-turbo", messages: chats });
            const chat: ChatDTO = { role: "assistant", content: chatResponse.data.choices[0].message.content };
            user.chats.push(chat);
            await userService.updateUserChats(user);
            return user.chats;
        } catch (error) {
            console.error(error);
            throw new Error("Error generating chat completion. Error: " + error);
        }
    };
}