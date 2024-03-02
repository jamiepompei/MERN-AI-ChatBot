import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatNameToInitials } from '../shared/InitialFormatter';

function extractCodeFromString(message: string) {
    if (message.includes("```")){
        const blocks = message.split("```");
        return blocks;
    }
}

function isCodeBlock(str: string) {
    if (
        str.includes("=") || 
        str.includes(";") || 
        str.includes("[") ||
        str.includes("]") ||
        str.includes("{") ||
        str.includes("}") ||
        str.includes("#") ||
        str.includes("//") 
        ) return true;

    return false;
}

const ChatItem = ({
        content, 
        role
    }: {
        content: string, 
        role: "user" | "assistant";
    }) => {
        const messageBlocks =  extractCodeFromString(content); 
        const auth = useAuth();
        return role === "assistant" ? (
        <Box sx={{ display: "flex", p: 2, bgcolor: "transparent", my: 1, gap: 2 }}>
            <Avatar sx={{ ml: "0" }}>
            <img src="openai.png" alt="openai" width={"30px"} />
            </Avatar>
            <Box>
                {!messageBlocks && (<Typography sx={{ fontSize: "20px" }}>{ content }</Typography>)} 
                {messageBlocks && messageBlocks.length && messageBlocks.map((block) => isCodeBlock(block) ? 
                    <SyntaxHighlighter style={coldarkCold} language="javascript">
                        {block}
                    </SyntaxHighlighter> 
                    : 
                    <Typography sx={{ fontSize: "20px" }}>{ block }</Typography> )}
            </Box>
        </Box>
        ) : ( 
            <Box sx={{ display: "flex", p: 2, bgcolor: "#2C3A47", gap: 2 }}>
            <Avatar sx={{ ml: "0", bgcolor: "#D6A2E8", color: "white" }}>
            {formatNameToInitials(auth?.user?.name)}
            </Avatar>
            <Box>
                {!messageBlocks && (<Typography sx={{ fontSize: "20px" }}>{ content }</Typography>)}
                {messageBlocks && messageBlocks.length && messageBlocks.map((block) => isCodeBlock(block) ? 
                    <SyntaxHighlighter style={coldarkCold} language="javascript">
                        {block}
                    </SyntaxHighlighter> 
                    : 
                    <Typography sx={{ fontSize: "20px" }}>{ block }</Typography> )}
            </Box>
        </Box>
        );
};

export default ChatItem;