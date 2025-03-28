import React, { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import { products } from "../../../data";

// Custom Delete Confirmation Dialog
const ProductDeleteAlert = ({ onConfirm, productName, productId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleClickOpen}
        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#A0522D]">
                Confirm Deletion
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the product{" "}
              <span className="font-semibold text-[#A0522D]">
                {productName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProductCard = ({ product, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div className="text-sm text-gray-600 mb-2">
          <p>Brand: {product.brand}</p>
          <p>Category: {product.category}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-[#A0522D]">{product.price}</span>
            {product.oldPrice && (
              <span className="line-through text-gray-400 text-sm">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" /> Edit
        </button>

        <ProductDeleteAlert
          productId={product.id}
          productName={product.name}
          onConfirm={() => onDelete(product.id)}
        />
      </div>
    </div>
  );
};

const ProductList = () => {
  const [productList, setProductList] = useState(products);

  const handleDelete = (productId) => {
    setProductList(productList.filter((product) => product.id !== productId));
  };

  const handleEdit = (product) => {
    // Implement edit logic or navigate to edit page
    console.log("Edit product:", product);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default ProductList;
