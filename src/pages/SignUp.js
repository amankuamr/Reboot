import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e0e7ff 0%, #f7f8fa 100%)" }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: 6, minWidth: 340, maxWidth: 400, width: "100%", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)", border: "1px solid rgba(255,255,255,0.18)" }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: "#222", textAlign: "center" }}>Sign Up</Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2, borderRadius: 999, fontWeight: 700, background: "#2d6cdf" }}>Sign Up</Button>
        </form>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          onClick={handleGoogleSignUp}
          sx={{ borderRadius: 999, fontWeight: 700, color: "#e53935", borderColor: "#e53935", mb: 2, '&:hover': { background: '#e5393520', borderColor: '#e53935' } }}
        >
          Sign up with Google
        </Button>
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Already have an account? <Link to="/login" style={{ color: "#2d6cdf", fontWeight: 600 }}>Sign In</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;
