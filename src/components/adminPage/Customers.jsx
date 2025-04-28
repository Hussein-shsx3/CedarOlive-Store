import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllUsers } from "../../api/users/userApi";
import { deleteUserById } from "../../api/users/userApi";
import { useDispatch } from "react-redux";
import {
  Edit,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

// Customer Delete Confirmation Dialog Component
const CustomerDeleteAlert = ({ onConfirm, userName, userId }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleClickOpen}
        className="text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
        aria-label={`Delete user ${userName}`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby={`delete-dialog-title-${userId}`}
        aria-describedby={`delete-dialog-description-${userId}`}
      >
        <DialogTitle id={`delete-dialog-title-${userId}`}>
          Are you absolutely sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id={`delete-dialog-description-${userId}`}>
            You are about to delete the user{" "}
            <span className="font-semibold text-[#A0522D]">{userName}</span>.
            This action cannot be undone and will permanently remove the user
            from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: users, isLoading, isError, refetch } = useGetAllUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Memoized Filtering and Pagination
  const { filteredUsers, totalPages, paginatedUsers } = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : [];

    // Filter users based on search criteria
    const filtered = safeUsers.filter(
      (user) =>
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const total = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return {
      filteredUsers: filtered,
      totalPages: total,
      paginatedUsers: paginated,
    };
  }, [users, searchQuery, currentPage, itemsPerPage]);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUserById(userId)).unwrap();
      toast.success("User deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      refetch();
    } catch (error) {
      toast.error(error?.message || "Failed to delete user", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle navigation for editing a user
  const handleEditUser = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#A0522D]"></div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
        Error loading users. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#131313] text-center md:text-left">
          Customers
        </h1>
        <div className="relative w-full md:w-64">
          <TextField
            variant="outlined"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <Search className="text-[#6b7280] w-5 h-5 mr-2" />
              ),
            }}
          />
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#ede5de] border-b border-[#e2e8f0]">
              <tr>
                <th className="p-4 text-sm text-[#8a8888]">Name</th>
                <th className="p-4 text-sm text-[#8a8888]">Email</th>
                <th className="p-4 text-sm text-[#8a8888]">Role</th>
                <th className="p-4 text-sm text-[#8a8888]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr
                  key={`user-row-${user.id || user._id || index}`}
                  className="border-b border-[#e2e8f0] hover:bg-[#f7f3f3] transition-colors"
                >
                  <td className="p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-full h-full text-[#8a8888] p-2" />
                      )}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-[#A0522D]/10 text-[#A0522D]"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user.id || user._id)}
                      className="text-[#A0522D] hover:bg-[#A0522D]/10 p-2 rounded-full transition-colors"
                      aria-label={`Edit user ${user.name}`}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <CustomerDeleteAlert
                      userId={user.id || user._id || index}
                      userName={user.name}
                      onConfirm={() =>
                        handleDeleteUser(user.id || user._id || index)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-10 text-[#8a8888]">
              No customers found
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#f7f3f3] space-y-4 md:space-y-0">
            <span className="text-sm text-[#8a8888] text-center md:text-left">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-2 justify-center md:justify-end">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outlined"
                size="small"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="outlined"
                size="small"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Card View for mobile */}
      <div className="block sm:hidden">
        {paginatedUsers.map((user, index) => (
          <div
            key={`user-card-${user.id || user._id || index}`}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full text-[#8a8888] p-2" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  user.role === "admin"
                    ? "bg-[#A0522D]/10 text-[#A0522D]"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditUser(user.id || user._id)}
                  className="text-[#A0522D] hover:bg-[#A0522D]/10 p-2 rounded-full transition-colors"
                  aria-label={`Edit user ${user.name}`}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <CustomerDeleteAlert
                  userId={user.id || user._id || index}
                  userName={user.name}
                  onConfirm={() =>
                    handleDeleteUser(user.id || user._id || index)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-[#8a8888]">
            No customers found
          </div>
        )}
        {/* Duplicate the pagination if needed */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outlined"
            size="small"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="mx-2 text-sm text-[#8a8888]">
            {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            variant="outlined"
            size="small"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
