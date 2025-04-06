import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { useGetAllProducts } from "../api/products/productsApi";
import Product from "../components/product/product";

const Shop = () => {
  const { category } = useParams();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { data: products, isLoading, error } = useGetAllProducts();

  // Initialize categories and brands
  const [categories, setCategories] = useState(["All"]);
  const [brands, setBrands] = useState([]);

  // Update categories and brands when products data is loaded
  useEffect(() => {
    if (products && products.length > 0) {
      // Extract unique categories and brands
      const uniqueCategories = [
        "All",
        ...new Set(products.map((p) => p.category)),
      ];
      const uniqueBrands = [...new Set(products.map((p) => p.brand))];

      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    }
  }, [products]);

  // Filter products based on URL category and selected brand
  const filteredProducts = products
    ? products.filter((product) => {
        const categoryMatch =
          !category || category === "All" || product.category === category;
        const brandMatch = !selectedBrand || product.brand === selectedBrand;
        return categoryMatch && brandMatch;
      })
    : [];

  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <div className="container mx-auto px-4 my-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-56 md:sticky md:top-40 h-[calc(45vh-80px)] md:h-[calc(100vh-80px)] self-start md:block overflow-y-auto flex flex-row md:flex-col gap-20 md:gap-0">
            <div className="mb-8 pr-4">
              <h3 className="font-medium text-xl text-gray-900 mb-3">
                Category
              </h3>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-5 bg-gray-200 rounded w-24"></div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      className={`text-sm ${
                        category === cat || (!category && cat === "All")
                          ? "text-black font-medium"
                          : "text-gray-600 hover:text-black"
                      } cursor-pointer py-1.5`}
                    >
                      <Link to={`/shop/${cat === "All" ? "All" : cat}`}>
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="pr-4">
              <h3 className="font-medium text-xl text-gray-900 mb-3">Brand</h3>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-5 bg-gray-200 rounded w-20"></div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {brands.map((brand) => (
                    <li
                      key={brand}
                      className={`text-sm ${
                        selectedBrand === brand
                          ? "text-black font-medium"
                          : "text-gray-600 hover:text-black"
                      } cursor-pointer py-1.5`}
                      onClick={() =>
                        setSelectedBrand(selectedBrand === brand ? null : brand)
                      }
                    >
                      {brand}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="py-10">
              <h5 className="text-sm text-gray-500">
                Home / Shop / {category || "All Products"}
              </h5>
              <h2 className="mt-2 text-3xl font-medium tracking-tight text-gray-700">
                {category !== "All" ? category : "All Products"}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-md">
                <p className="text-red-700">
                  Error loading products: {error.message}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No products found in this category
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
