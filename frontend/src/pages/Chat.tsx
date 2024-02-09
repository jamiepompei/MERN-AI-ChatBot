import React from 'react';
import  { Box, Avatar, Typography, Button } from "@mui/material"
import { red } from "@mui/material/colors"
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const auth = useAuth();
    return (
            <Box sx={{ display: "flex", flex: 1, width: "100%", height: "100%", mt: 3, gap: 3, }}
            >
            <Box sx={{ display: { md: "flex", xs: "none,", sm: "none" }, flex: 0.2, flexDirection: "column," }}></Box>
            <Box sx={{ display: "flex", width: "100%", height:"60vh", bgcolor: "rgb(17,29,39)", borderRadius: 5,
        flexDirection: "column",
        mx: 3 }}
        >
            <Avatar sx={{ mx: "auto", my: 2, bgcolor: "white", color: "black", fontWeight: 700, }}>
                {auth?.user?.name[0]}
                {auth?.user?.name.split(" ")[1][0]}
            </Avatar>
            <Typography sx={{ mx: 'auto', fontFamily: "work-sans",  }}>You are talking to a ChatBOT</Typography>
            <Typography sx={{ mx: 'auto', fontFamily: "work-sans", my: 2, p: 3,  }}>You can ask questions related to general knowledge, business, education, etc but avoid sharing personal information.
            </Typography>
            <Button sx={{ width: "200px", my: "auto", color: "white", fontWeight: 700, borderRadius: 3, mx: "auto", bgcolor: red[300], ":hover": {
                bgcolor: red.A400,
            }  }}>Clear Conversation
            </Button>
        </Box>
        <Box sx={{ display: "flex", flex: { md: 0.8, xs: 1, sm: 1 } }}>
            <Typography sx={{ textAlign: "center", fontSize: "40px", color: "white", mb: 2 }}>
                Model - GPT 3.5 Turbo
            </Typography>
        </Box>
        </Box>
    );
};

export default Chat;