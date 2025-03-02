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

// ✅ Improved QueryClient Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <ToastConfig />
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="*" element={<h1 className="text-center text-3xl mt-10">Page Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
