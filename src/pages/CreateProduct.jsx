import { useState } from "react";
import axios from "axios";

export default function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [barterOptions, setBarterOptions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/products/", {
        title,
        description,
        category,
        image,
        barter_options: barterOptions,
      });
      alert("Product Created!");
    } catch (error) {
      alert("Error creating product");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 border"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full p-2 border"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full p-2 border"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="block w-full p-2 border"
        />
        <input
          type="text"
          placeholder="Barter Options"
          value={barterOptions}
          onChange={(e) => setBarterOptions(e.target.value)}
          className="block w-full p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Create Product
        </button>
      </form>
    </div>
  );
}
