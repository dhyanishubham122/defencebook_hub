import React, { useState, useEffect } from "react";

function Hero() {
  const [books, setBooks] = useState([]); // Store books from API
  const [selectedBook, setSelectedBook] = useState(null); // Selected book for display
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Fetch top-rated books when the component loads
  useEffect(() => {
    fetch(` ${apiUrl}/user/book?topRated=true`) // API call for top-rated books
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        if (data.length > 0) {
          setSelectedBook(data[0]); // Set the first book as default
        }
      })
      .catch((error) => console.error("Error fetching top-rated books:", error));
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 mt-[60px]">
      {/* Left Side: Title, Description, and Button */}
      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left px-4 md:px-8">
        {selectedBook && (
          <>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              {selectedBook.title}
            </h1>
            <p className="text-xl text-gray-600 mt-4">{selectedBook.description}</p>
            <a href={selectedBook.purchasedLinkUrl} target="_blank" rel="noopener noreferrer">
  <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105">
    Purchased Link
  </button>
</a>
          </>
        )}
      </div>

      {/* Right Side: Main Image and Thumbnails */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center px-4 md:px-8">
        {selectedBook && (
          <img
            src={` ${apiUrl}/${selectedBook.image}`}
            alt={selectedBook.title}
            className="max-w-lg h-96 object-cover rounded-xl shadow-2xl transform hover:scale-105 transition duration-300"
          />
        )}

        {/* Thumbnails */}
        <div className="flex mt-8 space-x-4 overflow-x-auto py-4">
          {books.map((book) => (
            <img
              key={book._id}
              src={` ${apiUrl}/${book.image}`}
              alt={book.title}
              className={`w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg cursor-pointer transition duration-300 ${
                selectedBook?._id === book._id
                  ? "border-4 border-blue-600"
                  : "hover:opacity-75"
              }`}
              onClick={() => handleBookClick(book)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;