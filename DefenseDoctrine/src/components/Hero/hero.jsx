import React,{useState} from 'react'
import Limag from "../../assets/website/gr.jpg"
const books = [
    {
      id: 1,
      title: "Book Title 1",
      description: "This is a description for Book 1.",
      image: Limag,
    },
    {
      id: 2,
      title: "Book Title 2",
      description: "This is a description for Book 2.",
      image: Limag,
    },
    {
      id: 3,
      title: "Book Title 3",
      description: "This is a description for Book 3.",
      image: Limag,
    },
  ];
function Hero() {
    const [selectedBook, setSelectedBook] = useState(books[0]);
       
  const handleBookClick = (book) => {
    setSelectedBook(book);
  };
  return (
    <>
    
    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-100">
      {/* Left Side: Title, Description, and Button */}
      <div className="w-full md:w-1/2 space-y-4 text-center">
     
        
        <h1 className="text-4xl font-bold mt-[60px]">{selectedBook.title}</h1>
        <p className="text-gray-600 mt-[60px]">{selectedBook.description}</p>
        
      
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Order Now
        </button>
      </div>

      {/* Right Side: Main Image and Thumbnails */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        {/* Main Image */}
        <img
          src={selectedBook.image}
          alt={selectedBook.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />

        {/* Thumbnails */}
       
      </div>
      <div className="flex mt-4  mb-2 flex-row md:flex-col space-x-4">
        
          {books.map((book) => (
            <img
              key={book.id}
              src={book.image}
              alt={book.title}
              className="w-16 h-16 mb-2 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
              onClick={() => handleBookClick(book)}
            />
          ))}
          
        </div>
    </div>
    

    </>
  )
};
export default Hero;