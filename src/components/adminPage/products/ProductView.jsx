import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetProductById,
  updateProductById,
  deleteProductById,
} from "../../../api/products/productsApi";
import {
  ChevronLeft,
  Trash2,
  Edit2,
  Save,
  X,
  Camera,
  Star,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Added refetch trigger state
  const [, setRefetchTrigger] = useState(0);

  // Pass refetch trigger to the query to force refresh
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductById(productId, { refetchOnMountOrArgChange: true });

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: 0,
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize form data when product loads
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price || 0,
        images: product.images || [],
      });
    }
  }, [product]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.brand.trim()) errors.brand = "Brand is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (formData.price <= 0) errors.price = "Price must be greater than 0";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save product changes
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for image upload
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("brand", formData.brand);
      productData.append("category", formData.category);
      productData.append("description", formData.description);
      productData.append("price", formData.price);

      // Append any new images
      newImages.forEach((img) => {
        productData.append("images", img);
      });

      // If we're keeping existing images, include them
      formData.images.forEach((img) => {
        productData.append("existingImages", img);
      });

      const resultAction = await dispatch(
        updateProductById({
          productId,
          productData,
        })
      );

      if (updateProductById.fulfilled.match(resultAction)) {
        setIsEditing(false);
        setNewImages([]);
        setImagePreview([]);
        toast.success("Product updated successfully!");

        // Explicitly force a refetch of product data
        await refetch();

        // Update refetch trigger to cause a re-render
        setRefetchTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    try {
      const resultAction = await dispatch(deleteProductById(productId));
      if (deleteProductById.fulfilled.match(resultAction)) {
        toast.success("Product deleted successfully!");
        navigate("/admin/products");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  // Handle removing an existing image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle removing a new image from preview
  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            fill={index < Math.floor(rating) ? "#FFD700" : "none"}
            stroke={index < Math.floor(rating) ? "#FFD700" : "#D1D5DB"}
            size={16}
            className={
              index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-sm text-gray-700">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <button
            className="mr-3 p-2 hover:bg-gray-100 rounded-full"
            onClick={() => navigate("/admin/products")}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-[#A0522D]">Loading Product</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skeleton for product images */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-300 rounded-md animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton for product details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-4 w-40 bg-gray-300 rounded animate-pulse mb-6"></div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <button
            className="mr-3 p-2 hover:bg-gray-100 rounded-full"
            onClick={() => navigate("/admin/products")}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
        </div>
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-700">Error loading product: {error.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If product data hasn't loaded yet
  if (!product) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            className="mr-3 p-2 hover:bg-gray-100 rounded-full"
            onClick={() => navigate("/admin/products")}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#A0522D]">
              {isEditing ? "Edit Product" : "Product Details"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Make changes to your product"
                : "View product information"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                className="px-4 py-2 flex items-center gap-1 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data to original values when canceling
                  if (product) {
                    setFormData({
                      name: product.name || "",
                      brand: product.brand || "",
                      category: product.category || "",
                      description: product.description || "",
                      price: product.price || 0,
                      images: product.images || [],
                    });
                  }
                  setNewImages([]);
                  setImagePreview([]);
                }}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                className="px-4 py-2 flex items-center gap-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 flex items-center gap-1 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                <Trash2 className="h-4 w-4 text-red-600" /> Delete
              </button>
              <button
                className="px-4 py-2 flex items-center gap-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-700">Product Images</h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Existing images */}
              {isEditing ? (
                /* Editable image gallery */
                <>
                  {formData.images.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* New image previews */}
                  {imagePreview.map((preview, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`New Upload ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <Camera className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">Add Images</span>
                  </label>
                </>
              ) : /* View-only image gallery */
              product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-md overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>
          </div>

          {/* Ratings section (view only) */}
          {!isEditing && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-700">Ratings</h3>
              <div className="flex items-center mb-1">
                {renderStars(product.ratingsAverage || 0)}
              </div>
              <p className="text-sm text-gray-600">
                {product.ratingsQuantity || 0} customer reviews
              </p>
            </div>
          )}
        </div>

        {/* Product Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 text-gray-700">
              Product Information
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md focus:ring-[#A0522D] focus:border-[#A0522D] outline-none ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-800 font-medium">{product.name}</p>
                )}
              </div>

              {/* Brand & Category (side by side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-[#A0522D] focus:border-[#A0522D] outline-none ${
                          validationErrors.brand
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {validationErrors.brand && (
                        <p className="mt-1 text-sm text-red-500">
                          {validationErrors.brand}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-800">{product.brand}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-[#A0522D] focus:border-[#A0522D] outline-none ${
                          validationErrors.category
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {validationErrors.category && (
                        <p className="mt-1 text-sm text-red-500">
                          {validationErrors.category}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                {isEditing ? (
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-full p-2 pl-6 border rounded-md focus:ring-[#A0522D] focus:border-[#A0522D] outline-none ${
                          validationErrors.price
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {validationErrors.price && (
                      <p className="mt-1 text-sm text-red-500">
                        {validationErrors.price}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-800 font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full p-2 border rounded-md focus:ring-[#A0522D] focus:border-[#A0522D] outline-none ${
                        validationErrors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    ></textarea>
                    {validationErrors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {validationErrors.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Confirm Deletion
            </h3>
            <div className="flex items-center gap-4 mb-4">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-16 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-500 text-xs">No image</span>
                </div>
              )}
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.brand} · {product.category}
                </p>
              </div>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
