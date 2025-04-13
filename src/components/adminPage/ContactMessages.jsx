import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  updateContactMessage,
  deleteContactMessage,
  useGetContacts,
} from "../../api/contact/contactApi";
import { resetContactForm } from "../../redux/contactSlice";

const ContactMessages = () => {
  const {
    data: contactMessages,
    isLoading,
    isError,
    refetch,
  } = useGetContacts();
  const dispatch = useDispatch();
  const { isSubmitting, isSuccess, error, message } = useSelector(
    (state) => state.contact
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Reset form status on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetContactForm());
    };
  }, [dispatch]);

  // Reset success state after status update
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetContactForm());
        refetch(); // Refetch data after successful update
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch, refetch]);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      dispatch(
        updateContactMessage({
          id,
          contactData: { status: newStatus },
        })
      );

      // Update selected message status if it's the one being modified
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (id) => {
    try {
      dispatch(deleteContactMessage(id));
      setIsDeleteModalOpen(false);
      setMessageToDelete(null);

      // Close message detail modal if the deleted message was selected
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (e, message) => {
    e.stopPropagation();
    setMessageToDelete(message);
    setIsDeleteModalOpen(true);
  };

  // Filter and sort messages
  const filteredMessages = contactMessages
    ? contactMessages
        .filter((message) => {
          const matchesSearch =
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesFilter =
            filterStatus === "All" || message.status === filterStatus;

          return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
          // Sort based on selected column
          let comparison = 0;
          if (sortColumn === "date") {
            comparison = new Date(a.createdAt) - new Date(b.createdAt);
          } else if (sortColumn === "name") {
            comparison = a.name.localeCompare(b.name);
          } else if (sortColumn === "email") {
            comparison = a.email.localeCompare(b.email);
          } else if (sortColumn === "status") {
            comparison = a.status.localeCompare(b.status);
          }

          return sortDirection === "asc" ? comparison : -comparison;
        })
    : [];

  const toggleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#A0522D]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Error loading messages. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full py-5">
      {/* Success notification */}
      <AnimatePresence>
        {isSuccess && message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50 flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md z-50 flex items-center"
          >
            <X className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#131313]">Contact Messages</h1>
        <p className="text-[#8a8888]">View and manage customer inquiries</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-[#e2e8f0] mb-6">
        <div className="p-4 border-b border-[#e2e8f0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#A0522D]/30"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8a8888]" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-lg bg-[#f7f3f3] text-[#131313] hover:bg-[#ede5de] transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter: {filterStatus}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white border border-[#e2e8f0] rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={() => {
                      setFilterStatus("All");
                      setFilterOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-[#131313] hover:bg-[#ede5de]"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("Pending");
                      setFilterOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-[#131313] hover:bg-[#ede5de]"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("Resolved");
                      setFilterOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-[#131313] hover:bg-[#ede5de]"
                  >
                    Resolved
                  </button>
                </motion.div>
              )}
            </div>

            <button
              onClick={() => refetch()}
              className={`p-2 border border-[#e2e8f0] rounded-lg bg-[#f7f3f3] text-[#131313] hover:bg-[#ede5de] transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh"
              disabled={isSubmitting}
            >
              <RefreshCw
                className={`w-4 h-4 ${isSubmitting ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f3f3] text-[#131313]">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center font-semibold"
                  >
                    Name {getSortIcon("name")}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort("email")}
                    className="flex items-center font-semibold"
                  >
                    Email {getSortIcon("email")}
                  </button>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  Message
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort("date")}
                    className="flex items-center font-semibold"
                  >
                    Date {getSortIcon("date")}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort("status")}
                    className="flex items-center font-semibold"
                  >
                    Status {getSortIcon("status")}
                  </button>
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-[#8a8888]"
                  >
                    No messages found
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message) => (
                  <tr
                    key={message._id}
                    className="border-t border-[#e2e8f0] hover:bg-[#f7f3f3] cursor-pointer transition-colors"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <td className="px-4 py-3">{message.name}</td>
                    <td className="px-4 py-3">{message.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="max-w-xs truncate">{message.message}</div>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          message.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {message.status === "Pending" ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {message.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(
                              message._id,
                              message.status === "Pending"
                                ? "Resolved"
                                : "Pending"
                            );
                          }}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            message.status === "Pending"
                              ? "bg-[#A0522D] text-white hover:bg-[#8B4513]"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          } ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isSubmitting}
                        >
                          {message.status === "Pending" ? "Resolve" : "Pending"}
                        </button>
                        <button
                          onClick={(e) => openDeleteModal(e, message)}
                          className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message detail modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
            >
              <div className="p-4 border-b border-[#e2e8f0] flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#131313]">
                  Message Details
                </h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-[#6b7280] hover:text-[#A0522D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between mb-6">
                  <div>
                    <p className="text-sm text-[#8a8888]">From:</p>
                    <p className="font-medium text-[#131313]">
                      {selectedMessage.name}
                    </p>
                    <p className="text-[#3e3d3d]">{selectedMessage.email}</p>
                  </div>

                  <div className="mt-4 sm:mt-0 text-sm sm:text-right">
                    <p className="text-[#8a8888]">Received:</p>
                    <p className="text-[#131313]">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                    <div className="flex items-center gap-2 mt-2 sm:justify-end">
                      <span className="text-[#8a8888]">Status:</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedMessage.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedMessage.status === "Pending" ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {selectedMessage.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f7f3f3] p-4 rounded-lg mb-6">
                  <p className="text-sm text-[#8a8888] mb-2">Message:</p>
                  <p className="text-[#131313] whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      openDeleteModal(
                        { stopPropagation: () => {} },
                        selectedMessage
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-[#131313] hover:bg-[#f7f3f3]"
                  >
                    Close
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedMessage._id,
                        selectedMessage.status === "Pending"
                          ? "Resolved"
                          : "Pending"
                      )
                    }
                    className={`px-4 py-2 rounded-lg ${
                      selectedMessage.status === "Pending"
                        ? "bg-[#A0522D] text-white hover:bg-[#8B4513]"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </span>
                    ) : selectedMessage.status === "Pending" ? (
                      "Mark as Resolved"
                    ) : (
                      "Mark as Pending"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {isDeleteModalOpen && messageToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-4 border-b border-[#e2e8f0] flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Delete Confirmation</h3>
              </div>

              <div className="p-6">
                <p className="mb-4">
                  Are you sure you want to delete this message from{" "}
                  <span className="font-medium">{messageToDelete.name}</span>?
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setMessageToDelete(null);
                    }}
                    className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-[#131313] hover:bg-[#f7f3f3]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(messageToDelete._id)}
                    className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactMessages;
