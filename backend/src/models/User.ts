import { randomUUID } from "crypto";
import mongoose from "mongoose";

interface Chat {
    id: string;
    role: string;
    content: string;
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    chats: Chat[];
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
})

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

export default mongoose.model<IUser>("User", userSchema);