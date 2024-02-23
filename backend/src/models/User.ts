import mongoose from "mongoose";

export interface ChatDTO {
    id?: string;
    role: string;
    content: string;
}

export interface UserDTO extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    chats: ChatDTO[];
}

const chatSchema = new mongoose.Schema({
    id: {
        type: String, 
        default: mongoose.Types.ObjectId,
    },
    role: {
        type: String, 
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email : {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    chats: [chatSchema],
});

export default mongoose.model<UserDTO>("User", userSchema);