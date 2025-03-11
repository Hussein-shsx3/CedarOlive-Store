import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <div className="w-full sticky top-0 z-50">
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
              <button className="p-1 hover:text-secondary transition duration-200">
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
              <button className="hidden md:block text-[15px] bg-primary px-6 py-3 text-title hover:text-white hover:bg-secondary transition duration-200">
                Purchase
              </button>
              <div className="relative">
                <button className="p-1 hover:text-secondary transition duration-200">
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
                  0
                </span>
              </div>
              <button
                className="md:hidden p-1 hover:text-gray-600 transition duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
