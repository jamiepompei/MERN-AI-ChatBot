import axios from "axios";
import { ErrorService } from "./error-service";

export class ApiService {
    private errorService: ErrorService;

    constructor() {
        this.errorService = new ErrorService();
    }

    async loginUser(email: string, password: string) {
        let res;
        try {
            res = await axios.post("/user/login", { email, password });
        } catch (error) {
            await this.errorService.handleError(error);
            throw error;
        }

        if (res.status !== 200) {
            throw new Error ("Unable to login. Status code: " + res.status + "Error: " + res.data.message);
        }
        
        return res.data;
    }
    

    async sendChatRequest(message: string) {
        let res;
        try {
            res = await axios.post("/chat/new", { message } );
        } catch (error) {
           await this.errorService.handleError(error);
           throw error;
        }

        if (res.status !== 200) {
            throw new Error("Could not handle chat. Error: " + res.data.message);
        }

        return res.data;
    }

    async checkAuthStatus() {
        let res;
        try {
            res = await axios.get("/user/auth-status");
        } catch (error) {
            await this.errorService.handleError(error);
            throw error;
        }
        if (res.status !== 200) {
            throw new Error("Unable to authenticate! Error: " + res.data.message);
        }
        return res.data;
    }

    async getUserChats() {
        let res;
        try {
            res = await axios.get("/chat/all-chats");
        } catch (error) {
            await this.errorService.handleError(error);
            throw error;
        }
        if (res.status !== 200) {
            throw new Error("Could not get chats.Error: " + res.data.message);
        }
        return res.data;
    }

    async deleteUserChats() {
        let res;
        try {
            res = await axios.delete("/chat/delete");
        } catch (error) {
            await this.errorService.handleError(error);
            throw error;
        }

        if (res.status !== 200) {
            throw new Error("Could not delete chats. Error: " + res.data.message);
        }

        return res.data;
    }

    async logOutUser() {
        let res;
        try {
            res = await axios.get("/user/logout");
        } catch (error) {
           await this.errorService.handleError(error);
           throw error;
        }

        if (res.status !== 200) {
            throw new Error("Could not log user out. Error: " + res.data.message);
        }

        return res.data;
    }

    async signupUser(name: string, email: string, password: string) {
        let res;
        try {
            res = await axios.post("/user/signup", { name, email, password });
        } catch (error) {
            await this.errorService.handleError(error);
            throw error;
        }

        if (res.status !== 200) {
            const errorString: string = "Unable to signup. Status code: " + res.status + " Error: " + res.data.message;
            console.error(errorString);
            throw new Error(errorString); 

        } 

        return res.data;
    }
}

