import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Profile() {
    const tokenData = JSON.parse(localStorage.getItem('admin'));

  const token = tokenData.token;
  console.log("toje iff:",token);
  console.log("Token stored:", localStorage.getItem('admin')); // Verify it's stored correctly

  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.id : null; // Corrected variable name

  const [profile, setProfile] = useState({
    username: '',
    email: '',
    role: '',
    createdAt: '',
    updatedAt: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setProfile(data); // Set profile data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/admin/profile', {
        method: 'PUT', // Use PUT or PATCH for updating
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated:', data);
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p className="text-gray-700">
            <strong>Username:</strong> {profile.username}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="text-gray-700">
            <strong>Role:</strong> {profile.role}
          </p>
          <p className="text-gray-700">
            <strong>Created At:</strong> {new Date(profile.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-700">
            <strong>Updated At:</strong> {new Date(profile.updatedAt).toLocaleString()}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;