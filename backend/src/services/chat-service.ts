import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { AuthenticationService } from "./authentication-service.js";
import { configureOpenAI, getOpenAIAPIInstance } from "../config/openai-config.js";
import { UserDTO, ChatDTO } from "../models/User.js";
import { Types } from "mongoose";
import { UserService } from "./user-service.js";
import { ASSISTANT_ROLE, GPT_MODEL, USER_ROLE } from "../utils/constants.js";


const userService = new UserService();
const authService = new AuthenticationService();

export class ChatService {

    async generateChatCompletion(userId: Types.ObjectId, message: string): Promise<ChatDTO[]> {
        try {
            const user: UserDTO = await userService.getUserById(userId);
            authService.verifyUserByTokenId(user);
            const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[];
            chats.push({ content: message, role: USER_ROLE });
            user.chats.push({
               content: message, role: USER_ROLE,
            });

            const chatResponse = await getOpenAIAPIInstance().createChatCompletion({ model: GPT_MODEL, messages: chats });
            const chat: ChatDTO = { role: ASSISTANT_ROLE, content: chatResponse.data.choices[0].message.content };
            user.chats.push(chat);
            await userService.updateUserChats(user);
            return user.chats;
        } catch (error) {
            console.error(error);
            throw new Error("Error generating chat completion. Error: " + error);
        }
    };
}