import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

function footer() {
    
  return (
    <footer className="bg-gradient-to-r from-green-800 to-gray-700 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p className="mb-2">Email: dhyanishubham122@gmail.com</p>
            <p className="mb-2">Phone: +919729XXXXXX</p>
            <p>Address:21st Garhwal Rifiles, Lansdown</p>
          </div>

          {/* Social Media Links */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-300 transition duration-300"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-300 transition duration-300"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-300 transition duration-300"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} DefenseDoctrine@. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default footer;