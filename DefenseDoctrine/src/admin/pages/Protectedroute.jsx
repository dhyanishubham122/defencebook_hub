import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {jwtDecode} from "jwt-decode"; // Remove curly braces here

function Protectedroute({ children }) {
 
  const { admin,loading } = useContext(AuthContext);
  const [isTokenValid, setIsTokenValid] = useState(true); // Tracks token validity
  const [message, setMessage] = useState(""); // Tracks messages for the user
  const [showRedirect, setShowRedirect] = useState(false); // Controls redirection
//   const token = admin?.token;
// console.log("admin",{admin});
const token= localStorage.getItem('admin');
if (loading) {
    return null;
  }
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const expiryTime = decodedToken.exp; // Token expiry time

        if (expiryTime < currentTime) {
          console.log("Token is expired.");
          setIsTokenValid(false);
          setMessage("Your session has expired. Redirecting to login...");
          setTimeout(() => {
            setShowRedirect(true); // Enable redirection after 3 seconds
          }, 3000); // 3-second delay
        } else {
          console.log("Token is valid.");
          setIsTokenValid(true); // Token is valid
          setShowRedirect(false); // Ensure no redirection
        }
        console.log("in try block ")
      } catch (error) {
        console.error('Invalid token:', error.message);
        setIsTokenValid(false); // Mark token as invalid
        setMessage("Invalid token. Redirecting to login...");
        setTimeout(() => {
          setShowRedirect(true); // Enable redirection after 3 seconds
        }, 3000); // 3-second delay
      }
    } else {
      console.log("No token found.");
      setIsTokenValid(false); // No token found
      setMessage("No token found. Redirecting to login...");
      setTimeout(() => {
        setShowRedirect(true); // Enable redirection after 3 seconds
      }, 3000); // 3-second delay
    }
  }, [token]); // Re-run whenever `token` changes

 
  // Handle redirection after message is displayed
  if (showRedirect) {
    console.log("Redirecting to login...");
    return <Navigate to="/admin/login" />;
  }

  // Show message if token is invalid and waiting to redirect
  if (!isTokenValid && message) {
    return (
      <div>
        <p>{message}</p> {/* Display message */}
      </div>
    );
  }

  // Render the protected content if token is valid
  return children;
}

export default Protectedroute;
