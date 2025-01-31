import type React from "react"
import { useState } from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import HomeIcon from "@mui/icons-material/Home"
import SyncIcon from "@mui/icons-material/Sync"
import GroupIcon from "@mui/icons-material/Group"
import SettingsIcon from "@mui/icons-material/Settings"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

const drawerWidth = 240
const collapsedDrawerWidth = 64

interface SideBarProps {
  mobileOpen: boolean
  handleDrawerToggle: () => void
}

const SideBar: React.FC<SideBarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleCollapseToggle = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }

  const drawer = (
    <>
      <Toolbar>
        <IconButton onClick={isMobile ? handleDrawerToggle : handleCollapseToggle}>
          {isMobile ? <ChevronLeftIcon /> : isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {["Home", "Sync", "Users", "Settings"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed && !isMobile ? "center" : "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed && !isMobile ? "auto" : 3,
                  justifyContent: "center",
                }}
              >
                {index === 0 && <HomeIcon />}
                {index === 1 && <SyncIcon />}
                {index === 2 && <GroupIcon />}
                {index === 3 && <SettingsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: isCollapsed && !isMobile ? 0 : 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isCollapsed && !isMobile ? collapsedDrawerWidth : drawerWidth}px)` },
          ml: { sm: `${isCollapsed && !isMobile ? collapsedDrawerWidth : drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Design Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: isCollapsed && !isMobile ? collapsedDrawerWidth : drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </Box>
  )
}

export default SideBar

