import React, { useEffect, useState } from "react";
import { useSearchFilter } from "../context/SearchFilterContext";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const Featured = () => {
  const { searchQuery } = useSearchFilter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0e7ff 0%, #f7f8fa 100%)" }}>
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, px: 2 }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#222", fontWeight: 700, textAlign: "center" }}>
          All Featured Products
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Mobile: vertical scroll, 4 cards visible at a time */}
            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                flexDirection: 'column',
                overflowY: 'auto',
                maxHeight: 4 * 224 + 3 * 24, // 4 cards + 3 gaps (assuming 24px gap)
                gap: 3,
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                pb: 1,
              }}
            >
              {products.filter(product => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  (product.name && product.name.toLowerCase().includes(q)) ||
                  (product.category && product.category.toLowerCase().includes(q)) ||
                  (product.brand && product.brand.toLowerCase().includes(q))
                );
              }).map(product => (
                <Box key={product.id} sx={{ width: 224, display: 'flex', justifyContent: 'center' }}>
                  <ProductCard product={product} onAddToCart={() => {}} />
                </Box>
              ))}
            </Box>
            {/* Desktop/Tablet: grid */}
            <Grid container spacing={4} alignItems="stretch" justifyContent="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {products.filter(product => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  (product.name && product.name.toLowerCase().includes(q)) ||
                  (product.category && product.category.toLowerCase().includes(q)) ||
                  (product.brand && product.brand.toLowerCase().includes(q))
                );
              }).slice(0, 8).map(product => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={product.id} style={{ display: "flex", justifyContent: "center" }}>
                  <ProductCard product={product} onAddToCart={() => {}} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </div>
  );
};

export default Featured;
