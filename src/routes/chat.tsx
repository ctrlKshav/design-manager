"use client"

import { useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { ChatWindow } from "@/components/ChatWindow"
import { MessageInput } from "@/components/MessageInput"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/chat")({
  component: ChatPortal
})

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
})

export const Rotue = createFileRoute("/chat")({
    component: ChatPortal
})

export default function ChatPortal() {
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string; attachments?: string[] }>>(
    [],
  )

  const handleSendMessage = (text: string, attachments: string[] = []) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: "user",
      attachments,
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now(),
        text: `AI feedback based on ${text}`,
        sender: "ai",
      }
      setMessages((prevMessages) => [...prevMessages, aiResponse])
    }, 1000)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            DesignManager Chat Portal
          </Typography>
          <Paper elevation={3} sx={{ p: 2, height: "80vh", display: "flex", flexDirection: "column" }}>
            <ChatWindow messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

