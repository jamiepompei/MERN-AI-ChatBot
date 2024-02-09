import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import NavigationLink from "./shared/NavigationLink";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const auth = useAuth();
    return (
        <AppBar 
            sx={{ bgcolor: "transparent", position:"static",
            boxShadow:"none",
     }}>
        <Toolbar sx={{ display: "flex" }}>
            <Logo />
            <div>
                {auth?.isLoggedIn ? (
                <>
                <NavigationLink 
                    bg="#D6A2E8" 
                    to="/chat" 
                    text="Go To Chat" 
                    textColor="black" 
                />
                <NavigationLink 
                    bg="#51538f" 
                    to="/" 
                    text="Logout" 
                    textColor="white" 
                    onClick={auth.logout}
                />
                </>
            ):(
                <>
                <NavigationLink 
                    bg="#D6A2E8" 
                    to="/login" 
                    text="Login" 
                    textColor="black" 
                />
                <NavigationLink 
                    bg="#51538f" 
                    to="/signup" 
                    text="Signup" 
                    textColor="white" 
                />
                </>
            )}
            </div>
        </Toolbar>
    </AppBar>
    );
};

export default Header;