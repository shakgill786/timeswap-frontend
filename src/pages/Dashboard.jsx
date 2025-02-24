import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  // ✅ Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchUserData = async () => {
      try {
        // ✅ Fetch User Details
        const userResponse = await axios.get(`${API_BASE_URL}/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data);
        const userId = userResponse.data.id;

        // ✅ Fetch User's Products, Wishlist, and Cart
        const [productsResponse, wishlistResponse, cartResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/`),
          axios.get(`${API_BASE_URL}/wishlist/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/cart/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setProducts(productsResponse.data.filter((p) => p.owner_id === userId));
        setWishlist(wishlistResponse.data);
        setCart(cartResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* My Products */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">My Products</h2>
        <ul className="space-y-2">
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id} className="border p-3 rounded-md bg-gray-100">
                {product.title}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No products yet.</p>
          )}
        </ul>
      </section>

      {/* Wishlist */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Wishlist</h2>
        <ul className="space-y-2">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <li key={item.id} className="border p-3 rounded-md bg-gray-100">
                Product ID: {item.product_id}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Your wishlist is empty.</p>
          )}
        </ul>
      </section>

      {/* Shopping Cart */}
      <section>
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <ul className="space-y-2">
          {cart.length > 0 ? (
            cart.map((item) => (
              <li key={item.id} className="border p-3 rounded-md bg-gray-100">
                Product ID: {item.product_id}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
