import React from 'react';
import { FaUser, FaEnvelope, FaComment, FaPaperPlane } from 'react-icons/fa';
import { useState,useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Contactpage = () => {
  const [userName,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const navigate=useNavigate();
  const handleformSubmit=async(e)=>{
   e.preventDefault();
    try{
     const response=await fetch('http://localhost:4000/contact/contactform',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        },
        body:JSON.stringify({name:userName,email:email,message:message})

     });
     console.log("repose is :",response);
     if(!response.ok){
      throw new Error('Network response was not ok');
     }
     const data=await response.json();
     console.log(data);
     navigate('thankyou')
    //  alert('Form submitted successfully');
     setUsername('');
     setEmail('');
     setMessage('');

  }
  catch(err){
    console.log(err);
  }
}
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-900 to-green-400 flex items-center justify-center p-6 mt-[60px]">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Contact Information */}
          <div className="md:w-1/3 bg-gradient-to-b from-green-900 to-green-400 p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Let's Connect!</h2>
            <p className="mb-4 flex items-center">
              <FaEnvelope className="mr-2" /> ARMYSupport@inidanarmy.com
            </p>
            <p className="mb-4 flex items-center">
              <FaComment className="mr-2" /> +9729******
            </p>
            <p className="mb-4 flex items-center">
              <FaUser className="mr-2" /> 123 ARMY Street, lasnsdown
            </p>
            <p className="text-sm mt-6">
              We’re here to help and answer any questions you might have. We look forward to hearing from you!
            </p>
          </div>

          {/* Right Side - Contact Form */}
          <div className="md:w-2/3 p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleformSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Your Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    id="name"
                    type="text"
                    value={userName}
                    onChange={(e)=>setUsername(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Your Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  Your Message
                </label>
                <div className="relative">
                  <FaComment className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    id="message"
                    rows="5"
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="you can share any books and pdf link in message so we can add the best books on site"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="flex items-center bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="submit"
                >
                  <FaPaperPlane className="mr-2" /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactpage;