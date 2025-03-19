import { useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from '../../context/UserAuthContext'

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const {login}=useContext(UserAuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        login({ token: token });
        localStorage.setItem("User", JSON.stringify({ token }));
        setTimeout(() => {
            navigate("/chat"); // Redirect to chat without query params
        }, 1000);
        
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
};

export default GoogleAuthHandler;
