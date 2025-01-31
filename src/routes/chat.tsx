import { useState } from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import SyncIcon from "@mui/icons-material/Sync"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { createFileRoute } from "@tanstack/react-router"
import { theme } from "@/themes/theme"
import SideBar from "@/components/SideBar"
import PromptSuggestions from "@/components/PromptSuggestions"
import ChatInput from "@/components/ChatInput"
import Toolbar from "@mui/material/Toolbar"

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

const prompts = [
  "Clean account fields",
  "Clean contact fields",
  "Create master 'People' list",
  "Account Fit Score",
  "Match leads to account",
  "See prompt library",
]

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSend = () => {
    console.log("Sending message:", input)
    setInput("")
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Main
          sx={{
            marginLeft: {
              sm: `${isCollapsed ? collapsedDrawerWidth : drawerWidth}px`,
            },
            width: {
              sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
            },
          }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
            }}
          >
            <Toolbar />
            <Box
              sx={{
                maxWidth: "md",
                mx: "auto",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: { xs: 4, sm: 6 },
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
                Talk Data to Me
              </Typography>
              <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: "sm" }}>
                Choose a prompt below or write your own to start chatting with Seam
              </Typography>

              <PromptSuggestions prompts={prompts} onSelectPrompt={setInput} />
              <ChatInput input={input} onInputChange={setInput} onSend={handleSend} />
            </Box>
          </Box>
        </Main>
      </Box>
    </ThemeProvider>
  )
}

