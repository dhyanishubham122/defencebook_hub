import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Profile() {
    const tokenData = JSON.parse(localStorage.getItem('admin'));
    console.log("tokendata is :",tokenData);
  const token = tokenData.token;
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.id : null; // Corrected variable name
 console.log("useid is :",userId);
 const [password,setPassword]=useState('');
 const [newPassword,setNewPassword]=useState('');
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    role: '',
    createdAt: '',
    updatedAt: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/admin/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("resposnse  :",response);
        if (!response.ok) {
          throw new Error(`Failed to fetch profile data ${token}`);
        }
        const data = await response.json();
        console.log("useid is :",userId);

        setProfile(data); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [token]);


const handelformsubmit=async(e)=>{
  try{
    e.preventDefault();

    const reqdata = {
      email: profile.email,
      password: password,
      newpassword: newPassword,
    };
    const response= await fetch('http://localhost:4000/admin/profileupdate',{
      method:'PUT',
      headers:{
        'Authorization':`Bearer ${token}`,
        'Content-Type': 'application/json',

        },
        body:JSON.stringify(reqdata),
    });
   
    if(!response.ok){
      throw new Error('Failed to update password');
    }
    const data = await response.json();
    console.log("data is :",data);
    setPassword('');
    setNewPassword('');
    alert("password updated succsefulyy");
    setIsEditing(false);
  }
  catch(err){
    console.log("error to update profile",err);
  }
}


  return (
    <>
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-2xl border border-gray-100 ">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 mr-2 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
    Profile
  </h2>

  <div className="space-y-5">
    {/* Username */}
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-blue-500 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <p className="text-gray-700">
        <strong className="text-gray-800">Username:</strong> {profile.username}
      </p>
    </div>

    {/* Email */}
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-purple-500 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <p className="text-gray-700">
        <strong className="text-gray-800">Email:</strong> {profile.email}
      </p>
    </div>

    {/* Role */}
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-green-500 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-gray-700">
        <strong className="text-gray-800">Role:</strong> {profile.role}
      </p>
    </div>

    {/* Created At */}
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-yellow-500 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-gray-700">
        <strong className="text-gray-800">Created At:</strong>{" "}
        {new Date(profile.createdAt).toLocaleString()}
      </p>
    </div>

    {/* Updated At */}
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-500 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-gray-700">
        <strong className="text-gray-800">Updated At:</strong>{" "}
        {new Date(profile.updatedAt).toLocaleString()}
      </p>
    </div>
  </div>

  {/* Change Password Button */}
  <button
    onClick={() => setIsEditing(true)}
    className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
    Change Password
  </button>
</div>

{isEditing &&(
  <>
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Update Account</h2>
        <form className="overflow-y-auto flex-1" onSubmit={(e)=>handelformsubmit(e)}>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profile.email}
             
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
               value={password}
               onChange={(e)=>setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={()=>{setIsEditing(false)}}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type='submit'
         
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
        </form>
      </div>
    </div>
  </>
)}
</>


  );
}

export default Profile;