import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const fetchProduct = async (id) => {
  const { data } = await axios.get(`http://127.0.0.1:8000/products/${id}`);
  return data;
};

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery(["product", id], () => fetchProduct(id));

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    await axios.post(`http://127.0.0.1:8000/cart/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Added to cart!");
  };

  const addToWishlist = async () => {
    const token = localStorage.getItem("token");
    await axios.post(`http://127.0.0.1:8000/wishlist/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Added to wishlist!");
  };

  if (isLoading) return <p>Loading product...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      
      {/* Buttons to add to cart and wishlist */}
      <div className="mt-4 space-x-4">
        <button onClick={addToCart} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Add to Cart
        </button>
        <button onClick={addToWishlist} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
