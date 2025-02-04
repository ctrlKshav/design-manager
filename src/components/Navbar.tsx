import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "@tanstack/react-router"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Box from "@mui/material/Box"
import MenuIcon from "@mui/icons-material/Menu"
import ScienceIcon from "@mui/icons-material/Science"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

const products = [
  { name: "Product 1", description: "Description 1", link: "/product1" },
  { name: "Product 2", description: "Description 2", link: "/product2" },
  // Add more products as needed
]

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsMenuAnchor, setProductsMenuAnchor] = useState<null | HTMLElement>(null)
  const [isAtTop, setIsAtTop] = useState(true)
  const prevScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsAtTop(currentScrollY === 0)
      prevScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProductsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProductsMenuAnchor(event.currentTarget)
  }

  const handleProductsMenuClose = () => {
    setProductsMenuAnchor(null)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Design Manager
      </Typography>
      <List>
        <ListItem component={Link} to="/products">
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem component={Link} to="/blog">
          <ListItemText primary="Blog" />
        </ListItem>
        <ListItem component={Link} to="/community">
          <ListItemText primary="Community" />
        </ListItem>
        <ListItem component={Link} to="/contact">
          <ListItemText primary="Get in Touch" />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <AppBar position="fixed" color={isAtTop ? "transparent" : "default"} elevation={isAtTop ? 0 : 4}>
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
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/chat"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Design Manager
        </Typography>
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  )
}

export default Navbar

