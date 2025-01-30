import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
import AdminLogin from "../admin/pages/AdminLogin";
import {AuthContext} from "../context/AuthContext";
import { useContext } from "react";
import {Navigate} from 'react-router-dom';
import Dashboard from "../admin/pages/Admindashboard"
import ProtectedRoute from "../admin/pages/Protectedroute"
const AdminRouter = () => {
  const {logout,admin}=useContext(AuthContext);
 

  console.log("Admin state:", admin);

  return (
    
      <Routes>
        <Route path="/login" element={<AdminLogin  />}/>
        {/* <Route
        path="/dashboard"
        element={
          admin ? (
            <div>
              <h1>Admin Dashboard</h1>
              <button onClick={logout}>Logout</button>
              <p>Welcome to the admin dashboard!</p>
            </div>
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      /> */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard  /></ProtectedRoute>}/>

            {/* <Route path="/profile" element={ <div>
              <h1>Admin profile</h1>
              <button onClick={logout}>LOgout</button>

              <p>Welcome  to the admin dashboard!</p>
            </div>} /> */}
      </Routes>
      
    
  );
};

export default AdminRouter;
