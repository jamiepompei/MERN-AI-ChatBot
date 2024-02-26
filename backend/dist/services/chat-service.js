import { OpenAIApi } from "openai";
import { AuthenticationService } from "./authentication-service.js";
import { configureOpenAI } from "../config/openai-config.js";
import { UserService } from "./user-service.js";
const userService = new UserService();
const authService = new AuthenticationService();
export class ChatService {
    async generateChatCompletion(userId, message) {
        try {
            const user = await userService.getUserById(userId);
            authService.verifyUserByTokenId(user);
            const chats = user.chats.map(({ role, content }) => ({ role, content }));
            chats.push({ content: message, role: "user" });
            user.chats.push({
                content: message, role: "user",
                id: ""
            });
            const config = configureOpenAI();
            const openAI = new OpenAIApi(config);
            const chatResponse = await openAI.createChatCompletion({ model: "gpt-3.5-turbo", messages: chats });
            const chat = { role: "assistant", content: chatResponse.data.choices[0].message.content };
            user.chats.push(chat);
            await userService.updateUserChats(user);
            return user.chats.map(chat => chat.content);
        }
        catch (error) {
            console.error(error);
            throw new Error("Error generating chat completion. Error: " + error);
        }
    }
    ;
}
//# sourceMappingURL=chat-service.js.map