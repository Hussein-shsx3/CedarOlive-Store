import React, { useState } from "react";
import { List, PlusCircle, FileText } from "lucide-react";
import AddProductForm from "./products/AddProductForm";
import AllProducts from "./products/AllProducts";
const Products = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Responsive Navigation Tabs */}
      <div className="flex flex-col sm:flex-row mb-6 bg-[#ede5de] rounded-lg overflow-hidden">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center justify-center py-3 px-4 transition-colors ${
            activeTab === "list"
              ? "bg-[#A0522D] text-white"
              : "text-[#8a8888] hover:bg-[#A0522D]/10"
          }`}
        >
          <List className="mr-2 h-5 w-5" />
          <span className="text-sm md:text-base">All Products</span>
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`flex items-center justify-center py-3 px-4 transition-colors ${
            activeTab === "add"
              ? "bg-[#A0522D] text-white"
              : "text-[#8a8888] hover:bg-[#A0522D]/10"
          }`}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          <span className="text-sm md:text-base">Add Product</span>
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={`flex items-center justify-center py-3 px-4 transition-colors ${
            activeTab === "import"
              ? "bg-[#A0522D] text-white"
              : "text-[#8a8888] hover:bg-[#A0522D]/10"
          }`}
        >
          <FileText className="mr-2 h-5 w-5" />
          <span className="text-sm md:text-base">Import Products</span>
        </button>
      </div>

      {activeTab === "list" && <AllProducts />}
      {activeTab === "add" && <AddProductForm />}
      {activeTab === "import" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#A0522D]">
            Import Products
          </h2>
          <p>Functionality for importing products will be implemented here.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
