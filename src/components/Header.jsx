// timeswap-frontend/src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white py-3 px-8 shadow-lg fixed top-0 left-0 right-0 flex justify-between items-center z-50">
      <div className="flex items-center gap-4">
        <img
          src="/TimeSwapLogo.png"
          alt="TimeSwap Logo"
          className="h-16 w-16 object-contain"
          style={{ maxHeight: "80px", maxWidth: "80px" }}
        />
        <h1 className="text-2xl font-semibold tracking-wider">
          Welcome To TimeSwap - The MoneyLess Marketplace
        </h1>
      </div>

      <nav className="flex gap-8 text-lg font-medium">
        <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
        <Link to="/dashboard" className="hover:text-indigo-200 transition-colors">Dashboard</Link>
        <Link to="/wishlist" className="hover:text-indigo-200 transition-colors">Wishlist</Link>
        <Link to="/cart" className="hover:text-indigo-200 transition-colors">Cart</Link>
        <button
          onClick={handleLogout}
          className="text-red-300 hover:text-red-200 transition-colors"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
