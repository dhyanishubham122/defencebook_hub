import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuthContext } from '../../context/UserAuthContext';
import { jwtDecode } from 'jwt-decode';

function UserProtectedRoute({ children }) {
    const { user, loading } = useContext(UserAuthContext);
    const [isTokenValid, setIsTokenValid] = useState(true);
    const [message, setMessage] = useState("Checking authentication...");
    const [redirect, setRedirect] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('User'));
 console.log("in userprotected route");
    useEffect(() => {
        if (loading) return;

        if (token) {
            console.log("in userprotected route token",token);
            try {
                const decoded = jwtDecode(token);
                const currentTime = new Date().getTime() / 1000;

                if (decoded.exp < currentTime) {
                    setIsTokenValid(false);
                    setMessage("Your session has expired, please login again.");
                    setTimeout(() => {
                        setRedirect(true);
                    }, 3000);
                } else {
                    setIsTokenValid(true);
                    setRedirect(false);
                }
            } catch (error) {
                setIsTokenValid(false);
                setMessage("Invalid token, redirecting to login...");
                setTimeout(() => {
                    setRedirect(true);
                }, 3000);
            }
        } else {
            setIsTokenValid(false);
            setMessage("No token found. Redirecting to login...");
            setTimeout(() => {
                setRedirect(true);
            }, 3000);
        }
    }, [token, loading]);

    useEffect(() => {
        const checkToken = () => {
            setToken(localStorage.getItem('User')); // Update token state when it changes
        };

        window.addEventListener("storage", checkToken); // Listen for storage updates
        return () => window.removeEventListener("storage", checkToken);
    }, []);

    if (redirect) {
        console.log("Redirecting to login...");
        return <Navigate to="/login" />;
    }

    if (!isTokenValid) {
        return (
            <div>
                <p>{message}</p>
            </div>
        );
    }

    return children;
}

export default UserProtectedRoute;
