import axios from "axios";

export const loginUser = async (email: string, password: string) => {
    const res = await axios.post("/user/login", { email, password });
    if (res.status !== 200) {
        throw new Error ("Unable to login.Error: " + res.data.message);
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
    const res = await axios.post("/user/signup", { name, email, password });
    if (res.status !== 200) {
        throw new Error ("Unable to signup. Error: " + res.data.message);
    }
    const data = await res.data;
    return data;
};

