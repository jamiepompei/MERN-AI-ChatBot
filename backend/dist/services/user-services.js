import User from "../models/User.js";
export class UserService {
    async getAllUsers() {
        try {
            return await User.find();
        }
        catch (error) {
            throw new Error("Error fetching users " + error.message);
        }
    }
    ;
    async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        }
        catch (error) {
            throw new Error("Error fetching user by email " + error.message);
        }
    }
    ;
    async getUserById(id) {
        try {
            return await User.findById(id);
        }
        catch (error) {
            throw new Error("Error fetching user by id " + error.message);
        }
    }
    ;
    async saveUser(name, email, hashedPassword) {
        try {
            const userToSave = new User({ name, email, hashedPassword });
            return await userToSave.save();
        }
        catch (error) {
            throw new Error("Error saving user: " + error.message);
        }
        ;
    }
    ;
}
//# sourceMappingURL=user-services.js.map