import axios from "axios";

const fetchCart = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get("http://127.0.0.1:8000/cart/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default function Cart() {
  const { data: cart, isLoading } = useQuery(["cart"], fetchCart);

  if (isLoading) return <p>Loading cart...</p>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cart.map((item) => (
        <div key={item.id}>{item.product_id}</div>
      ))}
    </div>
  );
}
