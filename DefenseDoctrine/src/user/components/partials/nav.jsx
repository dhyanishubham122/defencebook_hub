import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] bg-gradient-to-r from-green-800 to-gray-700 shadow-lg z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold hover:text-green-300 transition duration-300">
          <Link to="/">DefenseDoctrine</Link> {/* Use Link for the logo */}
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link
              to="/"
              className="text-white hover:text-green-300 text-lg font-semibold transition duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/book"
              className="text-white hover:text-green-300 text-lg font-semibold transition duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Books
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-white hover:text-green-300 text-lg font-semibold transition duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="text-white hover:text-green-300 text-lg font-semibold transition duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Chat
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-white hover:text-green-300 text-lg font-semibold transition duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none hover:text-green-300 transition duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-green-800 to-gray-700 shadow-lg">
          <ul className="flex flex-col space-y-4 p-4">
            <li>
              <Link
                to="/"
                className="text-white hover:text-green-300 text-lg font-semibold transition duration-300"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/book"
                className="text-white hover:text-green-300 text-lg font-semibold transition duration-300"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Books
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white hover:text-green-300 text-lg font-semibold transition duration-300"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/Chat"
                className="text-white hover:text-green-300 text-lg font-semibold transition duration-300"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Chat
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-white hover:text-green-300 text-lg font-semibold transition duration-300"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;