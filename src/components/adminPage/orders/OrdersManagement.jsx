import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../../../api/order/orderApi";

// Status badge component for order status
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800";
      case "packed":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "deleviered":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};

const OrdersManagement = () => {
  const dispatch = useDispatch();

  // React Query v5 syntax
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
  console.log(orders);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    orderStatus: "",
    isDelivered: false,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  React.useEffect(() => {
    if (selectedOrder) {
      setEditForm({
        orderStatus: selectedOrder.orderStatus,
        isDelivered: selectedOrder.isDelivered,
      });
    }
  }, [selectedOrder]);

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      await dispatch(
        updateOrder({
          orderId: selectedOrder._id,
          updateData: {
            orderStatus: editForm.orderStatus,
            isDelivered: editForm.isDelivered,
            deliveredAt: editForm.isDelivered ? new Date() : null,
          },
        })
      ).unwrap();

      refetch(); // Refresh orders after update
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await dispatch(deleteOrder(orderToDelete._id)).unwrap();
      refetch(); // Refresh orders after deletion
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  // Filter orders based on search term
  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (order) =>
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderStatus?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Format date function (to replace date-fns)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load orders.</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>

      {/* Search and filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by customer name, email, order ID or status..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {order._id.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.user?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.email || "N/A"}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {order.paymentMethod}
                    </span>
                    <div className="text-xs text-gray-500">
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstOrder + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastOrder, filteredOrders.length)}
            </span>{" "}
            of <span className="font-medium">{filteredOrders.length}</span>{" "}
            orders
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Order</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Order ID: {selectedOrder._id}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Customer: {selectedOrder.user?.name}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  name="orderStatus"
                  value={editForm.orderStatus}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="placed">Placed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="deleviered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isDelivered"
                  name="isDelivered"
                  checked={editForm.isDelivered}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isDelivered"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Mark as Delivered
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete order #
              {orderToDelete._id.substring(0, 8)}... for{" "}
              {orderToDelete.user?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
