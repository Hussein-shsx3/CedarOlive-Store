import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Explore from "../components/productPage/explore";
import ScrollToTop from "../components/scrollToTop";
import { products } from "../data";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = products.find((p) => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate("/shop");
    }
  }, [id, navigate]);

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
    dispatch(addToCart(productToAdd));

    // Show toast notification
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
