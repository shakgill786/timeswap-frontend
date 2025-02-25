import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

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

      <div className="flex justify-center mb-6">
        <Link to="/create-product" className="bg-green-500 text-white px-4 py-2 rounded-md">
          + Add Product
        </Link>
      </div>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">My Products</h2>
        <ul className="space-y-2">
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id} className="border p-3 rounded-md bg-gray-100 flex justify-between">
                {product.title}
                <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline">
                  Manage
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No products yet.</p>
          )}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Wishlist</h2>
        <p className="text-gray-500">{wishlist.length === 0 ? "Your wishlist is empty." : `${wishlist.length} items saved.`}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <p className="text-gray-500">{cart.length === 0 ? "Your cart is empty." : `${cart.length} items in cart.`}</p>
      </section>
    </div>
  );
}
