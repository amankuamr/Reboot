import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Box
      className="uiverse-card"
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
        '&:hover': {
          borderColor: '#e53935',
          opacity: 0.92,
          '& img': {
            transform: 'scale(1.07)'
          }
        }
      }}
    >
      {/* Image */}
      <Box
        sx={{
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          zIndex: 5,
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
      {/* Title */}
      <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#222", textTransform: "capitalize", textOverflow: "ellipsis", overflow: "clip", whiteSpace: "nowrap", mt: 1 }}>
        {product.name}
      </Typography>
      {/* Size */}
      <Box sx={{ fontSize: "0.85rem", color: "#222", mt: 0.5 }}>
        <span>Size</span>
        <ul style={{ display: "flex", alignItems: "center", gap: 4, margin: 0, marginTop: 4, padding: 0 }}>
          {product.sizes && product.sizes.map((size) => (
            <li key={size} style={{ listStyle: "none" }}>
              <button
                className="uiverse-size-btn"
                style={{
                  cursor: "pointer",
                  padding: "0.5rem",
                  background: "#fff",
                  fontSize: "0.85rem",
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#111" }}>
          ₹{product.price}
        </Typography>
        <Button
          onClick={onAddToCart}
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
      </Box>
    </Box>
  );
};

export default ProductCard;
