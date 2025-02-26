import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch wishlist products
const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_BASE_URL}/wishlist/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

export default function Wishlist() {
  const queryClient = useQueryClient();
  const { data: wishlist, isLoading, error } = useQuery(["wishlist"], fetchWishlist);

  // ✅ Remove from wishlist mutation
  const removeFromWishlist = useMutation(
    async (productId) => {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => {
        toast.success("Removed from wishlist!");
        queryClient.invalidateQueries(["wishlist"]);
      },
    }
  );

  // ✅ Add to Cart mutation
  const addToCart = useMutation(
    async (productId) => {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/cart/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => {
        toast.success("Added to cart!");
        queryClient.invalidateQueries(["wishlist"]);
      },
    }
  );

  if (isLoading) return <p className="text-center text-gray-500">Loading wishlist...</p>;
  if (error || !wishlist || wishlist.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Wishlist</h1>
        <p className="text-gray-500">Your wishlist is empty. Start adding your favorite products!</p>
        <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Wishlist ❤️</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between">
            {/* Product Image */}
            <img
              src={product.image !== "string" ? product.image : "https://via.placeholder.com/150"}
              alt={product.title}
              className="w-full h-40 object-cover rounded-md mb-4"
            />

            {/* Product Title */}
            <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => addToCart.mutate(product.id)}
              >
                Add to Cart 🛒
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => removeFromWishlist.mutate(product.id)}
              >
                Remove ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
