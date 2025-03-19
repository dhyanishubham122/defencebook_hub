import React from 'react';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const UserSignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError]=useState('');
    const navigate=useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
  
    const handelSubmit =async(e)=>{
        e.preventDefault();
        try{
        const response = await fetch(`${apiUrl}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({username,email,password})
                });
                if(!response.ok){
                    const errorData=await response.json();
                    setError(errorData.message);
                }
                const data = await response.json();
                console.log(data);
                navigate('/login')
            }
            catch(error){
                setError("An error occurred. Please try again.");
                console.error(error);
            }
        }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <h1 className="text-2xl font-bold mb-6 text-center">Signup for Chat</h1>
        <form onSubmit={handelSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-4">
          Have an account? <a href="/login" className="text-blue-500 hover:text-blue-700">Login</a>
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;