import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchSearchResults = async (query) => {
  const { data } = await axios.get(`${API_BASE_URL}/products/?query=${query}`);
  return data;
};

export default function SearchResults() {
  const { query } = useParams();
  const { data: results = [], isLoading, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => fetchSearchResults(query),
  });

  if (isLoading) return <p>Loading search results...</p>;
  if (error) return <p>Error loading search results.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
