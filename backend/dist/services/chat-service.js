import { AuthenticationService } from "./authentication-service.js";
import { getOpenAIAPIInstance } from "../config/openai-config.js";
import { UserService } from "./user-service.js";
import { ASSISTANT_ROLE, GPT_MODEL, USER_ROLE } from "../utils/constants.js";
const userService = new UserService();
const authService = new AuthenticationService();
export class ChatService {
    async generateChatCompletion(userId, message) {
        try {
            const user = await userService.getUserById(userId);
            authService.verifyUserByTokenId(user);
            // map user chats to API request format
            const openAiApiChatRequest = user.chats.map(({ role, content }) => ({ role, content }));
            openAiApiChatRequest.push({ content: message, role: USER_ROLE });
            // update user chats with user inputted chats
            user.chats.push({
                content: message, role: USER_ROLE,
            });
            const openAIChatResponseObj = await getOpenAIAPIInstance().createChatCompletion({ model: GPT_MODEL, messages: openAiApiChatRequest });
            // format API response to ChatDTO
            const apiChatObj = { role: ASSISTANT_ROLE, content: openAIChatResponseObj.data.choices[0].message.content };
            // add API response object to user.chats
            user.chats.push(apiChatObj);
            // update the user
            await userService.updateUserChats(user);
            return user.chats;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error generating chat completion. Error: " + error);
        }
    }
    ;
}
//# sourceMappingURL=chat-service.js.map