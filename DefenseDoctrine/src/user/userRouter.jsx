// src/UserRouter.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/HomePage";
import About from "./pages/Aboutpage";
import Contact from "./pages/Contactpage";
import Book from "./pages/Book";
import BookDetails from "./pages/Bookdetails"
import Login from "./pages/UserLogin";
import SignUp from "./pages/UserSignup";
import Chat from "./pages/Chat"
import UserProtetedroute from "./pages/UserProtetedroute";
function UserRouter() {
  return (
    <Routes>
      <Route path="/" element={ <Layout> <HomePage /></Layout>}/>
      <Route  path="/book" element={<Layout><Book /></Layout>}/>
      <Route  path="/about"element={<Layout> <About /> </Layout>}/>
      <Route path="/contact" element={<Layout> <Contact /></Layout>}/>
      <Route path="/bookdetails" element={<Layout> <BookDetails /></Layout>}/>
      <Route path="/Chat" element={<Layout><UserProtetedroute> <Chat /></UserProtetedroute></Layout>}/>
      <Route path="/login" element={<Layout> <Login/></Layout>}/>
      <Route path="/signup" element={<Layout><SignUp /></Layout>}/>

    </Routes>
  );
}

export default UserRouter;
