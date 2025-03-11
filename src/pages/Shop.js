import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { products } from "../data";
import Product from "../components/product/product";

const Shop = () => {
  const { category } = useParams();
  const [selectedBrand, setSelectedBrand] = React.useState(null);

  // Get unique categories and brands for filters
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];

  // Filter products based on URL category and selected brand
  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      !category || category === "All" || product.category === category;
    const brandMatch = !selectedBrand || product.brand === selectedBrand;
    return categoryMatch && brandMatch;
  });

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
            </div>
            <div className="pr-4">
              <h3 className="font-medium text-xl text-gray-900 mb-3">Brand</h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
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
