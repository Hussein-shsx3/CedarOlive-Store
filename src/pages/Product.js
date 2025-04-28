import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Explore from "../components/productPage/explore";
import Reviews from "../components/productPage/Reviews";
import { useGetProductById } from "../api/products/productsApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Minus,
  Plus,
  Star,
  ShoppingBag,
  TruckIcon,
  RefreshCw,
} from "lucide-react";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  // Directly fetch the product by ID from the API
  const {
    data: product,
    isLoading: loadingProduct,
    error: productError,
  } = useGetProductById(id);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-16 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-16 flex-grow">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-xl font-medium text-red-600 mb-2">
              Error Loading Product
            </h2>
            <p className="text-red-500">{productError.message}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-16 flex-grow">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-xl font-medium mb-2">Product Not Found</h2>
            <p className="text-gray-500">
              The product you are looking for does not exist or has been
              removed.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images[0],
      quantity,
    };

    dispatch(addToCart(productToAdd));

    toast.success(`${product.name} added to cart successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const calculateDiscountPercentage = () => {
    if (!product.oldPrice) return null;

    const oldPrice = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ""));
    const currentPrice = parseFloat(product.price.replace(/[^0-9.]/g, ""));

    if (isNaN(oldPrice) || isNaN(currentPrice) || oldPrice <= currentPrice) {
      return null;
    }

    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  };

  const discountPercentage = calculateDiscountPercentage();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <section className="container mx-auto px-4 py-8 my-4 flex-grow">
        <div className="text-sm mb-6 text-gray-500 hover:text-gray-700">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          /{" "}
          <a href="/shop" className="hover:underline">
            Shop
          </a>{" "}
          /{" "}
          <a href={`/category/${product.category}`} className="hover:underline">
            {product.category}
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                {discountPercentage && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discountPercentage}%
                  </div>
                )}
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-4"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden ${
                        activeImage === index
                          ? "ring-2 ring-primary ring-offset-2"
                          : "border hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-1 flex items-center">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {product.brand}
                </span>
                {product.availability ? (
                  <span className="inline-block ml-2 text-green-600 text-sm font-medium items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="inline-block ml-2 text-red-600 text-sm font-medium items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={
                        star <= (product.ratingsAverage || 4)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                      size={18}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 text-sm">
                  {product.ratingsAverage || 4.0} (
                  {product.ratingsQuantity || 24} reviews)
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="line-through text-gray-500 ml-3 text-lg">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Description preview */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  {product.shortDescription ||
                    product.description?.substring(0, 150) + "..."}
                </p>
              </div>

              <div className="space-y-6">
                {/* Quantity selector and add to cart */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center">
                    <label className="text-sm font-medium mr-3">
                      Quantity:
                    </label>
                    <div className="flex border rounded-md bg-white">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-2 border-r hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value, 10) || 1)
                        }
                        className="w-16 text-center py-2 focus:outline-none"
                      />
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-2 border-l hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-2">
                    <button
                      className="bg-primary text-black px-6 py-3 rounded-md hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2 font-medium flex-grow"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag size={18} />
                      Add to Bag
                    </button>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <TruckIcon size={16} className="mr-2" />
                    <span className="text-sm">
                      Free shipping on orders over $50
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <RefreshCw size={16} className="mr-2" />
                    <span className="text-sm">30-day return policy</span>
                  </div>
                </div>

                {/* Product meta info */}
                <div className="border-t pt-4 space-y-1">
                  {product.sku && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">SKU:</span> {product.sku}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Category:</span>{" "}
                    <a
                      href={`/category/${product.category}`}
                      className="hover:underline"
                    >
                      {product.category}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === "description"
                    ? "border-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "border-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                }`}
              >
                Reviews
              </button>
              {product.shipping && (
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "shipping"
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                  }`}
                >
                  Shipping & Returns
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === "description" && (
              <div>
                <h2 className="text-xl font-medium mb-4">
                  Product Description
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p>
                    {product.description ||
                      "No description available for this product."}
                  </p>
                </div>

                {product.details && Object.keys(product.details).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Specifications</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.details).map(([key, value]) => (
                          <div
                            key={key}
                            className="border-b border-gray-200 pb-2"
                          >
                            <div className="font-medium text-gray-700">
                              {key}
                            </div>
                            <div className="text-gray-600">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <Reviews productId={product.id} reviews={product.reviews} />
            )}

            {activeTab === "shipping" && (
              <div>
                <h2 className="text-xl font-medium mb-4">Shipping & Returns</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>
                    {product.shipping?.information ||
                      "Standard shipping takes 3-5 business days. We offer free returns within 30 days of purchase."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Explore category={product.category} />
      </section>
      <Footer />
    </div>
  );
};

export default Product;
