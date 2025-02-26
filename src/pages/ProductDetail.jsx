import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ProductDetail.css"; // ✅ Import CSS

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch product details
const fetchProduct = async (id) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/products/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export default function ProductDetail() {
  const { id } = useParams();

  // ✅ UseQuery for fetching product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  // ✅ Add to Cart Mutation
  const addToCart = useMutation(async () => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_BASE_URL}/cart/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Added to cart!");
  });

  // ✅ Add to Wishlist Mutation
  const addToWishlist = useMutation(async () => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_BASE_URL}/wishlist/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Added to wishlist!");
  });

  // ✅ Loading State with a Spinner
  if (isLoading) return (
    <div className="text-center py-6">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
      <p className="text-gray-500 mt-3">Loading product details...</p>
    </div>
  );

  // ✅ Error Handling
  if (error || !product) return (
    <div className="text-center py-6">
      <p className="text-red-500 font-semibold text-lg">Product not found.</p>
    </div>
  );

  return (
    <div className="product-detail-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🖼️ Product Image */}
        <div>
          <img
            src={product.image !== "string" ? product.image : "https://via.placeholder.com/500"}
            alt={product.title}
            className="product-image"
          />
        </div>

        {/* 📄 Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="product-title">{product.title}</h1>
            <p className="product-description">{product.description}</p>
            <span className="product-category">{product.category}</span>
          </div>

          {/* 🛒 Buttons */}
          <div className="product-buttons">
            <button onClick={() => addToCart.mutate()} className="add-to-cart">
              Add to Cart 🛒
            </button>
            <button onClick={() => addToWishlist.mutate()} className="add-to-wishlist">
              Add to Wishlist ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
