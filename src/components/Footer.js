import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => (
  <Box sx={{
    background: "rgba(255,255,255,0.95)",
    borderTop: "1px solid #e0e0e0",
    mt: 8,
    pt: 6,
    pb: 3,
    px: { xs: 2, md: 8 },
    color: "#222",
    boxShadow: "0 -2px 16px 0 rgba(31,38,135,0.06)",
  }}>
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 4, maxWidth: 1400, mx: "auto" }}>
      {/* Logo and Description */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Vermin Verile, Bangers, cursive', color: "#2d6cdf", fontWeight: 700, letterSpacing: 2, mb: 1 }}>
          Reboot
        </Typography>
        <Typography sx={{ color: "#444", maxWidth: 320 }}>
          The best place to find your next pair of shoes. Shop the latest styles and enjoy fast, secure checkout.
        </Typography>
      </Box>
      {/* Useful Links */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Links</Typography>
        <Link href="/" underline="none" sx={{ color: "#222", mb: 0.5, '&:hover': { color: '#2d6cdf' } }}>Home</Link>
        <Link href="/shop" underline="none" sx={{ color: "#222", mb: 0.5, '&:hover': { color: '#2d6cdf' } }}>Shop</Link>
        <Link href="/cart" underline="none" sx={{ color: "#222", mb: 0.5, '&:hover': { color: '#2d6cdf' } }}>Cart</Link>
        <Link href="/about" underline="none" sx={{ color: "#222", mb: 0.5, '&:hover': { color: '#2d6cdf' } }}>About</Link>
        <Link href="/contact" underline="none" sx={{ color: "#222", mb: 0.5, '&:hover': { color: '#2d6cdf' } }}>Contact</Link>
      </Box>
      {/* Social & Admin */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: { xs: "flex-start", md: "flex-end" } }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Follow Us</Typography>
          <IconButton href="#" sx={{ color: "#2d6cdf" }}><FacebookIcon /></IconButton>
          <IconButton href="#" sx={{ color: "#e53935" }}><InstagramIcon /></IconButton>
          <IconButton href="#" sx={{ color: "#1da1f2" }}><TwitterIcon /></IconButton>
          <IconButton href="#" sx={{ color: "#0077b5" }}><LinkedInIcon /></IconButton>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Admin</Typography>
          <Button href="/admin" variant="contained" sx={{ background: "#222", color: "#fff", borderRadius: 999, fontWeight: 700, px: 4, py: 1, textTransform: "none", '&:hover': { background: '#000' } }}>
            Admin Login
          </Button>
        </Box>
      </Box>
    </Box>
    <Typography sx={{ textAlign: "center", color: "#888", mt: 5, fontSize: "0.95rem" }}>
      &copy; {new Date().getFullYear()} Reboot. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
