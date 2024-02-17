import axios from "axios";

export const loginUser = async (email: string, password: string) => {
    const res = await axios.post("/user/login", { email, password });
    if (res.status !== 200) {
        console.log("Unable to login.")
        throw new Error ("Unable to login.");
    }
    const data = await res.data;
    return data;
};

export const sendChatRequest = async (message: string) => {
    const res = await axios.post("/chat/new", { message } );
    if (res.status !== 200) {
        throw new Error("Could not handle chat.");
    }
    const data = await res.data;
    return data;
};

export const checkAuthStatus = async () => {
    const res = await axios.get("/user/auth-status");
    if (res.status !== 200) {
        throw new Error("Unable to authenticate!");
    }
    const data = await res.data;
    return data;
};

export const getUserChats = async () => {
    const res = await axios.get("/chat/all-chats");
    if (res.status !== 200) {
        throw new Error("Could not get chats.");
    }
    const data = await res.data;
    return data;
};

export const deleteUserChats = async () => {
    const res = await axios.delete("/chat/delete");
    if (res.status !== 200) {
        throw new Error("Could not delete chats.");
    }
    const data = await res.data;
    return data;
};

export const logOutUser = async () => {
    console.log("logging out user...")
    const res = await axios.get("/user/logout");
    if (res.status !== 200) {
        throw new Error("Could not log user out.");
    }
    const data = await res.data;
    return data;
};

export const signupUser = async (name: string, email: string, password: string) => {
    const res = await axios.post("/user/signup", { name, email, password });
    if (res.status !== 200) {
        console.log("Unable to signup.")
        throw new Error ("Unable to signup.");
    }
    const data = await res.data;
    return data;
};
