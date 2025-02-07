// src/UserRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from "./components/layout"
import HomePage from './pages/HomePage';
import About from './pages/Aboutpage';
import Contact from './pages/Contactpage';
import Book from './pages/Book';

function UserRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/book"
        element={
          <Layout>
            <Book />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
    </Routes>
  );
}

export default UserRouter;