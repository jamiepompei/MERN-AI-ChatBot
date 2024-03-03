import { Configuration, OpenAIApi } from "openai";

export const configureOpenAI = (): Configuration => {
    const config = new Configuration({
        apiKey: process.env.OPEN_AI_SECRET,
    });
    return config;
};

export const getOpenAIAPIInstance = (): OpenAIApi => {
    return new OpenAIApi(configureOpenAI());
}