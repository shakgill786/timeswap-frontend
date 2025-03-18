import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition">
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold">{product.title}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-bold">${product.price || "N/A"}</p>
      <Link
        to={`/product/${product.id}`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
}
