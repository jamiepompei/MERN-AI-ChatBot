import axios, { AxiosError } from "axios";

export const loginUser = async (email: string, password: string) => {
    const res = await axios.post("/user/login", { email, password });
    if (res.status !== 200) {
        throw new Error ("Unable to login. Error: " + res.data.message);
    }
    const data = await res.data;
    return data;
};

export const sendChatRequest = async (message: string) => {
    const res = await axios.post("/chat/new", { message } );
    if (res.status !== 200) {
        throw new Error("Could not handle chat. Error: " + res.data.message);
    }
    const data = await res.data;
    return data;
};

export const checkAuthStatus = async () => {
    const res = await axios.get("/user/auth-status");
    if (res.status !== 200) {
        throw new Error("Unable to authenticate! Error: " + res.data.message);
    }
    const data = await res.data;
    return data;
};

export const getUserChats = async () => {
    const res = await axios.get("/chat/all-chats");
    if (res.status !== 200) {
        throw new Error("Could not get chats.Error: " + res.data.message);
    }
    const data = await res.data;
    return data;
};

export const deleteUserChats = async () => {
    const res = await axios.delete("/chat/delete");
    if (res.status !== 200) {
        throw new Error("Could not delete chats. Error: " + res.data.message);
    }
    const data = await res.data;
    return data;
};

export const logOutUser = async () => {
    const res = await axios.get("/user/logout");
    if (res.status !== 200) {
        throw new Error("Could not log user out. Error: " + res.data.message);
    }
    const data = await res.data;
    return data;
};

export const signupUser = async (name: string, email: string, password: string) => {
    try {
         const res = await axios.post("/user/signup", { name, email, password });
         console.log("Response " + res);
        if (res.status !== 200) {
            // Handle other status codes appropriately
            throw new Error("Unable to signup. Status code: " + res.status + " Error was: " + res.data.message);
        } else {
            const data = await res.data;
            return data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
            if (axiosError.response) {
                const errorMessageRegex = /Error:\s(.+?)<br>/;
                const html: string = axiosError.response.data as string;
                const matches: RegExpMatchArray | null = html.match(errorMessageRegex);
            
                let errorMessage = "";
                if (matches && matches.length >= 2) {
                    errorMessage = matches[1];
                    console.log(errorMessage);
                  } else {
                    errorMessage = "Error occurred";
                    console.log(errorMessage);
                  }
                  throw new Error(errorMessage)

            } else if (axiosError.request) {
                // No response received (e.g., network error)
                throw new Error("Unable to connect to server. Please check your internet connection.");
            } else {
                // Other Axios errors (e.g., timeout)
                throw new Error("An error occurred while processing your request. Please try again later.");
            }
        } else {
            // Non-Axios errors
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
};

