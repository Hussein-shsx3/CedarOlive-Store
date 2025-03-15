import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // Import Redux action
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Explore from "../components/productPage/explore";
import ScrollToTop from "../components/scrollToTop";
import { products } from "../data";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const [product, setProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastAnimation, setToastAnimation] = useState("slide-in");

  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = products.find((p) => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate("/shop");
    }
  }, [id, navigate]);

  // Effect to handle toast animation and timing
  useEffect(() => {
    if (showToast) {
      // Set timer to start exit animation
      const exitTimer = setTimeout(() => {
        setToastAnimation("slide-out");
      }, 2500);

      // Set timer to hide toast after animation completes
      const hideTimer = setTimeout(() => {
        setShowToast(false);
        setToastAnimation("slide-in"); // Reset animation for next time
      }, 3000);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showToast]);

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Header />
        <div className="container mx-auto px-6 py-4">Loading...</div>
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
    dispatch(addToCart(productToAdd)); // Dispatch action to add product to cart
    setToastAnimation("slide-in"); // Ensure animation starts from beginning
    setShowToast(true); // Show toast notification
  };

  return (
    <div className="flex flex-col justify-center items-center relative">
      <ScrollToTop />
      <Header />

      {/* Toast notification with animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .slide-in {
          animation: slideIn 0.3s ease forwards;
        }

        .slide-out {
          animation: slideOut 0.3s ease forwards;
        }

        .toast-shadow {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      {showToast && (
        <div
          className={`fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded z-50 flex items-center toast-shadow ${toastAnimation}`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{product.name} added to cart successfully!</span>
        </div>
      )}

      <section className="container mx-auto px-6 py-4 my-10">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-16">
          <div className="md:col-span-5">
            <img
              src={product.image}
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
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
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
        <Explore category={product.category} />
      </section>
      <Footer />
    </div>
  );
};

export default Product;
