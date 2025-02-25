import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [barterOptions, setBarterOptions] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to create a product.");
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/products/`,
        { title, description, category, image, barter_options: barterOptions },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      toast.success("Product Created!");
      navigate("/");
    } catch (error) {
      toast.error("Error creating product.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full p-2 border rounded-md" />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full p-2 border rounded-md" />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full p-2 border rounded-md" />
        <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="block w-full p-2 border rounded-md" />
        <input type="text" placeholder="Barter Options" value={barterOptions} onChange={(e) => setBarterOptions(e.target.value)} className="block w-full p-2 border rounded-md" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create Product</button>
      </form>
    </div>
  );
}
