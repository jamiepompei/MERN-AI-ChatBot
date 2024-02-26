import { Types } from "mongoose";
import User, { UserDTO } from "../models/user.js";

export class UserService {

    async getAllUsers(): Promise<UserDTO[] | null> {
        try {
        return await User.find();
        } catch (error) {
            throw new Error("Error fetching users " + error.message);
        }
    };

    async getUserByEmail(email: string): Promise<UserDTO | null> {
        try {
    return await User.findOne({ email });
        } catch (error) {
            throw new Error("Error fetching user by email " + error.message); 
        }
    };

    async getUserById(id: Types.ObjectId): Promise<UserDTO | null> {
        try {
        return await User.findById(id);
        } catch (error) {
            throw new Error("Error fetching user by id " + error.message);
        }
    };

    async updateUserChats(user: UserDTO): Promise<UserDTO | null> { 
        try{
            return await User.findByIdAndUpdate(user._id, { chats: user.chats });
        } catch (error) {
            throw new Error("Error updating user chats: " + error.message);
        }
    }

    async saveUser(name: string, email: string, hashedPassword: string): Promise<UserDTO | null > {
        try {
            const userToSave = new User({ name, email, password: hashedPassword });
            return await userToSave.save();
        } catch (error) {
            throw new Error("Error saving user: " + error.message);
        };
    };
}