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

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...files], // Store file objects for upload
      }));

      // Create image preview of the first file
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || "" : value,
      }));
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      images: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object for multipart/form-data (for image upload)
    const productData = new FormData();

    // Append all form fields to FormData
    Object.keys(formData).forEach((key) => {
      if (key === "images" && formData[key].length) {
        // Append each image file
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
    setImagePreview(null);
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

          {!imagePreview ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#A0522D] hover:text-[#8B4513] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#A0522D]"
                  >
                    <span>Upload images</span>
                    <input
                      id="image-upload"
                      name="images"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/*"
                      multiple
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <div className="relative h-48 overflow-hidden rounded-md">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                {formData.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    +{formData.images.length - 1} more
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={clearImagePreview}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}
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
            className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/20 transition-colors"
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
            className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/20 transition-colors"
            placeholder="Enter brand name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="block w-full pl-7 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/20 transition-colors"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category*
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/20 transition-colors"
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
          className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/20 transition-colors"
          placeholder="Enter product description"
          required
        ></textarea>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          onClick={resetForm}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#A0522D] text-white py-3 rounded-md hover:bg-[#8B4513] transition-colors flex items-center justify-center disabled:bg-opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Adding...</span>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" /> Add Product
            </>
          )}
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
