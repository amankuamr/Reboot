import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const images = [
  "/images/maksim-larin-NOpsC3nWTzY-unsplash.jpg",
  "/images/nike.jpg",
  "/images/reebok.jpg"
];

const getLocalCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};
const setLocalCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    fetchProducts();
    return () => unsub();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please log in to add products to your cart.");
      window.location.href = "/login";
      return;
    }
    // Default: first available size, quantity 1
    const cartItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      size: product.sizes[0],
      quantity: 1,
    };
    let cart = (await getDoc(doc(db, "users", user.uid))).data()?.cart || [];
    // If already in cart (same productId and size), increase quantity
    const idx = cart.findIndex(
      (item) => item.productId === cartItem.productId && item.size === cartItem.size
    );
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    await setDoc(doc(db, "users", user.uid), { cart }, { merge: true });
    alert("Added to cart!");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0e7ff 0%, #f7f8fa 100%)" }}>
      <Navbar />
      {/* Hero Section with Glassmorphism Carousel */}
      <Box
        sx={{
          maxWidth: 900,
          margin: "2rem auto 0 auto",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <Box sx={{ position: "relative", height: { xs: 220, sm: 340, md: 400 }, width: "100%" }}>
          {images.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Shoe ${idx + 1}`}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                opacity: idx === current ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(.4,0,.2,1)",
                zIndex: idx === current ? 1 : 0,
              }}
            />
          ))}
          {/* Dots */}
          <Box sx={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 1 }}>
            {images.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: idx === current ? "#2d6cdf" : "rgba(255,255,255,0.7)",
                  border: "2px solid #fff",
                  transition: "background 0.3s",
                  mx: 0.5,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {/* Product Grid Section */}
      <Box sx={{ maxWidth: 1200, margin: "3rem auto", px: 2 }}>
        <Typography variant="h4" className="funky-heading" sx={{ mb: 3, color: "#222", fontWeight: 600, textAlign: "left" }}>
          Featured Products
        </Typography>
        <Grid container spacing={4} alignItems="stretch">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} style={{ display: "flex", justifyContent: "center" }}>
              <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    <Footer />
    </div>
  );
};

export default Home;
