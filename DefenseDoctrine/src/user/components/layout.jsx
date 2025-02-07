// src/components/Layout.js
import React from 'react';
import Navbar from './partials/nav'; // Adjust the import path as needed

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Navbar is included here */}
      <main className="flex-grow">
        {children} {/* This will render the page content */}
      </main>
       {/* Footer<Footer /> is included here (if you have one) */}
    </div>
  );
};

export default Layout;