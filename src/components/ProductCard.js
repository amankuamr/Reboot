import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase"; // Removed duplicate db import
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const ProductCard = ({ product, onAddToCart }) => {
  if (product && product.gender && typeof product.gender === 'string' && product.gender.trim().toLowerCase() === 'both') {
    console.log('ProductCard rendering for BOTH:', product);
  }
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // DEBUG: Log the product object to inspect its structure
  console.log('ProductCard product:', product);

  // Wishlist state
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setWishlist(userDoc.exists() && userDoc.data().wishlist ? userDoc.data().wishlist : []);
      }
    };
    fetchWishlist();
  }, [user]);
  const isInWishlist = (id) => wishlist.includes(id);
  const handleWishlistToggle = async (product) => {
    if (!user) {
      alert("Please log in to use the wishlist.");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    if (isInWishlist(product.id)) {
      await updateDoc(userRef, { wishlist: arrayRemove(product.id) });
      setWishlist(wishlist.filter(i => i !== product.id));
    } else {
      await setDoc(userRef, { wishlist: arrayUnion(product.id) }, { merge: true });
      setWishlist([...wishlist, product.id]);
    }
  };

  // Fetch reviews and calculate average rating as in ProductDetail
  const [avgRating, setAvgRating] = useState('N/A');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsSnap = await getDocs(collection(db, "products", product.id, "reviews"));
        const reviews = reviewsSnap.docs.map(doc => doc.data());
        if (reviews.length > 0) {
          const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
          setAvgRating((sum / reviews.length).toFixed(1));
        } else {
          setAvgRating('N/A');
        }
      } catch (e) {
        setAvgRating('N/A');
      }
    };
    if (product.id) fetchReviews();
  }, [product.id]);

  const handleCardClick = (e) => {
    // Prevent navigation if Add to cart button is clicked
    if (e.target.closest('.add-to-cart-btn')) return;
    navigate(`/product/${product.id}`);
  };
  return (
    <Box
      className="uiverse-card"
      onClick={handleCardClick}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 2,
        width: 224,
        background: "linear-gradient(120deg, rgba(229,57,53,0.08) 0%, #fff 100%)",
        borderRadius: 3,
        boxShadow: "0 2px 16px 0 rgba(31,38,135,0.06)",
        border: "2px solid transparent",
        transition: "border-color 0.2s, opacity 0.2s",
        cursor: "pointer",
        '&:hover': {
          borderColor: '#e53935',
          opacity: 0.92,
          '& img': {
            transform: 'scale(1.07)'
          }
        }
      }}
    >
      {/* Heart Icon for Wishlist (Uiverse.io style) */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 12 }}>
        <label
          className="wishlist-heart-container"
          style={{ display: 'block', position: 'relative', cursor: 'pointer', fontSize: 16, userSelect: 'none', transition: '100ms' }}
          onClick={e => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isInWishlist(product.id)}
            onChange={() => handleWishlistToggle(product)}
            style={{ position: 'absolute', opacity: 0, cursor: 'pointer', height: 0, width: 0 }}
          />
          <div className="wishlist-heart-checkmark" style={{ top: 0, left: 0, height: '1.3em', width: '1.3em', transition: '100ms', animation: 'dislike_effect 400ms ease', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px 0 rgba(229,57,53,0.10)', padding: 2 }}>
            <svg viewBox="0 0 256 256" style={{ width: '1.3em', height: '1.3em', display: 'block' }}>
              <rect fill="none" height="256" width="256"></rect>
              <path className="wishlist-heart-path" d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#FFF" fill="#bbb"></path>
            </svg>
          </div>
          <style>{`
            .wishlist-heart-container input {
              position: absolute;
              opacity: 0;
              cursor: pointer;
              height: 0;
              width: 0;
            }
            .wishlist-heart-container {
              display: block;
              position: relative;
              cursor: pointer;
              font-size: 20px;
              user-select: none;
              transition: 100ms;
            }
            .wishlist-heart-checkmark {
              top: 0;
              left: 0;
              height: 2em;
              width: 2em;
              transition: 100ms;
              animation: dislike_effect 400ms ease;
            }
            .wishlist-heart-container input:checked ~ .wishlist-heart-checkmark .wishlist-heart-path {
              fill: #FF5353;
              stroke-width: 0;
            }
            .wishlist-heart-container input:checked ~ .wishlist-heart-checkmark {
              animation: like_effect 400ms ease;
            }
            .wishlist-heart-container:hover {
              transform: scale(1.1);
            }
            @keyframes like_effect {
              0% { transform: scale(0); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            @keyframes dislike_effect {
              0% { transform: scale(0); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          `}</style>
        </label>
      </Box>

      {/* Gender Tag */}
      {product.gender && (
        <Box sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: product.gender === 'Men' ? '#2d6cdf' : product.gender === 'Women' ? '#e53935' : '#43a047',
          color: '#fff',
          fontWeight: 700,
          fontSize: 12,
          px: 1.5,
          py: 0.5,
          borderRadius: 8,
          zIndex: 10,
          textTransform: 'uppercase',
          letterSpacing: 1
        }}>
          {product.gender}
        </Box>
      )}
      {/* Image */}
      <Box
        sx={{
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          zIndex: 5,
          minHeight: 40,
            width: "100%",
          height: 128,
          background: "#fff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
      </Box>
      {/* Name and Type Tag Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: { xs: '0.75rem', sm: "1rem" }, fontWeight: 600, color: "#222", textTransform: "capitalize", textOverflow: "ellipsis", overflow: "clip", whiteSpace: "nowrap", m: 0 }}>
          {product.name}
        </Typography>
        {product.category && (
          <Box sx={{
            background: '#f3f6fa',
            color: '#2d6cdf',
            fontWeight: 700,
            fontSize: { xs: 9, sm: 11 },
            px: 1.2,
            py: 0.3,
            borderRadius: 6,
            textTransform: 'capitalize',
            letterSpacing: 1,
            ml: 2,
            minWidth: 60,
            textAlign: 'right',
            m: 0
          }}>{product.category}</Box>
        )}
      </Box>
      {/* Colors and Rating Row (side by side) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, mt: { xs: 0.2, sm: 0.5 }, mb: { xs: 0.2, sm: 0.5 }, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {Array.isArray(product.color) && product.color.length > 0 && (
            product.color.map((color, idx) => (
              <span
                key={idx}
                title={color}
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: color,
                  border: '1px solid #ccc',
                  marginRight: 4
                }}
              />
            ))
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span style={{ color: '#fbc02d', fontSize: 13 }}>★</span>
          <Typography sx={{ fontSize: { xs: 10, sm: 13 }, color: '#222', fontWeight: 600, m: 0 }}>
            {avgRating}
          </Typography>
        </Box>
      </Box>
      {/* Size */}
      <Box sx={{ fontSize: { xs: '0.7rem', sm: "0.85rem" }, color: "#222", m: 0 }}>
        <span>Size</span>
        <ul style={{ display: "flex", alignItems: "center", gap: 2, margin: 0, marginTop: 0, padding: 0 }}>
          {product.sizes && product.sizes.map((size) => (
            <li key={size} style={{ listStyle: "none" }}>
              <button
                className="uiverse-size-btn"
                style={{
                  cursor: "pointer",
                  padding: "0.25rem",
                  background: "#fff",
                  fontSize: "0.7rem",
                  color: "#222",
                  border: "2px solid #eee",
                  borderRadius: 4,
                  transition: "all 0.3s",
                }}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      </Box>
      {/* Action */}
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, mt: { xs: 0.5, sm: 1 } }}>
        <Typography sx={{ fontSize: { xs: '0.9rem', sm: "1.2rem" }, fontWeight: 700, color: "#111" }}>
          ₹{product.price}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          {isMobile ? (
            <Button
              onClick={onAddToCart}
              className="add-to-cart-btn"
              variant="contained"
              sx={{
                minWidth: 0,
                p: 1,
                background: "#e53935",
                color: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 8px 0 rgba(229,57,53,0.10)",
                '&:hover': { background: '#b71c1c', color: '#fff' },
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <circle cx="18" cy="6" r="4" fill="#fff" stroke="#e53935" strokeWidth="1.5" />
                <path d="M18 4.7v2.6M16.7 6H19.3" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Button>
          ) : (
            <Button
              onClick={onAddToCart}
              className="add-to-cart-btn"
              variant="contained"
              sx={{
                background: "#e53935",
                color: "#fff",
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "0.95rem",
                px: 2.5,
                py: 1,
                boxShadow: "0 2px 8px 0 rgba(229,57,53,0.10)",
                textTransform: "none",
                '&:hover': { background: '#b71c1c', color: '#fff' },
                width: "100%"
              }}
              startIcon={
                <svg
                  className="cart-icon"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: 18, height: 18 }}
                >
                  <path
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              }
            >
              Add to cart
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
