import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cart", href: "/cart" },
];

const Navbar = ({ hidden }) => {
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

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
        borderRadius: "0 0 24px 24px",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        height: 140,
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
            style={{ height: 160, width: 'auto', display: 'block' }}
          />
        </Box>
        {/* Nav Links */}
        <Box sx={{ flex: 2, display: "flex", justifyContent: "center", gap: 5 }} className="navbar-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar-link"
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "#222", textDecoration: "none", position: "relative", padding: "0 0.5rem" }}
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
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
