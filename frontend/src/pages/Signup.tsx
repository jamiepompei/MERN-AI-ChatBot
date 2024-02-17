import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { IoIosLogIn } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const trimmedName = name.trim();
        const twoWordsRegex = /^\S+\s+\S+$/;
        
    if (!twoWordsRegex.test(trimmedName)) {
      toast.error('Please enter a first and last name.');
      return;
    }
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        try {
            toast.loading("Singing up...", { id: "signup" });
            await auth?.signup(name, email, password);
            toast.success("Signed up successfully!", { id: "signup" });
            navigate("/login");
        } catch (error: unknown) {
            if (error instanceof Error) {
            console.log(error);
            toast.error("Sign up failed. " + error.message?.toString(), { id: "signup" });
            }
        }
    }
   
    return <Box width={'100%'} height={'100%'} display="flex" flex={1}>
        <Box padding={8} mt={8} display={{ md: "flex", sm: "none", xs: "none" }}>
            <img src="airobot.png" alt="Robot" style={{width: "400px"}} />
        </Box>
        <Box display={'flex'} flex={{xs: 1, md: 0.5}} justifyContent={'center'} alignItems={'center'} padding={2} ml={"auto"} mt={16} ></Box>
            <form 
                onSubmit= {(handleSubmit)}
                style={{margin: 'auto', padding:'30px', boxShadow: "10px 10px 20px #000", borderRadius: "10px", border: "none",}}>
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center",}}>
                        <Typography variant="h4" textAlign="center" padding={2} fontWeight={600}>Sign Up
                        </Typography>
                        <CustomizedInput type="text" name="name" label="Name"></CustomizedInput>
                        <CustomizedInput type="email" name="email" label="email"></CustomizedInput>
                        <CustomizedInput type="password" name="password" label="password"></CustomizedInput>
                        <Button type="submit" sx={{px: 2, py: 1, mt: 2, width: "400px", borderRadius: 2, bgcolor: "#D6A2E8",
                        color: "#2C3A47",
                        ":hover":{
                            bgcolor: "white",
                            color: "black",
                        }
                        }}
                        endIcon={<IoIosLogIn />}
                        >Signup</Button>
                    </Box>
            </form>
    </Box>
};

export default Signup;