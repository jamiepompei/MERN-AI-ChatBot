import React from 'react';
import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import  { Box, Avatar, Typography, Button, IconButton} from "@mui/material"
import { IoMdSend } from "react-icons/io"
import { red } from "@mui/material/colors"
import { useAuth } from '../context/AuthContext';
import  ChatItem  from "../components/chat/ChatItem";
import { sendChatRequest, getUserChats, deleteUserChats } from '../helpers/api-communicator';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatNameToInitials } from '../components/shared/InitialFormatter';

type Message = {
    role: "user" | "assistant",
    content: string
}

const Chat = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const auth = useAuth();
    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    const handleSubmit = async () => {
        const content = inputRef.current?.value as string;
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        const newMessage: Message = { role: "user", content };
        setChatMessages((prev)=> [...prev, newMessage]);
        const chatData = await sendChatRequest(content);
        setChatMessages(chatData?.chats ? [...chatData.chats] : []);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    }

    const handleDeleteChats = async () => {
      try {
        toast.loading("Deleting chats...", { id: "deleteChats" });
        await deleteUserChats();
        setChatMessages([]);
        toast.success("Successfully deleted chats!", { id: "deleteChats" });
      } catch (error){
        console.log(error);
        toast.error("Failed to delete chats.", { id: "deletedChats" });
      }
    };

    useLayoutEffect(() => {
      if (auth?.isLoggedIn && auth.user) {
        toast.loading("Loading Chats", { id: "loadchats" });
        getUserChats().then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        }).catch(error => {
          console.log(error);
          toast.error("Loading Failed", { id: "loadchats" });
      }); 
        }
      }, [auth]);

      useEffect(() => {
        if (!auth?.user) {
          return navigate("/login");
        }
      });
    return (
        <Box
        sx={{
          display: "flex",
          flex: 1,
          width: "100%",
          height: "100%",
          mt: 3,
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: { md: "flex", xs: "none", sm: "none" },
            flex: 0.2,
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "60vh",
              bgcolor: "rgb(17,29,39)",
              borderRadius: 5,
              flexDirection: "column",
              mx: 3,
            }}
          >
            <Avatar
              sx={{
                mx: "auto",
                my: 2,
                bgcolor: "#D6A2E8",
                color: "white",
                fontWeight: 700,
              }}
            >
              {formatNameToInitials(auth?.user?.name)}
            </Avatar>
            <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
              You are talking to a ChatBOT.
            </Typography>
            <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
              You can ask some questions related to general knowledge, business, 
              education, etc, but avoid sharing personal information.
            </Typography>
            <Button

              sx={{
                width: "200px",
                my: "auto",
                color: "white",
                fontWeight: "700",
                borderRadius: 3,
                mx: "auto",
                bgcolor: red[300],
                ":hover": {
                  bgcolor: red.A400,
                },
                mb: 5,
              }} 
              onClick={handleDeleteChats}
              disabled={chatMessages.length === 0}
            >
              Clear Conversation
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: { md: 0.8, xs: 1, sm: 1 },
            flexDirection: "column",
            px: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "40px",
              color: "white",
              mb: 2,
              mx: "auto",
              fontWeight: "600",
            }}
          >
            Model - GPT 3.5 Turbo
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: "60vh",
              borderRadius: 3,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              overflow: "scroll",
              overflowX: "hidden",
              overflowY: "auto",
              scrollBehavior: "smooth",
            }}
          >
            {chatMessages.map((chat, index) => (
                <ChatItem content={ chat.content } role={ chat.role } key={index} />
            ))} 
          </Box>
          <div
            style={{
              width: "100%",
              borderRadius: 8,
              backgroundColor: "rgb(17,27,39)",
              display: "flex",
              margin: "auto",
            }}
          >
            {" "}
            <input
              ref= {inputRef}
              type="text"
              style={{
                width: "100%",
                backgroundColor: "transparent",
                padding: "30px",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "20px",
              }}
              onKeyDown={handleKeyDown}
            />
            <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1, padding: 3 }}>
              <IoMdSend />
            </IconButton>
          </div>
        </Box>
      </Box>
    );
};

export default Chat;