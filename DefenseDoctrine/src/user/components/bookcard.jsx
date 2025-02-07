import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="w-72 bg-white/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 hover:border-gray-300">
      <img
        src={`http://localhost:4000/${book.image}`}
        alt={book.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-4">{book.author}</p>
        <div className="flex items-center justify-between">
          <a href={book.purchasedLinkUrl} target="_blank" rel="noopener noreferrer">
            <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-300">
              Purchase Link
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookCard;