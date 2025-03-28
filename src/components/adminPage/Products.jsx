import React, { useState } from "react";
import { List, PlusCircle, FileText } from "lucide-react";
import ProductList from "./products/ProductDeleteAlert";
import AddProductForm from "./products/AddProductForm";

const Products = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-6 bg-[#ede5de] rounded-lg">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 flex items-center justify-center py-3 transition-colors ${
            activeTab === "list"
              ? "bg-[#A0522D] text-white"
              : "text-[#8a8888] hover:bg-[#A0522D]/10"
          }`}
        >
          <List className="mr-2" /> All Products
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 flex items-center justify-center py-3 transition-colors ${
            activeTab === "add"
              ? "bg-[#A0522D] text-white"
              : "text-[#8a8888] hover:bg-[#A0522D]/10"
          }`}
        >
          <PlusCircle className="mr-2" /> Add Product
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={`flex-1 flex items-center justify-center py-3 transition-colors ${
            activeTab === "import"
              ? "bg-[#A0522D] text-white"
              : "text-[#8a8888] hover:bg-[#A0522D]/10"
          }`}
        >
          <FileText className="mr-2" /> Import Products
        </button>
      </div>

      {activeTab === "list" && <ProductList />}
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
