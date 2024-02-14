import User from "../models/User.js";

export const getAllUsers = async ()=> {
    try {
    return await User.find();
    } catch (error) {
        throw new Error("Error fetching users " + error.data.message);
    }
};

export const getUserByEmail = async (email: any) => {
    try {
   return await User.findOne({email});
    } catch (error) {
        throw new Error("Error fetching user by email " + error.data.message); 
    }
};

export const getUserById = async (id: any) => {
    try {
    return await User.findById(id);
    } catch (error) {
        throw new Error("Error fetching user by id " + error.data.message);
    }
};

export const saveUser = async (name: string, email: string, hashedPassword: string) => {
    try {
        const userToSave = new User({ name, email,hashedPassword });
        await userToSave.save();
    } catch (error) {
        throw new Error("Error saving user: " + error.data.message);
    };
};