import User from "../models/User.js";
export const getAllUsers = async () => {
    try {
        return await User.find();
    }
    catch (error) {
        throw new Error("Error fetching users " + error.data.message);
    }
};
export const getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    }
    catch (error) {
        throw new Error("Error fetching user by email " + error.data.message);
    }
};
export const getUserById = async (id) => {
    try {
        return await User.findById(id);
    }
    catch (error) {
        throw new Error("Error fetching user by id " + error.data.message);
    }
};
export const saveUser = async (name, email, hashedPassword) => {
    try {
        const userToSave = new User({ name, email, hashedPassword });
        await userToSave.save();
    }
    catch (error) {
        throw new Error("Error saving user: " + error.data.message);
    }
    ;
};
//# sourceMappingURL=user-services.js.map