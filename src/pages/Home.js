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
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} style={{ display: "flex" }}>
              <Paper
                className="animated-card"
                elevation={4}
                sx={{
                  borderRadius: 4,
                  background: "#fff",
                  boxShadow: "0 4px 24px rgba(31,38,135,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  height: 440,
                  minWidth: 260,
                  maxWidth: 320,
                  width: "100%",
                  overflow: "hidden",
                  p: 0,
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 170,
                    background: '#f7f8fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1, px: 2, pt: 2, pb: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <Typography variant="h6" className="funky-product-name" sx={{ fontWeight: 700, color: "#222", mb: 0.5 }}>{product.name}</Typography>
                  <Typography variant="body2" sx={{ color: "#444", mb: 0.5 }}>{product.category}</Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                    Sizes: {product.sizes && product.sizes.join(", ")}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#111", mb: 1 }}>₹{product.price}</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, width: "100%", alignItems: "center", pb: 2, mt: "auto" }}>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{
                      background: "#e53935",
                      color: "#fff",
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      boxShadow: "0 2px 8px 0 rgba(229,57,53,0.10)",
                      textTransform: "none",
                      width: "100%",
                      maxWidth: 160,
                      minHeight: 36,
                      py: 0.5,
                      mx: "auto",
                      '&:hover': { background: '#b71c1c' }
                    }}
                    href={"/product/" + product.id}
                  >
                    Buy
                  </Button>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{
                      background: "#222",
                      color: "#fff",
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      boxShadow: "0 2px 8px 0 rgba(34,34,34,0.10)",
                      textTransform: "none",
                      width: "100%",
                      maxWidth: 160,
                      minHeight: 36,
                      py: 0.5,
                      mx: "auto",
                      '&:hover': { background: '#000' }
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    <Footer />
    </div>
  );
};

export default Home;
