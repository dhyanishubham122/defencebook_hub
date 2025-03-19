import React from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useState,useEffect,useContext } from 'react'
import {useNavigate} from 'react-router-dom';
function AdminLogin() {
  const apiUrl = import.meta.env.VITE_API_URL;
  
    const {login}=useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate=useNavigate();
    
            const handleSubmit = async(e) => {
                e.preventDefault();
                try{
                    const response=await fetch(`${apiUrl}/admin/login`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({email,password})

                        });
                        console.log("resposne :",response);
                        if(!response.ok){
                            const errorData=await response.json();
                            setError(errorData.message);
                        }
                        const data=await response.json();
                        console.log("data :",data);
                        login({ token: data.token }); // Store token in AuthContext
                        navigate("/admin/dashboard"); // Redirect to dashboard
                }
                catch(err){
                    setError("An error occurred. Please try again.");
                    console.error(err);
                }
                
            }


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  </div>
);

}

export default AdminLogin