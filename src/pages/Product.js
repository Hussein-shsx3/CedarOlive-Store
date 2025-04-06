import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Explore from "../components/productPage/explore";
import Reviews from "../components/productPage/Reviews";
import ScrollToTop from "../components/scrollToTop";
import { useGetProductById } from "../api/products/productsApi"; // Updated hook
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Directly fetch the product by ID from the API.
  const {
    data: product,
    isLoading: loadingProduct,
    error: productError,
  } = useGetProductById(id);

  if (loadingProduct) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Header />
        <div className="container mx-auto px-6 py-4">Loading product...</div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Header />
        <div className="container mx-auto px-6 py-4">
          Error loading product: {productError.message}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Header />
        <div className="container mx-auto px-6 py-4">Product not found.</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
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

  return (
    <div className="flex flex-col justify-center items-center relative">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ScrollToTop />
      <Header />

      <section className="container mx-auto px-6 py-4 my-10">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-16">
          <div className="md:col-span-5">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="md:col-span-4">
            <div className="text-sm mb-6">
              <span className="text-gray-500">Shop</span> /{" "}
              <span className="text-gray-500">{product.category}</span>
            </div>
            <h1 className="text-3xl font-medium mb-1">{product.name}</h1>
            <div className="text-gray-500 uppercase mb-4">{product.brand}</div>
            <div className="text-xl font-semibold mb-6">
              {product.price}
              {product.oldPrice && (
                <span className="line-through text-gray-500 ml-2 text-sm">
                  {product.oldPrice}
                </span>
              )}
            </div>
            <hr />
            <div className="my-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium mb-2">Quantity:</div>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(parseInt(e.target.value, 10) || 1)
                    }
                    className="border px-2 py-2 w-16"
                  />
                </div>
                <button
                  className="bg-primary text-black px-6 py-4 hover:bg-gray-200"
                  onClick={handleAddToCart}
                >
                  Add to Bag
                </button>
              </div>
            </div>
            <hr />
          </div>
        </div>

        {/* Product Tabs Navigation */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 ${
                  activeTab === "description"
                    ? "border-b-2 border-black font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 ${
                  activeTab === "reviews"
                    ? "border-b-2 border-black font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === "description" && (
              <div>
                <h2 className="text-xl font-medium mb-4">
                  Product Description
                </h2>
                <p className="text-gray-700">
                  {product.description ||
                    "No description available for this product."}
                </p>

                {product.details && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Specifications</h3>
                    <ul className="list-disc pl-5">
                      {Object.entries(product.details).map(([key, value]) => (
                        <li key={key} className="mb-1">
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && <Reviews productId={product.id} />}
          </div>
        </div>
        <Explore category={product.category} />
      </section>
      <Footer />
    </div>
  );
};

export default Product;
