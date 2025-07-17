import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "../App.css";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
      position="static"
      elevation={0}
      color="transparent"
      sx={{
        background: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "0 0 24px 24px",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          sx={{ flexGrow: 1, fontWeight: 700, color: "#2d6cdf", letterSpacing: 2, fontFamily: 'Vermin Verile, sans-serif' }}
        >
          Reboot
        </Typography>
        <Box className="navbar-right">
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          {user ? (
            <Button onClick={handleLogout} sx={{ color: "#e53935", fontWeight: 700, fontSize: "1.1rem", background: "none", boxShadow: "none", textTransform: "none" }}>Logout</Button>
          ) : (
            <a href="/login">Login</a>
          )}
          <a href="/cart">Cart</a>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
