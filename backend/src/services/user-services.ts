import User from "../models/User.js";

export const getAllUsers = async ()=> {
    try {
    return await User.find();
    } catch (error) {
        throw new Error("Error fetching users " + error.message);
    }
};

export const getUserByEmail = async (email: any) => {
    try {
   return await User.findOne({email});
    } catch (error) {
        throw new Error("Error fetching user by email " + error.message); 
    }
};

export const getUserById = async (id: any) => {
    try {
    return await User.findById(id);
    } catch (error) {
        throw new Error("Error fetching user by id " + error.message);
    }
};

export const saveUser = async (name: any, email: any, hashedPassword: any) => {
    try {
        const userToSave = new User({ name, email, hashedPassword });
        return await userToSave.save();
    } catch (error) {
        throw new Error("Error saving user: " + error.message);
    };
};