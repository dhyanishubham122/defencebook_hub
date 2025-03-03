import React from 'react';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuthContext } from '../../context/UserAuthContext'
import { useContext } from 'react';

const UserLogin = () => {
     const [email,setEmail]=useState('');
     const [password,setPassword]=useState('');
     const [error,setError]=useState('');
     const {login}=useContext(UserAuthContext);

     const navigate= useNavigate();
     const handleSubmit=async(e)=>{
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:4000/user/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
          
            if (!response.ok) {
              throw new Error('Invalid email or password');
            }
          
            
            const data = await response.json();
            console.log(data);
            login({ token: data.token }); // Store token in AuthContext

            navigate('/chat')
            
          } catch (error) {
            console.log("login eror",error);
            setError(error.message || 'Network error, please try again.');
          }
          
     }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login For Chat</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter Email Address"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-700">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;