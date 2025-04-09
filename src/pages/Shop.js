import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { useGetAllProducts } from "../api/products/productsApi";
import Product from "../components/product/product";

const Shop = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const PRODUCTS_PER_PAGE = 12;

  // Create query parameters for API
  const queryParams = {
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
  };

  if (category && category !== "All") {
    queryParams.category = category;
  }
  if (selectedBrand) {
    queryParams.brand = selectedBrand;
  }

  // Use queryParams in the API call
  const { data, isLoading, error } = useGetAllProducts(queryParams);

  // Extract products and pagination info
  const products = data?.products || [];
  const totalProducts = data?.totalResults || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // State for categories and brands
  const [categories, setCategories] = useState(["All"]);
  const [brands, setBrands] = useState([]);

  // Fetch all categories and brands only once when component mounts
  const { data: allProductsData } = useGetAllProducts({ limit: 1000 });

  // Use useMemo to prevent allProducts from being recreated on every render
  const allProducts = useMemo(() => {
    return allProductsData?.products || [];
  }, [allProductsData]);

  // Extract categories and brands from all products
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Extract unique categories and brands
      const uniqueCategories = [
        "All",
        ...new Set(allProducts.map((p) => p.category)),
      ];
      const uniqueBrands = [...new Set(allProducts.map((p) => p.brand))];

      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    }
  }, [allProducts]);

  // Handle brand selection
  const handleBrandSelect = (brand) => {
    const newBrand = selectedBrand === brand ? null : brand;
    setSelectedBrand(newBrand);
    setCurrentPage(1); // Reset to first page when changing filters

    // Update URL search params
    if (newBrand) {
      searchParams.set("brand", newBrand);
    } else {
      searchParams.delete("brand");
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);

    // Scroll to top of products when changing page
    window.scrollTo({
      top: document.querySelector("main").offsetTop - 20,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <div className="container mx-auto px-4 my-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-56 md:sticky md:top-35 h-[calc(45vh-80px)] md:h-[calc(100vh-80px)] self-start md:block overflow-y-auto flex flex-row md:flex-col gap-20 md:gap-0">
            <div className="mb-8 pr-4">
              <h3 className="font-medium text-xl text-gray-900 mb-3">
                Category
              </h3>
              {isLoading && !allProducts.length ? (
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
                      <Link
                        to={`/shop/${cat === "All" ? "All" : cat}${
                          selectedBrand ? `?brand=${selectedBrand}` : ""
                        }`}
                        onClick={() => setCurrentPage(1)}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="pr-4">
              <h3 className="font-medium text-xl text-gray-900 mb-3">Brand</h3>
              {isLoading && !allProducts.length ? (
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
                      onClick={() => handleBrandSelect(brand)}
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
                {selectedBrand && ` / ${selectedBrand}`}
              </h5>
              <h2 className="mt-2 text-3xl font-medium tracking-tight text-gray-700">
                {category !== "All" ? category : "All Products"}
                {selectedBrand && ` - ${selectedBrand}`}
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <Product key={product._id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 text-gray-500">
                      No products found with the selected filters
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Previous
                      </button>

                      {/* First page */}
                      {currentPage > 3 && (
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-1 rounded-md hover:bg-gray-100"
                        >
                          1
                        </button>
                      )}

                      {/* Ellipsis if needed */}
                      {currentPage > 4 && (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      )}

                      {/* Page numbers */}
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          // Calculate the start page number
                          let startPage;
                          if (currentPage <= 3) {
                            startPage = 1;
                          } else if (currentPage >= totalPages - 2) {
                            startPage = Math.max(1, totalPages - 4);
                          } else {
                            startPage = currentPage - 2;
                          }

                          const pageNumber = startPage + i;

                          // Only show if page number is valid
                          if (pageNumber <= 0 || pageNumber > totalPages) {
                            return null;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === pageNumber
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                      )}

                      {/* Ellipsis if needed */}
                      {currentPage < totalPages - 3 && (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-1 rounded-md hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}

                {/* Products count summary */}
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Showing{" "}
                  {Math.min(
                    (currentPage - 1) * PRODUCTS_PER_PAGE + 1,
                    totalProducts
                  )}{" "}
                  to {Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)}{" "}
                  of {totalProducts} products
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
