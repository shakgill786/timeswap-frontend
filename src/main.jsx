import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastConfig from "./ToastConfig.jsx";
import Navbar from "./Navbar.jsx";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import CreateProduct from "./pages/CreateProduct";

import "./index.css";

// ✅ Ensure React Query is set up properly
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastConfig />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-product" element={<CreateProduct />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

// ✅ Ensure React renders properly
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
