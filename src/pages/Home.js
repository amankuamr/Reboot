import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Skeleton from "@mui/material/Skeleton";

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
  const [preference, setPreference] = useState('Men');
  const [loading, setLoading] = useState(true);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const heroRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setNavbarHidden(heroBottom < 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    fetchProducts();
    return () => unsub();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Please log in to add products to your cart.");
      window.location.href = "/login";
      return;
    }
    setModalProduct(product);
    setSelectedColor("");
    setSelectedSize("");
    setModalOpen(true);
  };

  const handleModalAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select both color and size.");
      return;
    }
    const product = modalProduct;
    const cartItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    };
    let cart = (await getDoc(doc(db, "users", user.uid))).data()?.cart || [];
    const idx = cart.findIndex(
      (item) => item.productId === cartItem.productId && item.size === cartItem.size && item.color === cartItem.color
    );
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    await setDoc(doc(db, "users", user.uid), { cart }, { merge: true });
    setModalOpen(false);
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
      <Navbar hidden={navbarHidden} />
      {/* Hero Section with Glassmorphism Carousel */}
      <Box
        ref={heroRef}
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
        <Box sx={{ position: "relative", height: { xs: 220, sm: 340, md: 400 }, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {/* 4 static images with hover zoom and overlay text */}
          {[
            { src: "/images/1 (2).jpg", label: "Running" },
            { src: "/images/1 (7).jpg", label: "Sports" },
            { src: "/images/nike.jpg", label: "Casual" },
            { src: "/images/reebok.jpg", label: "Outdoor" }
          ].map((item, idx) => (
            <Box
              key={item.label}
              sx={{
                width: "25%",
                height: { xs: 220, sm: 340, md: 400 },
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "z-index 0.2s",
                '&:hover .hero-img': {
                  transform: 'scale(1.08)',
                  filter: 'brightness(0.6) blur(2px)'
                },
                '&:hover .hero-label': {
                  opacity: 1
                }
              }}
            >
              <Box
                component="img"
                className="hero-img"
                src={item.src}
                alt={item.label}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s cubic-bezier(.4,0,.2,1), filter 0.5s cubic-bezier(.4,0,.2,1)",
                  zIndex: 1,
                }}
              />
              <Box
                className="hero-label"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: { xs: "1.4rem", md: "2rem" },
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  letterSpacing: 2,
                  zIndex: 2,
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  pointerEvents: 'none',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.0)'
                }}
              >
                {item.label}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Product Grid Section */}
      <Box sx={{ maxWidth: 1200, margin: "3rem auto", px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" className="funky-heading" sx={{ mb: 3, color: "#222", fontWeight: 600, textAlign: 'left', width: '100%', fontFamily: 'inherit', fontSize: '2rem', letterSpacing: 0 }}>
          Featured Products
        </Typography>
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx} style={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: 224 }}>
                    <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                  </Box>
                </Grid>
              ))
            : products.slice(0, 8).map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} style={{ display: "flex", justifyContent: "center" }}>
                  <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                </Grid>
              ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              background: '#111',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              px: 5,
              py: 1.5,
              borderRadius: 999,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
              textTransform: 'none',
              transition: 'background 0.35s cubic-bezier(0.23, 1, 0.32, 1), color 0.25s',
              '&:hover': {
                background: '#e53935',
                color: '#fff',
              },
            }}
            onClick={() => window.location.href = '/featured'}
          >
            View More
          </Button>
        </Box>
        {/* Preferences Section */}
        <Box sx={{ mt: 8, textAlign: 'left', width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#222', fontWeight: 600, textAlign: 'left', fontFamily: 'inherit', fontSize: '2rem', letterSpacing: 0 }}>
            Your Preferences
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'flex-start' }}>
            {['Men', 'Women', 'Kids'].map(option => (
              <Button
                key={option}
                variant={preference === option ? 'contained' : 'outlined'}
                onClick={() => setPreference(option)}
                sx={{
                  background: preference === option ? '#e53935' : '#fff',
                  color: preference === option ? '#fff' : '#222',
                  borderColor: '#e53935',
                  fontWeight: 600,
                  borderRadius: 999,
                  px: 4,
                  py: 1.2,
                  textTransform: 'none',
                  boxShadow: preference === option ? '0 2px 8px 0 rgba(229,57,53,0.10)' : 'none',
                  transition: 'background 0.3s, color 0.3s',
                  '&:hover': {
                    background: '#e53935',
                    color: '#fff',
                  },
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
          <Grid container spacing={4} alignItems="stretch" justifyContent="center">
            {(() => {
              if (loading) {
                return Array.from({ length: 8 }).map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx} style={{ display: "flex", justifyContent: "center" }}>
                    <Box sx={{ width: 224 }}>
                      <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                    </Box>
                  </Grid>
                ));
              }
              const filtered = products.filter(product =>
                preference === 'Men' ? product.gender === 'Men' :
                preference === 'Women' ? product.gender === 'Women' :
                preference === 'Kids' ? product.gender === 'Kids' : false
              );
              console.log('Filtered products for preference', preference, filtered);
              if (filtered.length === 0) {
                return <Typography sx={{ color: '#888', ml: 2 }}>No products found for {preference}.</Typography>;
              }
              return filtered.map(product => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                </Grid>
              ));
            })()}
          </Grid>
        </Box>
      </Box>
    {/* Color/Size Selection Modal */}
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 3,
        minWidth: 320,
        maxWidth: '90vw',
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Select Color and Size</Typography>
        {modalProduct && (
          <>
            <Typography sx={{ mb: 1 }}>{modalProduct.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {Array.isArray(modalProduct.color) && modalProduct.color.length > 0 && modalProduct.color.map((color, idx) => (
                <span
                  key={color + idx}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    display: 'inline-block',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: color,
                    border: selectedColor === color ? '3px solid #e53935' : '2px solid #eee',
                    marginRight: 6,
                    cursor: 'pointer',
                    boxShadow: selectedColor === color ? '0 2px 8px 0 rgba(229,57,53,0.10)' : 'none',
                  }}
                  title={color}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {Array.isArray(modalProduct.sizes) && modalProduct.sizes.length > 0 && modalProduct.sizes.map((size, idx) => (
                <Button
                  key={size + idx}
                  variant={selectedSize === size ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    minWidth: 44,
                    borderRadius: 2,
                    fontWeight: 700,
                    background: selectedSize === size ? "#e53935" : "#fff",
                    color: selectedSize === size ? "#fff" : "#222",
                    borderColor: "#e53935",
                    boxShadow: selectedSize === size ? "0 2px 8px 0 rgba(229,57,53,0.10)" : "none",
                    textTransform: "none",
                    fontSize: "1rem",
                    '&:hover': {
                      background: '#e53935',
                      color: '#fff',
                    },
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>
            <Button
              variant="contained"
              sx={{ background: '#e53935', color: '#fff', borderRadius: 999, fontWeight: 700, px: 4, py: 1.2, textTransform: 'none', fontSize: '1.1rem', '&:hover': { background: '#b71c1c' } }}
              onClick={handleModalAddToCart}
            >
              Add to Cart
            </Button>
          </>
        )}
      </Box>
    </Modal>
    <Footer />
    </div>
  );
};

export default Home;
