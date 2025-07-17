import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cart", href: "/cart" },
];

const Navbar = () => {
  const [user, setUser] = useState(null);
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
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "0 0 24px 24px",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        height: 140,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ width: "100%", maxWidth: 1400, mx: "auto", minHeight: "0 !important", px: 0 }}>
        {/* Logo */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: 'Vermin Verile, Bangers, cursive', color: "#2d6cdf", fontWeight: 700, letterSpacing: 2, fontSize: { xs: "2rem", md: "2.7rem" } }}
          >
            Reboot
          </Typography>
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
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
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
                background: "#2d6cdf",
                color: "#fff",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "1.1rem",
                px: 4,
                py: 1.2,
                boxShadow: "0 2px 8px 0 rgba(45,108,223,0.10)",
                textTransform: "none",
                '&:hover': { background: '#174ea6' },
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
