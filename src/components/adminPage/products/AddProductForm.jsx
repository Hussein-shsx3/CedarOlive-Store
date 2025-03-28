import React, { useState } from "react";
import { Plus } from "lucide-react";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement add product logic
    console.log("Add product:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#A0522D]">
        Add New Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
            required
          >
            <option value="">Select Category</option>
            <option value="Wall Art">Wall Art</option>
            <option value="Vases">Vases</option>
            <option value="Living Room">Living Room</option>
            <option value="Decor">Decor</option>
            <option value="Lighting">Lighting</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#A0522D]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#A0522D] hover:file:bg-[#A0522D]/20"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-[#A0522D] text-white py-3 rounded-md hover:bg-[#8B4513] transition-colors"
        >
          <Plus className="inline-block mr-2" /> Add Product
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
