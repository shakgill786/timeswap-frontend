import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchWishlist = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get("http://127.0.0.1:8000/wishlist/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default function Wishlist() {
  const { data: wishlist, isLoading } = useQuery(["wishlist"], fetchWishlist);

  if (isLoading) return <p>Loading wishlist...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <ul className="space-y-4">
        {wishlist.map((product) => (
          <li key={product.id} className="border p-4 rounded-lg">
            {product.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
