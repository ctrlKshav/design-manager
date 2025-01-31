import type React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import { deepOrange, deepPurple } from "@mui/material/colors"

interface Message {
  id: number
  text: string
  sender: string
  attachments?: string[]
  taggedUsers?: string[]
}

interface ChatWindowProps {
  messages: Message[]
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <Box sx={{ p: 2 }}>
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
              {message.taggedUsers && message.taggedUsers.length > 0 && (
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {message.taggedUsers.map((user, index) => (
                    <Chip key={index} label={user} size="small" />
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

