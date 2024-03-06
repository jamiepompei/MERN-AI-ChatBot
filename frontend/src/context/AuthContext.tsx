import { ReactNode, createContext, useState, useEffect, useContext } from 'react';
import { ApiService } from '../helpers/api-service';


type User = {
    name: string, 
    email: string,
}
type UserAuth = {
    isLoggedIn: boolean,
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
const apiService = new ApiService();
const AuthContext = createContext<UserAuth | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User|null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // check if the user's cookies are valid
        async function checkStatus() {
            try {
                const data = await apiService.checkAuthStatus();
                if (data) {
                    setUser({ email: data.email, name: data.name });
                    setIsLoggedIn(true);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                        console.error("An error occurred while checking authentication status: ", error.message);
                    }
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                setLoading(false); // Update loading state regardless of success or failure
            }
        }
        checkStatus();
    }, []);
    
    const login = async (email: string, password: string) => {
        const data = await apiService.loginUser(email, password);
        if (data) {
            setUser({ email: data.email, name: data.name})
            setIsLoggedIn(true);
        }
    };
    const signup = async (name: string, email: string, password: string) => {
        try {
        const data = await apiService.signupUser(name, email, password);
        if (data) {
            setUser(null);
            setIsLoggedIn(false);
        }
    } catch (error: unknown) {
        setUser(null);
        setIsLoggedIn(false);
        throw error;
    }
    };
    const logout = async () => {
        await apiService.logOutUser();
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload();
    };

    const value = {
        user,
        isLoggedIn,
        loading,
        login, 
        logout, 
        signup,
    };
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);