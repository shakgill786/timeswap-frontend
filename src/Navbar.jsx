import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">TimeSwap</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        {token && <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>}
        {token && <Link to="/wishlist" className="hover:text-gray-300">Wishlist</Link>}
        {token && <Link to="/cart" className="hover:text-gray-300">Cart</Link>}
        {token ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md">
            Logout
          </button>
        ) : (
          <Link to="/auth" className="bg-blue-500 px-4 py-2 rounded-md">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
