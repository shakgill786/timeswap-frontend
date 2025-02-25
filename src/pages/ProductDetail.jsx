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

  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <img 
        src={product.image !== "string" ? product.image : "https://via.placeholder.com/150"} 
        alt={product.title} 
        className="w-full h-60 object-cover rounded-md mb-4" 
      />
    </div>
  );
}
