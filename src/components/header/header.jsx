import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../../redux/authSlice";
import { removeFromCart, clearCart } from "../../redux/cartSlice";
import { User } from "lucide-react";
import { toast } from "react-toastify";
import SearchOverlay from "./SearchOverlay";
import { resetUserState } from "../../redux/userSlice";
import { useGetAllProducts } from "../../api/products/productsApi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Define queryParams with optimized search parameters
  const queryParams = {
    limit: 100,
    page: 1,
    sort: "-createdAt",
    fields: "id,name,description,category,price,images", // Only request needed fields
  };

  // Get all products using the API hook
  const { data, isLoading } = useGetAllProducts(queryParams);

  // Client-side filtering based on search term - handling API response structure correctly
  const filteredProducts = useMemo(() => {
    // Properly access products from the API response
    const allProducts = data?.products || [];

    if (!searchTerm || searchTerm.trim() === "") return allProducts;

    const lowercasedSearch = searchTerm.toLowerCase();

    return allProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(lowercasedSearch) ||
        product.description?.toLowerCase().includes(lowercasedSearch) ||
        product.category?.toLowerCase().includes(lowercasedSearch)
    );
  }, [data, searchTerm]);

  // Get current user from Redux store
  const user = useSelector((state) => state.user.currentUser);

  // Redux store data for cart
  const { cartItems, totalAmount } = useSelector((state) => state.cart);

  const navLinks = [
    { title: "About", path: "/about" },
    { title: "Blog", path: "/blog" },
    { title: "Contact", path: "/contact" },
  ];

  const categoryLinks = [
    { title: "Shop", path: "/shop/All" },
    { title: "Decor", path: "/shop/Decor" },
    { title: "Wall Art", path: "/shop/Wall Art" },
    { title: "Lighting", path: "/shop/Lighting" },
  ];

  const profileLinks = [
    { title: "My Profile", path: "/profile" },
    { title: "My Orders", path: "/profile/orders" },
    { title: "Wishlist", path: "/profile/wishlist" },
    { title: "Payment", path: "/profile/payment" },
    { title: "Settings", path: "/profile/settings" },
  ];

  // Add Admin link to profile links for admin users
  if (user && user.role === "admin") {
    profileLinks.unshift({ title: "Admin Dashboard", path: "/admin" });
  }

  // Toggle functions
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isCartOpen) setIsCartOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isCartOpen) setIsCartOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setIsCartOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(resetUserState());
    queryClient.removeQueries(["currentUser"]);
    setIsProfileOpen(false);
    navigate("/signIn");
  };

  // Handle checkout process
  const handleCheckout = () => {
    if (!user) {
      // Show toast notification first
      toast.info("Please sign in to continue with checkout", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Use setTimeout to ensure toast is shown before redirect
      setTimeout(() => {
        // Redirect to sign in page
        navigate("/signIn", {
          state: {
            from: "/checkout",
            message: "Please sign in to complete your purchase",
          },
        });
      }, 3000); // Small delay to ensure toast appears
    } else {
      // Show success toast
      toast.success("Proceeding to checkout...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate to checkout page
      navigate("/checkout");
    }
  };

  // Handle search input change - for client-side filtering
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Direct navigation to admin dashboard
  const goToAdminDashboard = () => {
    navigate("/admin");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Search Overlay - passing filteredProducts and loading state */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={filteredProducts}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />

      <header className="w-full bg-background shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img
                src="https://cdn.prod.website-files.com/629f3db942b81a5f49ac7ba9/62c4923d2a7ada5125407697_logo.svg"
                alt="Logo"
                className="w-32"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {categoryLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="text-title text-[15px] font-medium hover:text-secondary transition duration-200"
                >
                  {link.title}
                </Link>
              ))}
              <span className="w-[1px] h-[30px] bg-gray-200"></span>
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="text-title text-[15px] font-medium hover:text-secondary transition duration-200"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              {/* Admin Button - Desktop */}
              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center px-3 py-2 bg-secondary text-white rounded-md hover:bg-[#9a4a25] transition-colors duration-300 border border-secondary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Admin</span>
                </Link>
              )}

              <button
                className="p-1 hover:text-secondary transition duration-200"
                onClick={toggleSearch}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* User Profile Section */}
              <div className="relative">
                {user ? (
                  <>
                    <button
                      className="flex items-center hover:text-secondary transition duration-200"
                      onClick={toggleProfile}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {user?.photo ? (
                          <img
                            src={user.photo}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={64} className="text-icons p-2" />
                        )}
                      </div>
                      {/* Admin badge for mobile - shown next to profile photo */}
                      {user.role === "admin" && (
                        <span className="md:hidden flex items-center justify-center absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-5 h-5 rounded-full">
                          A
                        </span>
                      )}
                    </button>

                    <div
                      className={`absolute right-0 w-56 mt-2 bg-white rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out ${
                        isProfileOpen
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="p-3 border-b">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="inline-block bg-secondary text-white text-xs px-2 py-1 rounded-sm mt-1">
                            Admin
                          </span>
                        )}
                      </div>
                      {user.role === "admin" && (
                        <div className="p-3 border-b">
                          <button
                            onClick={goToAdminDashboard}
                            className="w-full flex items-center justify-center py-2 bg-secondary text-white rounded hover:bg-[#9a4a25] transition-colors duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Admin Dashboard
                          </button>
                        </div>
                      )}
                      <div className="py-1">
                        {profileLinks.map((link) => (
                          <Link
                            key={link.title}
                            to={link.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            {link.title}
                          </Link>
                        ))}
                      </div>
                      <div className="py-1 border-t">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/signIn"
                    className="group relative inline-block w-full sm:w-auto px-4 py-2 text-sm md:text-base text-white bg-secondary overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-[#9a4a25] transition-transform duration-300 ease transform scale-x-0 origin-left group-hover:scale-x-100"></span>
                    <span className="relative">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Cart Section */}
              <div className="relative">
                <button
                  className="p-1 hover:text-secondary transition duration-200"
                  onClick={toggleCart}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </button>
                <span className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>

                {/* Cart Overlay */}
                <div
                  className={`fixed top-0 right-0 w-full h-full bg-black bg-opacity-75 z-40 transition-opacity duration-300 ${
                    isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => setIsCartOpen(false)}
                ></div>

                {/* Cart Dropdown */}
                <div
                  className={`fixed top-0 right-0 w-80 lg:w-1/4 bg-white shadow-lg z-50 h-full transition-transform duration-300 ease-in-out transform ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                  } flex flex-col`}
                >
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="text-2xl">Your Cart</h3>
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() => setIsCartOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {cartItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          Your cart is empty
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center p-4 border-b"
                          >
                            <div className="w-20 h-24 flex-shrink-0 mr-4">
                              <img
                                src={item.image || "/api/placeholder/80/96"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-gray-900">{item.price}</p>
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    value={item.quantity || 1}
                                    className="w-12 p-1 border text-center"
                                    min="1"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <button
                                className="text-gray-500 text-sm mt-1 hover:text-black"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t mt-auto">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-medium">
                        ${totalAmount.toFixed(2)} USD
                      </span>
                    </div>
                    <button
                      className="w-full bg-secondary text-white py-3 px-6 hover:bg-[#aa7b5a] transition duration-200 mb-2"
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      Continue to Checkout
                    </button>
                    {cartItems.length > 0 && (
                      <button
                        className="w-full border border-gray-300 py-2 px-6 hover:bg-gray-100 transition duration-200 text-sm"
                        onClick={handleClearCart}
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="md:hidden p-1 hover:text-gray-600 transition duration-200"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  if (isSearchOpen) setIsSearchOpen(false);
                }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white w-full shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[500px] py-4" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-5">
          {/* Admin Button for Mobile - Prominent at the top of mobile menu */}
          {user && user.role === "admin" && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <button
                onClick={goToAdminDashboard}
                className="flex items-center justify-center w-full py-3 px-4 bg-secondary text-white rounded-md hover:bg-[#9a4a25] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Admin Dashboard</span>
              </button>
            </div>
          )}
          <nav className="flex flex-col space-y-4">
            {[...categoryLinks, ...navLinks].map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="w-full text-left text-title hover:text-secondary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
