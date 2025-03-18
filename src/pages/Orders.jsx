import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchOrders = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${API_BASE_URL}/orders/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default function Orders() {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <p>No past orders.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded-md bg-gray-100">
              Order #{order.id} - {order.products.length} items
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
