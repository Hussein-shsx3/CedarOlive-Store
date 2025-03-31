import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#131313] text-white py-16 w-full mx-auto md:mx-8 px-5 md:px-8">
      <div className="w-full">
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
          {/* Column 1 - Logo and Contact */}
          <div>
            <Link to="/" className="inline-block mb-8">
              <img
                src="https://cdn.prod.website-files.com/629f3db942b81a5f49ac7ba9/62c8573292d616282873607d_logo%20white.svg"
                alt="Logo"
                className="w-36"
              />
            </Link>

            <div className="mb-4">
              <p>35 Casberg-Scotts Valley Road</p>
              <p>Deer Park, WA, 99006 UK</p>
            </div>

            <div>
              <p>
                Tel:{" "}
                <a href="tel:+22223631022" className="hover:text-gray-300">
                  (+22) 223 631 022
                </a>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:hello@homeable.io" className="hover:underline">
                  hello@homeable.io
                </a>
              </p>
            </div>
          </div>

          {/* Column 2 - Homeable */}
          <div>
            <h3 className="text-gray-400 uppercase mb-6">HOMEABLE</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop/All" className="hover:text-gray-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/shop/Wall Art" className="hover:text-gray-300">
                  Wall Art
                </Link>
              </li>
              <li>
                <Link to="/shop/Vases" className="hover:text-gray-300">
                  Vases
                </Link>
              </li>
              <li>
                <Link to="/shop/Living Room" className="hover:text-gray-300">
                  Living Room
                </Link>
              </li>
              <li>
                <Link to="/shop/Lighting" className="hover:text-gray-300">
                  Lighting
                </Link>
              </li>
              <li>
                <Link to="/shop/Decor" className="hover:text-gray-300">
                  Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="text-gray-400 uppercase mb-6">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gray-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-gray-300">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gray-300">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gray-300">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Template */}
          <div>
            <h3 className="text-gray-400 uppercase mb-6">TEMPLATE</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/license" className="hover:text-gray-300">
                  License
                </Link>
              </li>
              <li>
                <Link to="/style-guide" className="hover:text-gray-300">
                  Style Guide
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="hover:text-gray-300">
                  Changelog
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-gray-300">
                  Templates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-500 my-10"></div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-400 w-full">
        <div>
          ©2025 Company | Designed by{" "}
          <a
            href="https://obenocci.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Obenocci
          </a>
        </div>
        <div className="mt-4 sm:mt-0">
          Powered by{" "}
          <a
            href="https://webflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Webflow
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
