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
    console.error("Error fetching product:", error.response?.data || error);
    throw error;
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // ✅ Fetch Product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  // ✅ Add to Cart Mutation with Error Handling
  const addToCart = useMutation({
    mutationFn: async () => {
      if (!token) {
        toast.error("Please log in to add items to the cart.");
        return;
      }
      try {
        const response = await axios.post(
          `${API_BASE_URL}/cart/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Cart Response:", response.data);
        toast.success("Added to cart!");
      } catch (error) {
        console.error("Error adding to cart:", error.response?.data || error);
        toast.error(error.response?.data?.detail || "Failed to add to cart.");
      }
    },
  });

  // ✅ Add to Wishlist Mutation with Error Handling
  const addToWishlist = useMutation({
    mutationFn: async () => {
      if (!token) {
        toast.error("Please log in to add items to the wishlist.");
        return;
      }
      try {
        const response = await axios.post(
          `${API_BASE_URL}/wishlist/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Wishlist Response:", response.data);
        toast.success("Added to wishlist!");
      } catch (error) {
        console.error("Error adding to wishlist:", error.response?.data || error);
        toast.error(error.response?.data?.detail || "Failed to add to wishlist.");
      }
    },
  });

  // ✅ Loading State
  if (isLoading) return <p className="text-center text-gray-500">Loading product details...</p>;
  if (error || !product) return <p className="text-center text-red-500">Product not found.</p>;

  return (
    <div className="product-detail-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🖼️ Product Image */}
        <div>
          <img
            src={product.image && product.image !== "string" ? product.image : "https://via.placeholder.com/500"}
            alt={product.title || "Product"}
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

          {/* ✅ Additional Information */}
          <div className="mt-4">
            <p className="text-gray-700">
              <strong>Barter Options:</strong> {product.barter_options || "Not available"}
            </p>
            <p className="text-gray-700">
              <strong>Owner:</strong> {product.owner_id || "Unknown"}
            </p>
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
