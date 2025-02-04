import { useState, useRef, useEffect } from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import SyncIcon from "@mui/icons-material/Sync"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { createFileRoute } from "@tanstack/react-router"
import { theme } from "@/themes/theme"
import SideBar from "@/components/SideBar"
import Toolbar from "@mui/material/Toolbar"
import { ChatWindow } from "@/components/ChatWindow"
import { MessageInput } from "@/components/MessageInput"
import { red, yellow } from "@mui/material/colors"

export const Route = createFileRoute("/chat")({
  component: ChatInterface,
})

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}))

const availableUsers = ["John", "Alice", "Bob", "Emma", "David"]

export default function ChatInterface() {
  const [messages, setMessages] = useState<any[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSendMessage = (text: string, attachments: string[], taggedUsers: string[]) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
      attachments,
      taggedUsers,
    }
    setMessages([...messages, newMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: `AI response to: ${text}`,
        sender: "ai",
      }
      setMessages((prevMessages) => [...prevMessages, aiResponse])
    }, 1000)
  }

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [chatWindowRef])

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", bgcolor: red, height: '100vh' }}>
        <SideBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Main sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* <Toolbar sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                Design Manager Chat
              </Typography>
              <Typography color="text.secondary">
                Upload images, tag users, and get AI-powered feedback
              </Typography>
            </Box>
            <SyncIcon sx={{ fontSize: 40, color: "primary.main" }} />
          </Toolbar> */}

          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            p: 3,
            gap: 2
          }}>
            <Box
              ref={chatWindowRef}
              sx={{
                flex: 1,
                overflowY: 'auto',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                p: 2
              }}
            >
              <ChatWindow messages={messages} />
            </Box>
            
            <Box sx={{ 
              width: '100%',
              maxWidth: 1200,
              mx: 'auto',
              pb: 2
            }}>
              <MessageInput onSendMessage={handleSendMessage} availableUsers={availableUsers} />
            </Box>
          </Box>
        </Main>
      </Box>
    </>
  )
}