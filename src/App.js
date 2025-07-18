import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import Featured from "./pages/Featured";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";
import "./App.css";
import { SearchFilterProvider } from "./context/SearchFilterContext";

function App() {
  return (
    <SearchFilterProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/featured" element={<Featured />} />
        </Routes>
      </Router>
    </SearchFilterProvider>
  );
}

export default App;
