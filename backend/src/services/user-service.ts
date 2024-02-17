import { Types } from "mongoose";
import User, { IUser } from "../models/user.js";

export class UserService{

async getAllUsers(): Promise<IUser[] | null> {
    try {
    return await User.find();
    } catch (error) {
        throw new Error("Error fetching users " + error.message);
    }
};

async getUserByEmail(email: string): Promise<IUser | null> {
    try {
   return await User.findOne({ email });
    } catch (error) {
        throw new Error("Error fetching user by email " + error.message); 
    }
};

async getUserById(id: Types.ObjectId): Promise<IUser | null> {
    try {
    return await User.findById(id);
    } catch (error) {
        throw new Error("Error fetching user by id " + error.message);
    }
};

async saveUser(name: string, email: string, hashedPassword: string): Promise<IUser | null > {
    try {
        const userToSave = new User({ name, email, hashedPassword });
        return await userToSave.save();
    } catch (error) {
        throw new Error("Error saving user: " + error.message);
    };
};
}