import React from 'react'
import { createContext,useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
export const UserAuthContext=createContext();
const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate =useNavigate();
    // const login=(userdata)=>{
    //     console.log(userdata);
    //     setUser(userdata);
    //     localStorage.setItem('User',JSON.stringify(userdata));
    // }
    const login = (userdata) => {
        console.log(userdata);
        setUser(userdata);
        try {
            localStorage.setItem('User', JSON.stringify(userdata));
        } catch (err) {
            console.error("Failed to store user data:", err);
        }
    };
    const logout=()=>{
        setUser(null);
        localStorage.removeItem('User');
        navigate('/login');
    }
    const initializeAuth=()=>{
        try{
        const storedUser=localStorage.getItem('User');
        if(storedUser){
            setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }
        catch(err){
            console.log("user authentication failde",err);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        initializeAuth();
    },[]);
    return <UserAuthContext.Provider value={{user,login,logout,initializeAuth}}>
        {children}
    </UserAuthContext.Provider>

}

export default UserAuthProvider;