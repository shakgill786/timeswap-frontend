import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/`);
    return response.data.filter(product => product.title !== "string");
  } catch (error) {
    toast.error("Error fetching products");
    throw error;
  }
};

export default function Home() {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useQuery(["products"], fetchProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products/?query=${searchTerm}`);
      toast.success("Search updated!");
      console.log("Search Results:", data);
    } catch (error) {
      toast.error("Error searching products");
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching products</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Available Products</h1>

      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-4 py-2 rounded-l-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <img 
              src={product.image !== "string" ? product.image : "https://via.placeholder.com/150"} 
              alt={product.title} 
              className="w-full h-40 object-cover rounded-md mb-4" 
            />
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
