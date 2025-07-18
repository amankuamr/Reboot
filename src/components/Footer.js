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
    background: "rgba(255,255,255,0.85)",
    borderTop: "1px solid #e0e0e0",
    mt: 8,
    pt: 6,
    pb: 3,
    px: { xs: 2, md: 8 },
    color: "#222",
    boxShadow: "0 -2px 16px 0 rgba(31,38,135,0.06)",
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(8px)',
  }}>
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 4, maxWidth: 1400, mx: "auto" }}>
      {/* Logo and Description */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/logomain.png" alt="Reboot Logo" style={{ height: 64, width: 64, borderRadius: 18, background: '#fff', boxShadow: '0 2px 8px 0 rgba(45,108,223,0.10)' }} />
        <Box>
          <Typography sx={{ color: "#444", maxWidth: 320, mt: 1 }}>
            The best place to find your next pair of shoes. Shop the latest styles and enjoy fast, secure checkout.
          </Typography>
        </Box>
      </Box>
      {/* Useful Links */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#e53935' }}>Links</Typography>
        <Link href="/" underline="none" sx={{ color: "#222", mb: 0.5, fontWeight: 500, '&:hover': { color: '#2d6cdf' } }}>Home</Link>
        <Link href="/shop" underline="none" sx={{ color: "#222", mb: 0.5, fontWeight: 500, '&:hover': { color: '#2d6cdf' } }}>Shop</Link>
        <Link href="/cart" underline="none" sx={{ color: "#222", mb: 0.5, fontWeight: 500, '&:hover': { color: '#2d6cdf' } }}>Cart</Link>
        <Link href="/about" underline="none" sx={{ color: "#222", mb: 0.5, fontWeight: 500, '&:hover': { color: '#2d6cdf' } }}>About</Link>
        <Link href="/contact" underline="none" sx={{ color: "#222", mb: 0.5, fontWeight: 500, '&:hover': { color: '#2d6cdf' } }}>Contact</Link>
      </Box>
      {/* Social & Admin */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: { xs: "flex-start", md: "flex-end" } }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#2d6cdf' }}>Follow Us</Typography>
          <IconButton href="#" sx={{ color: "#2d6cdf", background: '#e3eafc', mr: 1, '&:hover': { background: '#2d6cdf', color: '#fff' } }}><FacebookIcon /></IconButton>
          <IconButton href="#" sx={{ color: "#e53935", background: '#fdeaea', mr: 1, '&:hover': { background: '#e53935', color: '#fff' } }}><InstagramIcon /></IconButton>
          <IconButton href="#" sx={{ color: "#1da1f2", background: '#e3f6fd', mr: 1, '&:hover': { background: '#1da1f2', color: '#fff' } }}><TwitterIcon /></IconButton>
          <IconButton href="#" sx={{ color: "#0077b5", background: '#e3f1fd', '&:hover': { background: '#0077b5', color: '#fff' } }}><LinkedInIcon /></IconButton>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#e53935' }}>Admin</Typography>
          <Button href="/admin" variant="contained" sx={{ background: "#e53935", color: "#fff", borderRadius: 999, fontWeight: 700, px: 4, py: 1, textTransform: "none", boxShadow: '0 2px 8px 0 rgba(229,57,53,0.10)', '&:hover': { background: '#b71c1c' } }}>
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
