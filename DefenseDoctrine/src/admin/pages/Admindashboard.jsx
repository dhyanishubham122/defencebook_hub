import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Profile from '../components/profile';
import Add from '../components/Add';
import View from '../components/Booksview';
import Update from '../components/Update';
import Delete from '../components/Delete';
import { ChevronDown,Search } from "lucide-react";
function Admindashboard() {
  const { logout } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const token = localStorage.getItem('admin');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
   const [showDrpodown,setShowDropdown]=useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
// for ai
const [searchQuery, setSearchQuery] = useState(''); // Add this line

const [aiResponse, setAiResponse] = useState(''); // To store the AI's response
const [isLoading, setIsLoading] = useState(false);
//end
  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <Profile />;
      case 'add': return <Add />;
      case 'view': return <View />;
      case 'update': return <Update />;
      case 'delete': return <Delete />;
      case 'dashboard':
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">Welcome to the Admin Dashboard</h2>
            <p className="text-gray-600 mt-2">Manage books, view details, and more.</p>
          </div>
        );
    }
  };

  // ai function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
  
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/admin/api/openai`, { prompt: searchQuery });
      setAiResponse(response.data.response);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('Failed to fetch response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // ai end

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-blue-900 text-white p-6 space-y-6">
         <div className='flex justify-between items-center cursor-pointer md:cursor-default' onClick={() => setShowDropdown(!showDrpodown)}>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <ChevronDown  className={`w-5 h-5 md:hidden transition-transform duration-300 ${showDrpodown ? "rotate-180" : "rotate-0"}`} />
        </div>
        <ul className={`mt-4 space-y-4 ${showDrpodown?"block":"hidden"} md:block`}>
          {['dashboard', 'profile', 'add', 'update', 'delete', 'view'].map((item) => (
            <li key={item}>
              <button
                className={`block w-full text-left py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-700 ${activeSection === item ? 'bg-blue-700' : ''}`}
                onClick={() => setActiveSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            <button
    onClick={handleSearch}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500"
    disabled={!searchQuery.trim() || isLoading} // Disable button if search query is empty or loading
  >
    {isLoading ? (
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div> // Loading spinner
    ) : (
      <Search className="w-5 h-5" /> // Search icon
    )}
  </button>
  {aiResponse && (
  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
    <h3 className="text-lg font-semibold text-gray-800">AI Response</h3>
    <p className="text-gray-600 mt-2">{aiResponse}</p>
  </div>
)}
          </div>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center bg-white px-4 py-2 rounded-lg shadow-md">
              <span className="mr-2 text-gray-700">{token ? jwtDecode(token)?.name || 'Admin' : 'Admin'}</span>
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button onClick={logout} className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </div>
        {renderSection()}
      </div>
    </div>
  );
}

export default Admindashboard;
