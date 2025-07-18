import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { updateDoc } from "firebase/firestore";
import Rating from "@mui/material/Rating";
import Navbar from "../components/Navbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MenuItem from "@mui/material/MenuItem";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dgyqgv15p/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "Reeboot";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", sizes: "", image: null, gender: "", type: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [editId, setEditId] = useState(null); // Track which product is being edited

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchProducts();
    fetchAllReviews();
    return () => unsub();
  }, []);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchAllReviews = async () => {
    const productsSnap = await getDocs(collection(db, "products"));
    let reviewsArr = [];
    for (const prodDoc of productsSnap.docs) {
      const prodId = prodDoc.id;
      const prodData = prodDoc.data();
      const reviewsSnap = await getDocs(collection(db, "products", prodId, "reviews"));
      reviewsSnap.forEach((revDoc) => {
        reviewsArr.push({
          id: revDoc.id,
          productId: prodId,
          productName: prodData.name,
          ...revDoc.data()
        });
      });
    }
    setAllReviews(reviewsArr);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let imgUrl = imageUrl;
      if (form.image && !imgUrl) {
        imgUrl = await handleImageUpload(form.image);
        setImageUrl(imgUrl);
      }
      const sizesArr = form.sizes.split(",").map(s => parseInt(s.trim(), 10)).filter(Boolean);
      if (editId) {
        // Update existing product
        await updateDoc(doc(db, "products", editId), {
          name: form.name,
          price: Number(form.price),
          category: form.category || '',
          type: form.type || '',
          color: form.color || [],
          sizes: sizesArr,
          image: imgUrl,
          gender: form.gender || ''
        });
      } else {
        // Add new product
        await addDoc(collection(db, "products"), {
          name: form.name,
          price: Number(form.price),
          category: form.category || '',
          type: form.type || '',
          color: form.color || [],
          sizes: sizesArr,
          image: imgUrl,
          createdAt: new Date(),
          stock: 10,
          description: "",
          gender: form.gender || ''
        });
      }
      setForm({ name: "", price: "", category: "", sizes: "", image: null });
      setImageUrl("");
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError("Failed to add/update product. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const handleDeleteReview = async (productId, reviewId) => {
    await deleteDoc(doc(db, "products", productId, "reviews", reviewId));
    fetchAllReviews();
  };

  // Menu bar is now static, no tab state or scroll logic
  return (
    <>
      <Navbar />
      <Box sx={{ background: "#fff", boxShadow: 1, mb: 4, px: 3, py: 1, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 700, color: '#2d6cdf', fontSize: 18 }}>Add/Remove Product</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography sx={{ fontWeight: 700, color: '#2d6cdf', fontSize: 18 }}>Ratings</Typography>
      </Box>
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0e7ff 0%, #f7f8fa 100%)", py: 6 }}>
        <Paper sx={{ maxWidth: 1300, mx: "auto", p: 4, borderRadius: 6, background: "rgba(255,255,255,0.8)", boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)", border: "1px solid rgba(255,255,255,0.18)" }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "#222", textAlign: "center" }}>Admin Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
            {/* Left: Product Management */}
            <Box sx={{ flex: 1, minWidth: 340 }}>
              <div id="product-section"></div>
              <Typography variant="h6" sx={{ mb: 2, color: "#2d6cdf" }}>Add New Product</Typography>
              <form onSubmit={handleAddProduct} style={{ marginBottom: 32 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <TextField label="Name" name="name" value={form.name} onChange={handleInputChange} required sx={{ flex: 1, minWidth: 180 }} />
                  <TextField label="Price" name="price" value={form.price} onChange={handleInputChange} required type="number" sx={{ flex: 1, minWidth: 120 }} />
                  <TextField
                    select
                    label="Color"
                    name="color"
                    value={form.color || []}
                    onChange={e => setForm(prev => ({ ...prev, color: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value }))}
                    required
                    SelectProps={{ multiple: true }}
                    sx={{ flex: 1, minWidth: 120 }}
                  >
                    <MenuItem value="Black">Black</MenuItem>
                    <MenuItem value="White">White</MenuItem>
                    <MenuItem value="Red">Red</MenuItem>
                    <MenuItem value="Blue">Blue</MenuItem>
                    <MenuItem value="Green">Green</MenuItem>
                    <MenuItem value="Yellow">Yellow</MenuItem>
                    <MenuItem value="Orange">Orange</MenuItem>
                    <MenuItem value="Pink">Pink</MenuItem>
                    <MenuItem value="Brown">Brown</MenuItem>
                    <MenuItem value="Grey">Grey</MenuItem>
                    <MenuItem value="Purple">Purple</MenuItem>
                  </TextField>
                  <TextField label="Sizes (comma separated)" name="sizes" value={form.sizes} onChange={handleInputChange} required sx={{ flex: 1, minWidth: 180 }} />
                  {/* Category Dropdown (types only) */}
                  <TextField
                    select
                    label="Category"
                    name="category"
                    value={form.category || ''}
                    onChange={handleInputChange}
                    required
                    SelectProps={{ native: true }}
                    sx={{ flex: 1, minWidth: 140 }}
                  >
                    <option value="">Select Category</option>
                    <option value="Casual">Casual</option>
                    <option value="Sports">Sports</option>
                    <option value="Running">Running</option>
                    <option value="Outdoor">Outdoor</option>
                  </TextField>
                  {/* Gender Dropdown (Men/Women/Kids) */}
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={form.gender || ''}
                    onChange={handleInputChange}
                    required
                    SelectProps={{ native: true }}
                    sx={{ flex: 1, minWidth: 140 }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Both">Both</option>
                  </TextField>
                </Box>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <Button variant="contained" component="label" sx={{ borderRadius: 999, background: "#2d6cdf" }}>
                    Upload Image
                    <input type="file" name="image" accept="image/*" hidden onChange={handleInputChange} />
                  </Button>
                  {form.image && <Typography>{form.image.name}</Typography>}
                </Box>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                <Button type="submit" variant="contained" sx={{ mt: 3, borderRadius: 999, fontWeight: 700, background: "#e53935", px: 4, py: 1, fontSize: "1.1rem" }} disabled={loading}>
                  {loading ? (editId ? "Updating..." : "Adding...") : (editId ? "Update Product" : "Add Product")}
                </Button>
              </form>
              <Typography variant="h6" sx={{ mb: 2, color: "#2d6cdf" }}>Product List</Typography>
              {products.length === 0 ? (
                <Typography sx={{ color: "#888" }}>No products found.</Typography>
              ) : (
                products.map((prod) => (
                  <Box key={prod.id} sx={{ display: "flex", alignItems: "center", mb: 2, p: 2, borderRadius: 4, background: "#f7f8fa", boxShadow: "0 2px 8px 0 rgba(31,38,135,0.06)" }}>
                    <img src={prod.image} alt={prod.name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, marginRight: 16 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: "#222" }}>{prod.name}</Typography>
                      <Typography sx={{ color: "#444" }}>₹{prod.price} | Category: {prod.category} | Type: {prod.type} | {prod.gender} | {Array.isArray(prod.color) ? prod.color.map((c, i) => <span key={c} style={{color: c, fontWeight: 700, marginRight: 4}}>●</span>) : <span style={{color: prod.color, fontWeight: 700}}>●</span>} {Array.isArray(prod.color) ? prod.color.join(", ") : prod.color} | Sizes: {prod.sizes && prod.sizes.join(", ")}</Typography>
                    </Box>
                    <IconButton onClick={() => {
                      setEditId(prod.id);
                      setForm({
                        name: prod.name || "",
                        price: prod.price || "",
                        category: prod.category || "",
                        type: prod.type || "",
                        color: prod.color || [],
                        sizes: prod.sizes ? prod.sizes.join(",") : "",
                        gender: prod.gender || "",
                        image: null
                      });
                      setImageUrl(prod.image || "");
                    }} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(prod.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
            {/* Right: Reviews Section */}
            <Box sx={{ flex: 1, minWidth: 340 }}>
              <div id="reviews-section"></div>
              <Typography variant="h6" sx={{ mb: 2, color: "#2d6cdf" }}>All Product Reviews</Typography>
              {allReviews.length === 0 ? (
                <Typography sx={{ color: "#888" }}>No reviews found.</Typography>
              ) : (
                allReviews.map((rev) => (
                  <Box key={rev.id + rev.productId} sx={{ display: "flex", alignItems: "center", mb: 2, p: 2, borderRadius: 4, background: "#f7f8fa", boxShadow: "0 2px 8px 0 rgba(31,38,135,0.06)" }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: "#222" }}>{rev.productName}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Rating value={rev.rating} readOnly size="small" />
                        <Typography sx={{ color: '#222', fontWeight: 600 }}>{rev.user}</Typography>
                      </Box>
                      {rev.text && <Typography sx={{ color: '#333', fontSize: 15 }}>{rev.text}</Typography>}
                      <Typography sx={{ color: '#aaa', fontSize: 13, mt: 1 }}>{rev.createdAt && rev.createdAt.toDate ? rev.createdAt.toDate().toLocaleString() : ''}</Typography>
                    </Box>
                    <IconButton onClick={() => handleDeleteReview(rev.productId, rev.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default AdminDashboard;
