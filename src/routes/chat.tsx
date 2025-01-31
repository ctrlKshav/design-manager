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

const drawerWidth = 240
const collapsedDrawerWidth = 64

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: `${drawerWidth}px`,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
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
  }, [chatWindowRef]) //Corrected dependency

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" ,bgcolor:red}}>
        <SideBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Main
          sx={{
            marginLeft: {
              sm: `${isCollapsed ? collapsedDrawerWidth : drawerWidth}px`,
            },
            width: {
              sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: `center`,
            bgcolor: yellow
          }}
        >
          <Toolbar />
          <Box
            sx={{
              maxWidth: "800px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(6)})`,
              mt: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <SyncIcon sx={{ fontSize: 40, color: "primary.main" }} />
            </Box>

            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
              Design Manager Chat
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 3, maxWidth: "sm" }}>
              Upload images, tag users, and get AI-powered feedback on your designs
            </Typography>

            <Box
              ref={chatWindowRef}
              sx={{
                flexGrow: 1,
                width: "100%",
                overflowY: "auto",
                mb: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <ChatWindow messages={messages} />
            </Box>
            <Box sx={{ width: "100%", mt: 2 }}>
              <MessageInput onSendMessage={handleSendMessage} availableUsers={availableUsers} />
            </Box>
     
          </Box>
        </Main>
      </Box>
    </ThemeProvider>
  )
}

