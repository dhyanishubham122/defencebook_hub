import React from 'react';
import {useNavigate} from "react-router-dom"
const FlipCard = ({ category, description }) => {
  const navigate=useNavigate();
  const handelClick=()=>{
    navigate(`/book?category=${encodeURIComponent(category)}`);
  }
  return (
    <div className="flip-card w-64 h-64 perspective cursor-pointer" onClick={handelClick}>
      <div className="flip-card-inner w-full h-full relative transition-transform duration-500 transform-style-preserve-3d">
        {/* Front of the Card */}
        <div className="flip-card-front absolute w-full h-full bg-gradient-to-br from-green-700 to-green-800 text-white flex items-center justify-center rounded-lg shadow-lg backface-hidden p-4">
          <h3 className="text-2xl font-bold text-center capitalize">{category}</h3>
        </div>

        {/* Back of the Card */}
        <div className="flip-card-back absolute w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center rounded-lg shadow-lg backface-hidden transform rotate-y-180 p-4">
          <p className="text-center text-lg">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;