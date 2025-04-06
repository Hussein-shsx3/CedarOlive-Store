import React, { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../api/products/productsApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProductForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    description: "",
    images: [],
  });

  // When file input changes, add the new images to the existing list.
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      const filesArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || "" : value,
      }));
    }
  };

  // Remove a specific image by its index.
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object for supporting file upload.
    const productData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images" && formData[key].length > 0) {
        formData[key].forEach((image) => {
          productData.append("images", image);
        });
      } else {
        productData.append(key, formData[key]);
      }
    });

    try {
      const resultAction = await dispatch(createProduct(productData));
      if (createProduct.fulfilled.match(resultAction)) {
        toast.success("Product added successfully!");
        resetForm();
      } else {
        toast.error(resultAction.payload || "Failed to add product");
      }
    } catch (err) {
      toast.error("Error adding product");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      price: "",
      category: "",
      description: "",
      images: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
    >
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-[#A0522D] flex items-center">
        <Plus className="w-6 h-6 mr-2" /> Add New Product
      </h2>

      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Product Images
          </div>
          <div className="mt-1 flex flex-wrap gap-4">
            {formData.images.map((image, index) => {
              const url = URL.createObjectURL(image);
              return (
                <div key={index} className="relative h-32 w-32">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              );
            })}
            {/* Always show an "add image" tile */}
            <div className="flex items-center justify-center h-32 w-32 border-2 border-dashed rounded-md bg-white">
              <label
                htmlFor="multi-image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Add images</span>
                <input
                  id="multi-image-upload"
                  name="images"
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  accept="image/*"
                  multiple
                />
              </label>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D]"
            placeholder="Enter product name"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand*
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D]"
            placeholder="Enter brand name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price*
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D]"
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category*
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D]"
            required
          >
            <option value="">Select category</option>
            <option value="Lighting">Lighting</option>
            <option value="Decor">Decor</option>
            <option value="Living Room">Living Room</option>
            <option value="Vases">Vases</option>
            <option value="Wall Art">Wall Art</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D]"
          placeholder="Enter product description"
          required
        ></textarea>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          onClick={resetForm}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#A0522D] text-white py-3 rounded-md hover:bg-[#8B4513] transition-colors"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
    </form>
  );
};

export default AddProductForm;
