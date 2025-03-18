import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch wishlist products
const fetchWishlist = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${API_BASE_URL}/wishlist/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export default function Wishlist() {
  const queryClient = useQueryClient();
  const { data: wishlist = [], isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  // ✅ Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: async (wishlistId) => {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/wishlist/${wishlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Removed from wishlist!");
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  // ✅ Add to Cart mutation (Fixed: Correct product ID now sent)
  const addToCart = useMutation({
    mutationFn: async (productId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add items to the cart.");
        return;
      }

      try {
        await axios.post(`${API_BASE_URL}/cart/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Added to cart!");
        queryClient.invalidateQueries(["wishlist"]);
      } catch (error) {
        console.error("Error adding to cart:", error.response?.data || error);
        toast.error(error.response?.data?.detail || "Failed to add to cart.");
      }
    },
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading wishlist...</p>;
  if (error) {
    console.error("Error fetching wishlist:", error);
    return <p className="text-center text-red-500">Error loading wishlist.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Wishlist ❤️</h1>
      {wishlist.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">Your wishlist is empty. Start adding your favorite products!</p>
          <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.wishlist_id} className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between">
              <img
                src={item.product?.image || "https://via.placeholder.com/150"}
                alt={item.product?.title || "Product Image"}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{item.product?.title || "No title available"}</h2>
              <p className="text-gray-600 text-sm my-2">{item.product?.description || "No description available"}</p>
              <p className="text-gray-700 font-semibold">${item.product?.price || "N/A"}</p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => addToCart.mutate(item.product.id)}
                >
                  Add to Cart 🛒
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  onClick={() => removeFromWishlist.mutate(item.wishlist_id)}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
