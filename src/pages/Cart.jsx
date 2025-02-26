import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch cart items
const fetchCart = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${API_BASE_URL}/cart/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default function Cart() {
  const queryClient = useQueryClient();
  const { data: cart, isLoading, error } = useQuery(["cart"], fetchCart);

  // ✅ Remove from cart mutation
  const removeFromCart = useMutation(
    async (cartId) => {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => {
        toast.success("Removed from cart!");
        queryClient.invalidateQueries(["cart"]);
      },
    }
  );

  if (isLoading) return <p className="text-center text-gray-500">Loading cart...</p>;
  if (error || !cart || cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart 🛒</h1>
        <p className="text-gray-500">Your cart is empty. Add items to proceed to checkout!</p>
        <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart 🛍️</h1>
      
      {/* Cart Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cart.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between">
            {/* Product Image */}
            <img
              src={item.product.image !== "string" ? item.product.image : "https://via.placeholder.com/150"}
              alt={item.product.title}
              className="w-full h-40 object-cover rounded-md mb-4"
            />

            {/* Product Details */}
            <h2 className="text-xl font-semibold text-gray-800">{item.product.title}</h2>
            <p className="text-gray-600 text-sm my-2">{item.product.description}</p>
            <p className="text-gray-700 font-semibold">${item.product.price ? item.product.price : "N/A"}</p>

            {/* Action Buttons */}
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

      {/* Checkout Section */}
      <div className="text-center mt-8">
        <button className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition">
          Proceed to Checkout ✅
        </button>
      </div>
    </div>
  );
}
