import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "../App.css";

const navButtonStyle = {
  color: "#222",
  fontWeight: 600,
  fontSize: "1.1rem",
  textTransform: "none",
  letterSpacing: 1,
  background: "rgba(255,255,255,0.2)",
  borderRadius: 8,
  px: 2,
  mx: 0.5,
  transition: "background 0.2s, color 0.2s",
  '&:hover': {
    background: "#2d6cdf",
    color: "#fff"
  }
};

const Navbar = () => {
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
          <a href="/login">Login</a>
          <a href="/cart">Cart</a>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
