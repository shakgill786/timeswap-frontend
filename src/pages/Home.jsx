import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch Products Function
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/`);
    return response.data.filter((product) => product.title !== "string");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default function Home() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Use React Query to fetch products
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // ✅ Search Products API Call
  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products/?query=${searchTerm}`);
      queryClient.setQueryData(["products"], data); // Update cache for real-time filtering
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  // ✅ Enable search on "Enter" keypress
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching products</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Available Products</h1>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-4 py-2 rounded-l-md focus:ring-2 focus:ring-blue-400 outline-none w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress} // Enable search on Enter key
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* 🏪 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <img
              src={product.image !== "string" ? product.image : "https://via.placeholder.com/150"}
              alt={product.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <Link
              to={`/product/${product.id}`}
              className="text-blue-500 font-medium hover:underline mt-2 inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
