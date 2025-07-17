import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const getLocalCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

const setLocalCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch cart from Firestore
        const userDoc = await getDoc(doc(db, "users", u.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setCart(userData.cart || []);
      } else {
        setCart(getLocalCart());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Update cart in Firestore or localStorage
  const updateCart = async (newCart) => {
    setCart(newCart);
    if (user) {
      await setDoc(doc(db, "users", user.uid), { cart: newCart }, { merge: true });
    } else {
      setLocalCart(newCart);
    }
  };

  const handleRemove = (idx) => {
    const newCart = cart.filter((_, i) => i !== idx);
    updateCart(newCart);
  };

  const handleQuantity = (idx, delta) => {
    const newCart = cart.map((item, i) =>
      i === idx ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  if (loading) return <div />;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0e7ff 0%, #f7f8fa 100%)", py: 6 }}>
      <Paper sx={{ maxWidth: 800, mx: "auto", p: 4, borderRadius: 6, background: "rgba(255,255,255,0.8)", boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)", border: "1px solid rgba(255,255,255,0.18)" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "#222", textAlign: "center" }}>Your Cart</Typography>
        {cart.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "#888" }}>Your cart is empty.</Typography>
        ) : (
          <>
            {cart.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 3, p: 2, borderRadius: 4, background: "#f7f8fa", boxShadow: "0 2px 8px 0 rgba(31,38,135,0.06)" }}>
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginRight: 16 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: "#222" }}>{item.name}</Typography>
                    {item.color && (
                      <span style={{
                        display: 'inline-block',
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: item.color.toLowerCase(),
                        border: '2px solid #eee',
                        marginLeft: 6
                      }} />
                    )}
                  </Box>
                  <Typography sx={{ color: "#444" }}>Size: {item.size}</Typography>
                  <Typography sx={{ color: "#444" }}>₹{item.price}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button onClick={() => handleQuantity(idx, -1)} sx={{ minWidth: 32, fontWeight: 700 }}>-</Button>
                  <Typography>{item.quantity}</Typography>
                  <Button onClick={() => handleQuantity(idx, 1)} sx={{ minWidth: 32, fontWeight: 700 }}>+</Button>
                </Box>
                <IconButton onClick={() => handleRemove(idx)} color="error" sx={{ ml: 2 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#222" }}>Total: ₹{total}</Typography>
              <Button variant="contained" color="primary" sx={{ borderRadius: 999, fontWeight: 700, background: "#e53935", px: 4, py: 1, fontSize: "1.1rem" }}>
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Cart;
