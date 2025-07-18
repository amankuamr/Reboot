import React, { useEffect, useState } from "react";
import { useSearchFilter } from "../context/SearchFilterContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
];

const Navbar = ({ hidden }) => {
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchFilter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const drawerList = (
    <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.href} disablePadding>
            <ListItemButton onClick={() => navigate(link.href)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          {user ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={() => navigate('/login')}>
              <ListItemText primary="Login" />
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        top: 0,
        zIndex: 1200,
        background: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: 0,
        border: "1px solid rgba(255, 255, 255, 0.18)",
        height: { xs: 64, sm: 140 },
        display: "flex",
        justifyContent: "center",
        transition: 'transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      <Toolbar sx={{ width: "100%", maxWidth: 1400, mx: "auto", minHeight: "0 !important", px: 0 }}>
        {/* Logo */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <img
            src="/logomain.png"
            alt="Reboot Logo"
            style={{ height: '96px', width: 'auto', display: 'block' }}
          />
        </Box>
        {/* Nav Links and Auth for Desktop, Hamburger for Mobile */}
        {isMobile ? (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: '#e53935', fontSize: 32, mr: 2 }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              {drawerList}
            </Drawer>
          </Box>
        ) : (
          <>
            {/* Nav Links */}
            <Box sx={{ flex: 2, display: "flex", justifyContent: "center", gap: 5 }} className="navbar-center">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="navbar-link"
                  style={{ fontSize: "1.25rem", fontWeight: 600, color: "#222", textDecoration: "none", position: "relative", padding: "0 0.5rem", display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  {link.label}
                </a>
              ))}
            </Box>
            {/* Auth Button */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, minWidth: 180 }}>
              <Box sx={{ display: "flex", alignItems: "center", minWidth: 40, mr: 2 }}>
                <IconButton
                  onClick={() => setSearchOpen((open) => !open)}
                  sx={{
                    color: "#e53935",
                    transition: "background 0.2s",
                  }}
                >
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  sx={{
                    width: searchOpen ? 180 : 0,
                    opacity: searchOpen ? 1 : 0,
                    transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
                    ml: 1,
                    px: searchOpen ? 1 : 0,
                    background: "#f3f6fa",
                    borderRadius: 2,
                    fontSize: "1rem",
                    boxShadow: searchOpen ? "0 2px 8px 0 rgba(45,108,223,0.10)" : "none",
                    pointerEvents: searchOpen ? "auto" : "none",
                    overflow: "hidden"
                  }}
                  inputProps={{ style: { padding: 4 } }}
                />
              </Box>
              {user ? (
                <Button
                  onClick={handleLogout}
                  sx={{
                    background: "#e53935",
                    color: "#fff",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    px: 4,
                    py: 1.2,
                    boxShadow: "0 2px 8px 0 rgba(229,57,53,0.10)",
                    textTransform: "none",
                    '&:hover': { background: '#b71c1c' },
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  href="/login"
                  sx={{
                    background: "#111",
                    color: "#fff",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    px: 4,
                    py: 1.2,
                    boxShadow: "0 2px 8px 0 rgba(45,108,223,0.10)",
                    textTransform: "none",
                    '&:hover': { background: '#e53935' },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
