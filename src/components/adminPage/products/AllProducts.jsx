import React from "react";
import {
  useGetAllProducts,
  deleteProductById,
} from "../../../api/products/productsApi";
import { useDispatch } from "react-redux";
import { Trash2, Eye } from "lucide-react";

const AllProducts = () => {
  const { data: products, isLoading, error } = useGetAllProducts();
  const dispatch = useDispatch();

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProductById(productId));
    }
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#A0522D]">All Products</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product._id} className="border">
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.brand}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2 flex gap-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => console.log("View Product", product._id)}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(product._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProducts;
