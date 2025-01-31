import type React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import { deepOrange, deepPurple } from "@mui/material/colors"

interface Message {
  id: number
  text: string
  sender: string
  attachments?: string[]
}

interface ChatWindowProps {
  messages: Message[]
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: "flex",
            justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {message.sender === "ai" && <Avatar sx={{ bgcolor: deepPurple[500], mr: 1 }}>AI</Avatar>}
            <Box
              sx={{
                backgroundColor: message.sender === "user" ? deepOrange[100] : deepPurple[100],
                borderRadius: "20px",
                padding: "10px 15px",
                maxWidth: "70%",
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {message.attachments.map((attachment, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      Attachment: {attachment}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
            {message.sender === "user" && <Avatar sx={{ bgcolor: deepOrange[500], ml: 1 }}>U</Avatar>}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

