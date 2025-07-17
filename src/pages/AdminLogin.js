import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
      if (userDoc.exists() && userDoc.data().isAdmin) {
        navigate("/admin/dashboard");
      } else {
        setError("You are not authorized as an admin.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e0e7ff 0%, #f7f8fa 100%)" }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: 6, minWidth: 340, maxWidth: 400, width: "100%", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)", border: "1px solid rgba(255,255,255,0.18)" }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: "#222", textAlign: "center" }}>Admin Login</Typography>
        <form onSubmit={handleAdminLogin}>
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
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2, borderRadius: 999, fontWeight: 700, background: "#222" }} disabled={loading}>
            {loading ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
