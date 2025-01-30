
import Logo from "../../assets/website/gr.jpg"

import React, { useState } from "react";
const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <img
            src={Logo} // Replace with your logo path
            alt="Book Website Logo"
            className="h-8"
          />
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Menu items in the middle (hidden on mobile) */}
        <div className="hidden md:flex flex-grow justify-center space-x-8">
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="/books" className="text-gray-700 hover:text-blue-600">
            Books
          </a>
          <a href="/categories" className="text-gray-700 hover:text-blue-600">
            Categories
          </a>
          <a href="/about" className="text-gray-700 hover:text-blue-600">
            About
          </a>
        </div>

        {/* Cart button and AI integration on the right (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="relative p-2 text-gray-700 hover:text-blue-600">
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
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              0
            </span>
          </button>

          {/* AI Integration Button */}
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Ask AI 
          </button> */}
        </div>
      </div>

      {/* Mobile Menu (shown when isMenuOpen is true) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <a
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Home
          </a>
          <a
            href="/books"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Books
          </a>
          <a
            href="/categories"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Categories
          </a>
          <a
            href="/about"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            About
          </a>

          {/* Cart and AI buttons for mobile */}
          <div className="flex items-center justify-around p-4 border-t">
            <button className="relative p-2 text-gray-700 hover:text-blue-600">
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
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
             
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Ask AI pop
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;