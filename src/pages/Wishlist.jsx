import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchWishlist = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${API_BASE_URL}/wishlist/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default function Wishlist() {
  const queryClient = useQueryClient();
  const { data: wishlist, isLoading, error } = useQuery(["wishlist"], fetchWishlist);

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

  if (isLoading) return <p>Loading wishlist...</p>;
  if (error) return <p>Error loading wishlist.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md">
              <img
                src={product.image !== "string" ? product.image : "https://via.placeholder.com/150"}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={() => removeFromWishlist.mutate(product.id)}
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
