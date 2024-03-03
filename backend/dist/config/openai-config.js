import { Configuration, OpenAIApi } from "openai";
export const configureOpenAI = () => {
    const config = new Configuration({
        apiKey: process.env.OPEN_AI_SECRET,
    });
    return config;
};
export const getOpenAIAPIInstance = () => {
    return new OpenAIApi(configureOpenAI());
};
//# sourceMappingURL=openai-config.js.map