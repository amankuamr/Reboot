import React, { useState, useEffect } from "react";
import { useSearchFilter } from "../context/SearchFilterContext";
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
import Fade from "@mui/material/Fade";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
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
  const { searchQuery, filters, setFilters } = useSearchFilter();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  // Example filter options (should be dynamic in real app)
  const categories = ["Men", "Women", "Sneakers", "Boots", "Sandals", "Slippers", "Sports"];
  const sizes = ["6", "7", "8", "9", "10", "11", "12"];
  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow"];
  const ratings = [5, 4, 3, 2, 1];
  const sortOptions = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating_desc", label: "Rating: High to Low" },
    { value: "newest", label: "Newest" },
  ];
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
      {/* Hero Section with Glassmorphism Carousel - only show if no search query, with smooth fade animation */}
      <Fade in={!searchQuery} timeout={500} unmountOnExit>
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
          <Box sx={{
            position: "relative",
            height: { xs: 320, sm: 340, md: 400 },
            width: "100%",
            display: { xs: "grid", sm: "flex" },
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            gridTemplateColumns: { xs: "1fr 1fr", sm: undefined },
            gridTemplateRows: { xs: "1fr 1fr", sm: undefined },
          }}>
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
                  width: { xs: "100%", sm: "25%" },
                  height: { xs: 160, sm: 340, md: 400 },
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "z-index 0.2s",
                  // Only apply hover effect for sm and up
                  ...(typeof window !== 'undefined' && window.innerWidth >= 600 ? {
                    '&:hover .hero-img': {
                      transform: 'scale(1.08)',
                      filter: 'brightness(0.6) blur(2px)'
                    },
                    '&:hover .hero-label': {
                      opacity: 1
                    }
                  } : {}),
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
                    transition: { xs: 'none', sm: "transform 0.5s cubic-bezier(.4,0,.2,1), filter 0.5s cubic-bezier(.4,0,.2,1)" },
                    zIndex: 1,
                  }}
                />
                {/* Show overlay label only on desktop */}
                <Box
                  className="hero-label"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { sm: "1.4rem", md: "2rem" },
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
                {/* Show label as a tag on image for mobile */}
                <Box
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: '#e53935',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    zIndex: 3,
                    boxShadow: '0 2px 8px 0 rgba(229,57,53,0.10)',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    minWidth: 60,
                    textAlign: 'center',
                  }}
                >
                  {item.label}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>
      {/* Product Grid Section */}
      <Box sx={{ maxWidth: 1200, margin: "3rem auto", px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" className="funky-heading" sx={{ mb: 3, color: "#222", fontWeight: 600, textAlign: 'left', width: '100%', fontFamily: 'inherit', fontSize: '2rem', letterSpacing: 0 }}>
          Featured Products
        </Typography>
        {/* Responsive: vertical scroll with 4 cards on mobile, grid on desktop */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            flexDirection: 'row',
            overflowX: 'auto',
            gap: 3,
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            pb: 1,
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <Box key={idx} sx={{ width: 224, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 224 }}>
                    <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                  </Box>
                </Box>
              ))
            : products.filter(product => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  (product.name && product.name.toLowerCase().includes(q)) ||
                  (product.category && product.category.toLowerCase().includes(q)) ||
                  (product.brand && product.brand.toLowerCase().includes(q))
                );
              }).map((product) => (
                <Box key={product.id} sx={{ minWidth: 224, display: 'flex', justifyContent: 'center' }}>
                  <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                </Box>
              ))}
        </Box>
        <Grid container spacing={4} alignItems="stretch" justifyContent="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={idx} style={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: 224 }}>
                    <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                  </Box>
                </Grid>
              ))
            : products.filter(product => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  (product.name && product.name.toLowerCase().includes(q)) ||
                  (product.category && product.category.toLowerCase().includes(q)) ||
                  (product.brand && product.brand.toLowerCase().includes(q))
                );
              }).slice(0, 8).map((product) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={product.id} style={{ display: "flex", justifyContent: "center" }}>
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
          <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'flex-start', alignItems: 'center' }}>
            {['Men', 'Women', 'Kids', 'Both'].map(option => (
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
          {/* Filter Modal */}
          <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
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
              width: 400,
              outline: 'none',
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Filter Products</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                  input={<OutlinedInput label="Category" />}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Size</InputLabel>
                <Select
                  value={filters.size}
                  onChange={e => setFilters(f => ({ ...f, size: e.target.value }))}
                  input={<OutlinedInput label="Size" />}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  {sizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Color</InputLabel>
                <Select
                  value={filters.color}
                  onChange={e => setFilters(f => ({ ...f, color: e.target.value }))}
                  input={<OutlinedInput label="Color" />}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  {colors.map(color => <MenuItem key={color} value={color}>{color}</MenuItem>)}
                </Select>
              </FormControl>
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Price Range</Typography>
                <Slider
                  value={[filters.minPrice ? Number(filters.minPrice) : 0, filters.maxPrice ? Number(filters.maxPrice) : 20000]}
                  onChange={(_, newValue) => setFilters(f => ({ ...f, minPrice: newValue[0], maxPrice: newValue[1] }))}
                  valueLabelDisplay="auto"
                  min={0}
                  max={20000}
                  step={100}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
                  <span>₹0</span>
                  <span>��20,000+</span>
                </Box>
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={filters.minRating}
                  onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
                  input={<OutlinedInput label="Rating" />}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  {ratings.map(r => <MenuItem key={r} value={r}>{r} & up</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sort}
                  onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
                  input={<OutlinedInput label="Sort By" />}
                >
                  <MenuItem value=""><em>Default</em></MenuItem>
                  {sortOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button onClick={() => setFilters(f => ({ ...f, category: '', size: '', color: '', minPrice: '', maxPrice: '', minRating: '', sort: '' }))} color="secondary">Clear</Button>
                <Button onClick={() => setFilterModalOpen(false)} variant="contained" color="primary">Apply</Button>
              </Box>
            </Box>
          </Modal>
          {/* Responsive: vertical scroll with 4 cards on mobile, grid/flex on desktop */}
          {/* Show only filtered results grid if any filter or search is active, otherwise show default preferences grid */}
          {(
            filters.category || filters.size || filters.color || filters.minPrice || filters.maxPrice || filters.minRating || filters.sort || searchQuery
          ) ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#e53935', fontWeight: 700 }}>Filtered Results</Typography>
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  flexDirection: 'column',
                  overflowY: 'auto',
                  maxHeight: 4 * 224 + 3 * 24,
                  gap: 3,
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  pb: 1,
                }}
              >
                {(() => {
                  if (loading) {
                    return Array.from({ length: 8 }).map((_, idx) => (
                      <Box key={idx} sx={{ width: 224, display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ width: 224 }}>
                          <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                          <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                        </Box>
                      </Box>
                    ));
                  }
                  if (preference === 'Both') {
                    console.log('DEBUG: Products and gender values for "Both" preference:', products.map(p => ({ name: p.name, gender: p.gender })));
                  }
                  let filtered = products.filter(product =>
                    (preference === 'Men' ? product.gender === 'Men' :
                    preference === 'Women' ? product.gender === 'Women' :
                    preference === 'Kids' ? product.gender === 'Kids' :
                    preference === 'Both' ? (typeof product.gender === 'string' && product.gender.trim().toLowerCase() === 'both') : false)
                    && (
                      !searchQuery ||
                      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    && (!filters.category || product.category === filters.category)
                    && (!filters.size || (product.sizes && product.sizes.includes(filters.size)))
                    && (!filters.color || (product.color && (Array.isArray(product.color) ? product.color.includes(filters.color) : product.color === filters.color)))
                    && (!filters.minPrice || Number(product.price) >= Number(filters.minPrice))
                    && (!filters.maxPrice || Number(product.price) <= Number(filters.maxPrice))
                    && (!filters.minRating || (product.rating || product.avgRating || 0) >= Number(filters.minRating))
                  );
                  if (preference === 'Both') {
                    console.log('DEBUG: Filtered products for "Both":', filtered.map(p => ({ name: p.name, gender: p.gender })));
                  }
                  // Sorting
                  if (filters.sort === 'price_asc') filtered = filtered.sort((a, b) => a.price - b.price);
                  if (filters.sort === 'price_desc') filtered = filtered.sort((a, b) => b.price - a.price);
                  if (filters.sort === 'rating_desc') filtered = filtered.sort((a, b) => (b.rating || b.avgRating || 0) - (a.rating || a.avgRating || 0));
                  if (filters.sort === 'newest') filtered = filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                  if (filtered.length === 0) {
                    return <Typography sx={{ color: '#888', ml: 2 }}>No products found for {preference}.</Typography>;
                  }
                  return filtered.map(product => {
                    if (preference === 'Both') {
                      console.log('RENDERING ProductCard for:', product.name, product.gender);
                    }
                    return (
                      <Box key={product.id} sx={{ width: 224, display: 'flex', justifyContent: 'center' }}>
                        <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                      </Box>
                    );
                  });
                })()}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                flexDirection: 'row',
                overflowX: 'auto',
                gap: 3,
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                pb: 1,
              }}
            >
              {(() => {
                if (loading) {
                  return Array.from({ length: 8 }).map((_, idx) => (
                    <Box key={idx} sx={{ width: 224, display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ width: 224 }}>
                        <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                      </Box>
                    </Box>
                  ));
                }
                let filtered = products.filter(product =>
                  (preference === 'Men' ? product.gender === 'Men' :
                  preference === 'Women' ? product.gender === 'Women' :
                  preference === 'Kids' ? product.gender === 'Kids' :
                  preference === 'Both' ? (typeof product.gender === 'string' && product.gender.trim().toLowerCase() === 'both') : false)
                );
                if (filtered.length === 0) {
                  return <Typography sx={{ color: '#888', ml: 2 }}>No products found for {preference}.</Typography>;
                }
                return filtered.map(product => (
                  <Box key={product.id} sx={{ minWidth: 224, display: 'flex', justifyContent: 'center' }}>
                    <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                  </Box>
                ));
              })()}
            </Box>
          )}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              gridTemplateColumns: { xs: '1fr 1fr', sm: undefined },
              gridAutoRows: { xs: 'auto', sm: undefined },
              gap: { xs: 2, sm: 0 },
              maxHeight: { xs: 'calc(2 * 224px + 32px)', sm: 'none' },
              overflowY: { xs: 'auto', sm: 'visible' },
              width: '100%',
            }}
          >
            {(() => {
              if (loading) {
                return Array.from({ length: 8 }).map((_, idx) => (
                  <Box key={idx} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: 224 }}>
                      <Skeleton variant="rectangular" width={224} height={128} sx={{ borderRadius: 2, mb: 2 }} />
                      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                    </Box>
                  </Box>
                ));
              }
              const filtered = products.filter(product =>
                (preference === 'Men' ? product.gender === 'Men' :
                preference === 'Women' ? product.gender === 'Women' :
                preference === 'Kids' ? product.gender === 'Kids' :
                preference === 'Both' ? (typeof product.gender === 'string' && product.gender.trim().toLowerCase() === 'both') : false)
                && (
                  !searchQuery ||
                  (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              );
              if (filtered.length === 0) {
                return <Typography sx={{ color: '#888', ml: 2 }}>No products found for {preference}.</Typography>;
              }
              return filtered.map(product => (
                <Box key={product.id} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                </Box>
              ));
            })()}
          </Box>
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
