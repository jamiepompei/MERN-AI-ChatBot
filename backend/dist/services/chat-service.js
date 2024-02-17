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
            console.log("user {user}", user);
            authService.verifyUserByTokenId(user);
            const chats = this.getUserChats(user, message);
            const config = configureOpenAI();
            const openAI = new OpenAIApi(config);
            // @ts-ignore
            // remove this once api key can be accessed
            user.chats.push({ id: "helloid", role: "assistant", content: "hello, testing...testing..." });
            // const chatResponse = await openAI.createChatCompletion({ model: "gpt-3.-turbo", messages: chats });
            // user.chats.push(chatResponse.data.choices[0].message);
            await userService.saveUser(user.name, user.email, user.password);
            return user.chats.map(chat => chat.content);
        }
        catch (error) {
            console.log(error);
            throw new Error("Error generating chat completion");
        }
    }
    ;
    getUserChats(user, message) {
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({
            content: message, role: "user",
            id: ""
        });
        return chats;
    }
    ;
}
//# sourceMappingURL=chat-service.js.map