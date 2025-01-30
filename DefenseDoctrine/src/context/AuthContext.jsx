import {createContext, useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
// craeting the authentication context

export const AuthContext=createContext();
const AuthProvider=({children})=>{
    const [admin,setAdmin]= useState(null);
    const [loading, setLoading] = useState(true); // Track loading state

    const navigate=useNavigate();

    const login=(adminData)=>{
        setAdmin(adminData);
        console.log("admin data:",adminData);
        localStorage.setItem("admin",JSON.stringify(adminData));
    };
    const logout = () => {
        setAdmin(null);
        localStorage.removeItem("admin");
        navigate("/admin/login"); // Redirect to login page
      };
      const initializeAuth = () => {
        try {
          const storedAdmin = localStorage.getItem("admin");
          console.log("store admin",JSON.parse(storedAdmin));
          if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
          }
        } catch (error) {
          console.error("Failed to initialize authentication:", error);
        }
        finally {
          setLoading(false); // Set loading to false after the initialization is complete
        }
      };
      
        useEffect(() => {
            initializeAuth(); // Initialize authentication state when component mounts
        }, []);

        return(
            <AuthContext.Provider value={{admin,login,logout,initializeAuth}}>
                {children}
            </AuthContext.Provider>
        )
      
}
export default AuthProvider;
