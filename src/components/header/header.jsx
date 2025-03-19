import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../../redux/cartSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Connect to Redux store
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Assuming user data would come from Redux, we can mock it for now
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/api/placeholder/32/32", // Placeholder for user avatar
  };

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
    { title: "My Account", path: "/account" },
    { title: "My Orders", path: "/account/orders" },
    { title: "Wishlist", path: "/account/wishlist" },
    { title: "Settings", path: "/account/settings" },
  ];

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    // Close other overlays if open
    if (isMenuOpen) setIsMenuOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close other overlays if open
    if (isMenuOpen) setIsMenuOpen(false);
    if (isCartOpen) setIsCartOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    // Close other overlays if open
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    // Here you would implement logout logic
    // For example: dispatch(logout());
    setIsProfileOpen(false);
    navigate("/signIn");
  };

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Search Overlay */}
      <div
        className={`w-full bg-white shadow-md transition-all duration-300 ease-in-out absolute top-16 left-0 right-0 overflow-hidden ${
          isSearchOpen ? "max-h-24" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-grow p-2 border border-gray-300 focus:outline-none focus:border-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isSearchOpen}
            />
            <button
              type="submit"
              className="bg-secondary text-white px-6 py-2 ml-2 hover:bg-[#aa7b5a] transition duration-200"
            >
              Search
            </button>
            <button
              type="button"
              className="ml-2 p-2 text-gray-500 hover:text-black"
              onClick={toggleSearch}
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
          </form>
        </div>
      </div>

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

              {/* User Profile */}
              <div className="relative">
                {!user ? (
                  <>
                    <button
                      className="flex items-center hover:text-secondary transition duration-200"
                      onClick={toggleProfile}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img
                          src={user.avatar}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </button>

                    {/* Profile Dropdown */}
                    <div
                      className={`absolute right-0 w-56 mt-2 bg-white rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out ${
                        isProfileOpen
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="p-3 border-b">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
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
                    className="px-4 py-2 bg-secondary text-white rounded hover:bg-[#aa7b5a] transition duration-200"
                  >
                    Sign In
                  </Link>
                )}
              </div>

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
                    <button className="w-full bg-secondary text-white py-3 px-6 hover:bg-[#aa7b5a] transition duration-200 mb-2">
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
      <div
        className={`md:hidden bg-white w-full shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[400px] py-4" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-5">
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
