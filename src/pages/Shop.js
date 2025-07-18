import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0e7ff 0%, #f7f8fa 100%)" }}>
      <Navbar />
      <Box sx={{ maxWidth: 1400, mx: "auto", mt: 8, px: 2, pb: 8 }}>
        <Typography variant="h3" sx={{ mb: 4, color: "#e53935", fontWeight: 800, textAlign: "center", letterSpacing: 1 }}>
          Shop All Products
        </Typography>
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {loading
            ? Array.from({ length: 12 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx} style={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: 224 }}>
                    <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                  </Box>
                </Grid>
              ))
            : products.map(product => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} style={{ display: "flex", justifyContent: "center" }}>
                  <ProductCard product={product} onAddToCart={() => {}} />
                </Grid>
              ))}
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};

export default Shop;
