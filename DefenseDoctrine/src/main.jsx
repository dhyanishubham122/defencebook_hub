// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
// import './index.css'
// import App from './App.jsx'
// import AdminLogin from "../src/admin/pages/AdminLogin.jsx";
// import AdminRouter from "../src/admin/adminrouter";

// import AuthProvider from './context/AuthContext.jsx'
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
// <Router>
//     <AuthProvider>
//     <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="/admin/*" element={<AdminRouter />} />
//         </Routes>

//     </AuthProvider>
//     </Router>
//   </StrictMode>,
// )
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import UserAuthProvider from "./context/UserAuthContext.jsx"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
      <UserAuthProvider>

        <App />  {/* Directly render App, don't put it inside Routes */}
        </UserAuthProvider>
      </AuthProvider> 

    </Router>
  </StrictMode>
);
