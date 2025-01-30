import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Profile from '../components/profile'; // Import the Profile component
import Add from '../components/Add';
import View from '../components/Booksview';
import Update from '../components/Update'
function Admindashboard() {
  const { admin, logout } = useContext(AuthContext);
  const token = localStorage.getItem('admin');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
console.log("active:",activeSection);
  // Render the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile />; // Render the Profile component
      case 'add':
         return <Add/>
         case 'view':
          return <View/>
          case 'update':
          return <Update/>
        case 'dashboard': 
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Welcome to the Dashboard</h2>
            <p>This is where your main content will go.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (25%) */}
      <div className="w-1/4 bg-blue-800 text-white p-4 mt-5">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <hr className="border-t-2 border-gray-600 w-100 mb-6" />
        <ul>
          <li className="mb-6">
            <button
              className="hover:text-gray-300"
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li className="mb-6 mt-6">
            <button
              className="hover:text-gray-300"
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
          </li>
          <li className="mb-6">
            <button
              className="hover:text-gray-300"
              onClick={() => setActiveSection('add')}
            >
              Add
            </button>
          </li>
          <li className="mb-6">
            <button
              className="hover:text-gray-300"
              onClick={() => setActiveSection('update')}
            >
              Update
            </button>
          </li>
          <li className="mb-6">
            <button
              className="hover:text-gray-300"
              onClick={() => setActiveSection('delete')}
            >
              Delete
            </button>
          </li>
          <li className="mb-6">
            <button
              className="hover:text-gray-300"
              onClick={() => setActiveSection('view')}
            >
              View
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content (75%) */}
      <div className="w-3/4 p-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center focus:outline-none"
            >
              {token && (
                <span className="mr-2">
                  {jwtDecode(token)?.name || 'Username'}
                </span>
              )}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  className="block px-4 py-4 text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Render Active Section */}
        {renderSection()}
      </div>
    </div>
  );
}

export default Admindashboard;