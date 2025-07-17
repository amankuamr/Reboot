import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc, collection, addDoc, query, orderBy, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';

const COLOR_OPTIONS = ["#111", "#e53935", "#2d6cdf", "#43a047", "#fbc02d"];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [user, setUser] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
        if (docSnap.data().sizes && docSnap.data().sizes.length > 0) {
          setSelectedSize(docSnap.data().sizes[0]);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Listen for reviews
    const q = query(collection(db, "products", id, "reviews"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (reviewRating === 0) return;
    setSubmitting(true);
    await addDoc(collection(db, "products", id, "reviews"), {
      rating: reviewRating,
      text: reviewText,
      user: user.displayName || user.email,
      userId: user.uid,
      createdAt: new Date()
    });
    setReviewRating(0);
    setReviewText("");
    setSubmitting(false);
  };

  // Edit review handlers
  const handleMenuOpen = (event, review) => {
    setAnchorEl(event.currentTarget);
    setEditReviewId(review.id);
    setEditRating(review.rating);
    setEditText(review.text || "");
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditReviewId(null);
    setEditRating(0);
    setEditText("");
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!user || !editReviewId) return;
    await updateDoc(doc(db, "products", id, "reviews", editReviewId), {
      rating: editRating,
      text: editText
    });
    handleMenuClose();
  };
  const handleDelete = async () => {
    if (!user || !editReviewId) return;
    await deleteDoc(doc(db, "products", id, "reviews", editReviewId));
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography variant="h5">Product not found.</Typography>
      </Box>
    );
  }

  // Calculate average rating from reviews
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : null;

  return (
    <div>
      <Navbar />
      <Box sx={{ maxWidth: 1100, mx: "auto", mt: 6, p: 3, borderRadius: 4, background: "#fff", boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Left: Image */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", maxWidth: 420, maxHeight: 420, borderRadius: 16, objectFit: "cover" }} />
          </Box>
          {/* Right: Details */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                {product.category || "Product"}
              </Typography>
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {/* Star rating, show average of reviews or fallback to N/A */}
                <span style={{ color: '#fbc02d', fontSize: 20 }}>★</span>
                <Typography variant="body2" sx={{ color: '#222', fontWeight: 600 }}>
                  {avgRating !== null ? avgRating : 'N/A'}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{product.name}</Typography>
            <Typography variant="h5" sx={{ color: "#e53935", fontWeight: 700, mb: 2 }}>₹{product.price}</Typography>
            {/* Color Selector for Consumer */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Color:</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: 'center' }}>
              {Array.isArray(product.color) && product.color.length > 0 ? (
                product.color.map((color, idx) => (
                  <Box
                    key={color + idx}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      border: selectedColor === color ? '2px solid #e53935' : '2px solid #eee',
                      borderRadius: '50%',
                      p: 0.5,
                      background: selectedColor === color ? 'rgba(229,57,53,0.08)' : 'transparent',
                      transition: 'border 0.2s, background 0.2s',
                      position: 'relative',
                      width: 32, height: 32
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: color.toLowerCase(),
                      border: '2px solid #eee',
                      position: 'relative',
                    }} />
                    {selectedColor === color && (
                      <CheckIcon sx={{
                        color: '#fff',
                        fontSize: 18,
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        background: color.toLowerCase(),
                        borderRadius: '50%',
                        p: 0.2
                      }} />
                    )}
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: 14, color: '#888' }}>No color specified</Typography>
              )}
            </Box>
            {/* Size Selector */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Size:</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {product.sizes && product.sizes.map((size) => (
                <Button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  variant={selectedSize === size ? "contained" : "outlined"}
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
            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  background: "#e53935",
                  color: "#fff",
                  borderRadius: 999,
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  '&:hover': { background: '#b71c1c' },
                }}
                disabled={!selectedColor || !selectedSize}
                onClick={async () => {
                  if (!user) {
                    alert("Please log in to add products to your cart.");
                    window.location.href = "/login";
                    return;
                  }
                  const cartItem = {
                    productId: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    color: selectedColor,
                    size: selectedSize,
                    quantity: 1,
                  };
                  // Save to user's cart in Firestore
                  const userDoc = await getDoc(doc(db, "users", user.uid));
                  let cart = userDoc.data()?.cart || [];
                  const idx = cart.findIndex(
                    (item) => item.productId === cartItem.productId && item.size === cartItem.size && item.color === cartItem.color
                  );
                  if (idx > -1) {
                    cart[idx].quantity += 1;
                  } else {
                    cart.push(cartItem);
                  }
                  await setDoc(doc(db, "users", user.uid), { cart }, { merge: true });
                  alert("Added to cart!");
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "#111",
                  color: "#fff",
                  borderRadius: 999,
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  '&:hover': { background: '#e53935' },
                }}
                disabled={!selectedColor || !selectedSize}
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </Box>
        {/* Rating & Testimony Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Rate & Review this Product</Typography>
          {user ? (
            <form onSubmit={handleReviewSubmit} style={{ marginBottom: 32 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Rating
                  name="user-rating"
                  value={reviewRating}
                  onChange={(_, newValue) => setReviewRating(newValue)}
                  size="large"
                />
                <Typography sx={{ color: '#e53935', fontWeight: 600 }}>{reviewRating > 0 ? reviewRating : ''}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Write your review (optional)"
                  rows={3}
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                disabled={reviewRating === 0 || submitting}
                sx={{
                  background: '#e53935',
                  color: '#fff',
                  borderRadius: 999,
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': { background: '#b71c1c' },
                }}
              >
                Submit Review
              </Button>
            </form>
          ) : (
            <Typography sx={{ color: '#e53935', mb: 3 }}>
              Please log in to rate and review this product.
            </Typography>
          )}
          {/* Testimonies */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>What others say</Typography>
            {reviews.length === 0 && (
              <Typography sx={{ color: '#888' }}>No reviews yet.</Typography>
            )}
            {reviews.map((rev) => (
              <Box key={rev.id} sx={{ mb: 3, p: 2, borderRadius: 3, background: '#f7f8fa', boxShadow: '0 2px 8px 0 rgba(31,38,135,0.06)', position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={rev.rating} readOnly size="small" />
                  <Typography sx={{ fontWeight: 600, color: '#222' }}>{rev.user}</Typography>
                  {/* 3-dot menu for user's own review */}
                  {user && rev.userId === user.uid && (
                    <IconButton size="small" onClick={e => handleMenuOpen(e, rev)} sx={{ ml: 1 }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {editReviewId === rev.id ? (
                  <form onSubmit={handleEditSubmit}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Rating
                        name="edit-rating"
                        value={editRating}
                        onChange={(_, newValue) => setEditRating(newValue)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        rows={2}
                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', fontSize: 15 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button type="submit" variant="contained" size="small" sx={{ background: '#2d6cdf', color: '#fff', borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                        Save
                      </Button>
                      <Button onClick={handleMenuClose} size="small" sx={{ color: '#e53935', textTransform: 'none', fontWeight: 700 }}>
                        Cancel
                      </Button>
                    </Box>
                  </form>
                ) : (
                  <>
                    {rev.text && <Typography sx={{ color: '#333', fontSize: 15 }}>{rev.text}</Typography>}
                    <Typography sx={{ color: '#aaa', fontSize: 13, mt: 1 }}>{rev.createdAt && rev.createdAt.toDate ? rev.createdAt.toDate().toLocaleString() : ''}</Typography>
                  </>
                )}
              </Box>
            ))}
            {/* 3-dot menu (edit/delete) */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { setEditReviewId(editReviewId); setAnchorEl(null); }}>Edit</MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: '#e53935' }}>Delete</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ProductDetail;
