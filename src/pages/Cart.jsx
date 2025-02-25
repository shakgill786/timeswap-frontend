import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{item.product.title}</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={() => removeFromCart.mutate(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
