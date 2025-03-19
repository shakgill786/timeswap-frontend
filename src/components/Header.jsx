import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Header() {
  console.log("🔵 Header component is rendering!");

  useEffect(() => {
    console.log("✅ Header mounted in the DOM!");
  }, []);

  const logoPath = "/TimeSwapLogo.png";
  console.log("🖼️ Logo Path:", logoPath);

  return (
    <header className="bg-blue-800 text-white py-4 px-6 shadow-md fixed top-0 w-full flex justify-between items-center z-50">
      {/* Debugging Borders */}
      <div className="flex items-center gap-3 border-2 border-red-500 p-2">
        <p className="text-white bg-red-600 p-2">TEST HEADER</p>
        <img 
          src={logoPath} 
          alt="TimeSwap Logo" 
          className="h-14 w-auto object-contain bg-yellow-400"
        />
        <h1 className="text-2xl font-bold tracking-wide">TimeSwap - The Moneyless Marketplace</h1>
      </div>

      <nav className="flex gap-6 text-lg">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/wishlist" className="hover:underline">Wishlist</Link>
        <Link to="/cart" className="hover:underline">Cart</Link>
        <button 
          onClick={() => {
            localStorage.removeItem("token"); 
            window.location.href = "/auth";
          }} 
          className="text-red-300 hover:underline"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
