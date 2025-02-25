import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchProduct = async (id) => {
  const { data } = await axios.get(`${API_BASE_URL}/products/${id}`);
  return data;
};

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading product...</p>;
  if (error || !product) return <p className="text-center text-red-500">Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg bg-white">
      <img 
        src={product.image !== "string" ? product.image : "https://via.placeholder.com/300"}
        alt={product.title} 
        className="w-full h-80 object-cover rounded-md mb-4"
      />
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-gray-600 my-4">{product.description}</p>
      <span className="block bg-gray-200 text-gray-700 px-4 py-2 rounded-md w-fit">
        {product.category}
      </span>
    </div>
  );
}
