import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch cart items
const fetchCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${API_BASE_URL}/cart/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return Array.isArray(data) ? data : []; // Ensure data is an array
};

export default function Cart() {
  const queryClient = useQueryClient();
  const { data: cart = [], isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  // ✅ Remove from cart mutation
  const removeFromCart = useMutation({
    mutationFn: async (cartId) => {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Removed from cart!");
      queryClient.invalidateQueries(["cart"]);
    },
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading cart...</p>;
  if (error) {
    console.error("Error fetching cart:", error);
    return <p className="text-center text-red-500">Error loading cart.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart 🛍️</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty. Add items to proceed to checkout!</p>
          <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between">
              <img
                src={item.product?.image !== "string" ? item.product?.image : "https://via.placeholder.com/150"}
                alt={item.product?.title || "Product Image"}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{item.product?.title || "No title available"}</h2>
              <p className="text-gray-600 text-sm my-2">{item.product?.description || "No description available"}</p>
              <p className="text-gray-700 font-semibold">${item.product?.price ? item.product?.price : "N/A"}</p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  onClick={() => removeFromCart.mutate(item.id)}
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
