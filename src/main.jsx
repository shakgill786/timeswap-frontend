import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Auth from "./pages/Auth.jsx";
import CreateProduct from "./pages/CreateProduct.jsx"; // ✅ Import Create Product Page

import "./index.css";

// ✅ Create the Query Client
const queryClient = new QueryClient();

function App() {
  return (
    // ✅ Wrap everything inside QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-product" element={<CreateProduct />} /> {/* ✅ Add Create Product Page */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
