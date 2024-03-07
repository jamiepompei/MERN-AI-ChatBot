import axios from "axios";
import { ErrorService } from "./error-service";

export class ApiService {
    private errorService: ErrorService;

    constructor() {
        this.errorService = new ErrorService();
    }

    async loginUser(email: string, password: string) {
        try {
            const res = await axios.post("/user/login", { email, password });
            if (res.status !== 200) {
                throw new Error ("Unable to login. Status code: " + res.status + "Error: " + res.data.message);
            } else {
                const data = await res.data;
                return data;
            }
        } catch (error) {
            this.errorService.handleError(error);
        }
    }

    async sendChatRequest(message: string) {
        try {
            const res = await axios.post("/chat/new", { message } );
            if (res.status !== 200) {
                throw new Error("Could not handle chat. Error: " + res.data.message);
            }
            const data = await res.data;
            return data;
        } catch (error) {
            this.errorService.handleError(error);
        }
    }

    async checkAuthStatus() {
        try {
            const res = await axios.get("/user/auth-status");
            if (res.status !== 200) {
                throw new Error("Unable to authenticate! Error: " + res.data.message);
            }
            const data = await res.data;
            return data;
        } catch (error) {
            this.errorService.handleError(error);
        }
    }

    async getUserChats() {
        try {
            const res = await axios.get("/chat/all-chats");
            if (res.status !== 200) {
                throw new Error("Could not get chats.Error: " + res.data.message);
            }
            const data = await res.data;
            return data;
        } catch (error) {
            this.errorService.handleError(error);
        }
    }

    async deleteUserChats() {
        try {
            const res = await axios.delete("/chat/delete");
            if (res.status !== 200) {
                throw new Error("Could not delete chats. Error: " + res.data.message);
            }
            const data = await res.data;
            return data;
        } catch (error) {
            this.errorService.handleError(error);
        }
    }

    async logOutUser() {
        try {
            const res = await axios.get("/user/logout");
            if (res.status !== 200) {
                throw new Error("Could not log user out. Error: " + res.data.message);
            }
            const data = await res.data;
            return data;
        } catch (error) {
            this.errorService.handleError(error);
        }
    }

    async signupUser(name: string, email: string, password: string) {
        try {
            const res = await axios.post("/user/signup", { name, email, password });
            if (res.status !== 200) {
                throw new Error("Unable to signup. Status code: " + res.status + " Error: " + res.data.message);
            } else {
                const data = await res.data;
                return data;
            }
        } catch (error) {
            this.errorService.handleError(error);
        }
    }
}

