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
import { useNavigate } from '@tanstack/react-router'

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
  const navigate = useNavigate()

  const handleCollapseToggle = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }

  const drawer = (
    <>
      <Toolbar sx={{ display: "flex", justifyContent: "center", padding: 0 }}>
        <IconButton
          onClick={isMobile ? handleDrawerToggle : handleCollapseToggle}
          sx={{ 
            width: "100%", 
            height: "100%", 
            borderRadius: 0,
            color: 'white'
          }}
        >
          {isMobile ? <ChevronLeftIcon /> : isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ 
        overflow: 'hidden',
        padding: isCollapsed && !isMobile ? 0 : 'inherit'
      }}>
        {["Home", "Sync", "Users", "Settings"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed && !isMobile ? "center" : "initial",
                px: isCollapsed && !isMobile ? 0 : 2.5,
              }}
              onClick={text === "Home" ? () => navigate({ to: '/' }) : undefined}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed && !isMobile ? 0 : 3,
                  px: 2,
                  justifyContent: "center",
                  color: 'white'
                }}
              >
                {index === 0 && <HomeIcon />}
                {index === 1 && <SyncIcon />}
                {index === 2 && <GroupIcon />}
                {index === 3 && <SettingsIcon />}
              </ListItemIcon>
              <ListItemText 
                primary={text} 
                sx={{ 
                  opacity: isCollapsed && !isMobile ? 0 : 1,
                  color: 'white'
                }} 
              />
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
            sx={{ 
              mr: 2, 
              display: { sm: "none" },
              color: 'white'
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{fontFamily: 'Montserrat, Sans Serif'}}>
            Design Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: isCollapsed && !isMobile ? collapsedDrawerWidth : drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { 
                boxSizing: "border-box", 
                width: drawerWidth,
                backgroundColor: 'black'
              },
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
                backgroundColor: 'black',
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </Box>
  )
}

export default SideBar

