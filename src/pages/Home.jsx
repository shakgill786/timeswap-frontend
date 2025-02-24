import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// ✅ Fetch products from API
const fetchProducts = async () => {
  const { data } = await axios.get("http://127.0.0.1:8000/products/");
  return data;
};

export default function Home() {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const { data } = await axios.get(`http://127.0.0.1:8000/products/?query=${searchTerm}`);
      setProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add items to the cart.");
      navigate("/auth");
      return;
    }

    try {
      await axios.post(`http://127.0.0.1:8000/cart/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add items to the wishlist.");
      navigate("/auth");
      return;
    }

    try {
      await axios.post(`http://127.0.0.1:8000/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching products</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Available Products</h1>

      {/* Search Bar */}
      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-4 py-2 rounded-l-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Add Product Button */}
      <div className="flex justify-center mb-6">
        <Link to="/create-product" className="bg-green-500 text-white px-4 py-2 rounded-md">
          + Add Product
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <img src={product.image || "https://via.placeholder.com/150"} alt={product.title} className="w-full h-40 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => addToWishlist(product.id)}
              >
                Add to Wishlist
              </button>
            </div>
            <Link to={`/product/${product.id}`} className="text-blue-500 font-medium hover:underline mt-2 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
