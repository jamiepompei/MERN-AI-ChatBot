import { ReactNode, createContext, useState, useEffect, useContext } from 'react';
import { loginUser, checkAuthStatus, logOutUser, signupUser } from '../helpers/api-service';

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
const AuthContext = createContext<UserAuth | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User|null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fetch if the user's cookies are valid
        async function checkStatus() {
            try {
                const data = await checkAuthStatus();
                if (data) {
                    setUser({ email: data.email, name: data.name });
                    setIsLoggedIn(true);
                }
            } catch (error: unknown) {
                // TODO currently, an error is thrown when a user is not logged in and accesses signup, home, or logout pages.
                //for now, we are catching authentication status check errors, logging the response, and always setting the user
                // null and isLoggedIn false
                //finally, update the loading state
                if (error instanceof Error) {
                        console.error("An error occurred while checking authentication status:", error.message);
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
        const data = await loginUser(email, password);
        if (data) {
            setUser({ email: data.email, name: data.name})
            setIsLoggedIn(true);
        }
    };
    const signup = async (name: string, email: string, password: string) => {
        const data = await signupUser(name, email, password);
        if (data) {
            setUser(null);
            setIsLoggedIn(false);
        }
    };
    const logout = async () => {
        await logOutUser();
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