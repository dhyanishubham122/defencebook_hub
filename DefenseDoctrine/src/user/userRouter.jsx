// src/UserRouter.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import GoogleAuthHandler from "./components/GoogleAuthHandler";
import HomePage from "./pages/HomePage";
import About from "./pages/Aboutpage";
import Contact from "./pages/Contactpage";
import Book from "./pages/Book";
import BookDetails from "./pages/Bookdetails"
import Login from "./pages/UserLogin";
import SignUp from "./pages/UserSignup";
import Chat from "./pages/Chat"
import Thankyou from "./pages/thankyoupage"
import UserProtetedroute from "./pages/UserProtetedroute";
function UserRouter() {
  return (
    <Routes>
      <Route path="/" element={ <Layout> <HomePage /></Layout>}/>
      <Route  path="/book" element={<Layout><Book /></Layout>}/>
      <Route  path="/about"element={<Layout> <About /> </Layout>}/>
      <Route path="/contact" element={<Layout> <Contact /></Layout>}/>
      <Route path="/bookdetails" element={<Layout> <BookDetails /></Layout>}/>
      <Route path="/google-auth-handler" element={<GoogleAuthHandler />} />

      <Route path="/Chat" element={<Layout><UserProtetedroute> <Chat /></UserProtetedroute></Layout>}/>
      <Route path="/login" element={<Layout> <Login/></Layout>}/>
      <Route path="/signup" element={<Layout><SignUp /></Layout>}/>
      <Route path="contact/thankyou" element={<Layout><Thankyou/></Layout>}/>
    </Routes>
  );
}

export default UserRouter;
