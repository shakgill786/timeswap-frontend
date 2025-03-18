import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data);
        const userId = userResponse.data.id;

        const productsResponse = await axios.get(`${API_BASE_URL}/products/`);
        setProducts(productsResponse.data.filter((p) => p.owner_id === userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  // ✅ Add to Cart Mutation with Error Handling
  const addToCart = useMutation({
    mutationFn: async (productId) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/cart/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Added to cart!");
        queryClient.invalidateQueries(["cart"]); // ✅ Instantly updates cart UI
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (error.response?.status === 400) {
          toast.error("Item is already in the cart.");
        } else {
          toast.error(error.response?.data?.detail || "Failed to add to cart.");
        }
      }
    },
  });

  // ✅ Add to Wishlist Mutation
  const addToWishlist = useMutation({
    mutationFn: async (productId) => {
      try {
        await axios.post(`${API_BASE_URL}/wishlist/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Added to wishlist!");
        queryClient.invalidateQueries(["wishlist"]); // ✅ Instantly updates wishlist UI
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error(error.response?.data?.detail || "Failed to add to wishlist.");
      }
    },
  });

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Navigation Links */}
      <div className="flex justify-between mb-6">
        <Link to="/create-product" className="bg-green-500 text-white px-4 py-2 rounded-md">+ Add Product</Link>
        <Link to="/orders" className="bg-blue-500 text-white px-4 py-2 rounded-md">View Orders</Link>
        <Link to="/wishlist" className="bg-pink-500 text-white px-4 py-2 rounded-md">Wishlist</Link>
        <Link to="/cart" className="bg-yellow-500 text-white px-4 py-2 rounded-md">Shopping Cart</Link>
      </div>

      {/* My Products */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">My Products</h2>
        <ul className="space-y-2">
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id} className="border p-3 rounded-md bg-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{product.title}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline">
                    Manage
                  </Link>
                  <button 
                    onClick={() => addToCart.mutate(product.id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition"
                  >
                    Add to Cart 🛒
                  </button>
                  <button 
                    onClick={() => addToWishlist.mutate(product.id)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition"
                  >
                    Add to Wishlist ❤️
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No products yet.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
