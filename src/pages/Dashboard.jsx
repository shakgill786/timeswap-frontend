import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
        const userResponse = await axios.get("http://127.0.0.1:8000/auth/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = userResponse.data.id;

        const productsResponse = await axios.get(`http://127.0.0.1:8000/products/`);
        const wishlistResponse = await axios.get(`http://127.0.0.1:8000/wishlist/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartResponse = await axios.get(`http://127.0.0.1:8000/cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(productsResponse.data.filter((p) => p.owner_id === userId));
        setWishlist(wishlistResponse.data);
        setCart(cartResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Your Dashboard</h1>

      {/* My Products */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">My Products</h2>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="border p-2 rounded-md">{product.title}</li>
          ))}
        </ul>
      </section>

      {/* Wishlist */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Wishlist</h2>
        <ul className="space-y-2">
          {wishlist.map((item) => (
            <li key={item.id} className="border p-2 rounded-md">{item.product_id}</li>
          ))}
        </ul>
      </section>

      {/* Shopping Cart */}
      <section>
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <ul className="space-y-2">
          {cart.map((item) => (
            <li key={item.id} className="border p-2 rounded-md">{item.product_id}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
