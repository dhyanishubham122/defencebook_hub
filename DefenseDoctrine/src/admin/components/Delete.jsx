import React from 'react'
import { useState, useEffect } from 'react'
function Delete() {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const tokendata=JSON.parse(localStorage.getItem('admin'));
    const token=tokendata.token;
    const [books, setBooks] = useState([]);
    const [bookid, setBookid] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const catego=[
        'war','victories','training','defence','terrorism','officertalk','other'
         ];
    // Fetch books
    const fetchBooks = async () => {
        try {
            const url = ` ${apiUrl}/admin/books?category=${selectedCategory}&page=${currentPage}&limit=9`;
            const response = await fetch(url);
            console.log("response is :",response);
            if (!response.ok) throw new Error('Failed to fetch books');
            const data = await response.json();
            console.log("data is :",data);
            setBooks(data.books);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to the first page when category changes
    };
   const handledelete=async()=>{
    const url = ` ${apiUrl}/admin/delete/${bookid}`;
    try{
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
            });
            const data= await response.json();
            console.log("response is :",response);
            console.log("data is :",data);
            if (!response.ok) 
                throw new Error(data.message || 'Failed to delete book');
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookid));
            alert("book deleted succesfully")
            setIsModalOpen(false);
            
}
catch(error){
    // console.error('Error deleting book:', error);
    alert(error.message);
    setIsModalOpen(false)
}
        
   }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Fetch books and categories on component mount or when dependencies change
    useEffect(() => {
        fetchBooks();
    }, [selectedCategory, currentPage]);
  return (
     <>
      <div className="container mx-auto p-4">
            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Category:</label>
                <select
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    value={selectedCategory}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All</option>
                    {catego.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={` ${book.image}`}
                            alt={book.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                           <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={()=>{setIsModalOpen(true); setBookid(book._id)}}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded-md ${
                            currentPage === i + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
        {isModalOpen && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50" 
      onClick={() => {}} // Prevent closing on backdrop click
    ></div>

    {/* Modal */}
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] h-[250px]">
        <h2 className="text-2xl font-bold mb-4 text-center mt-[30px]">Are you sure?</h2>
        <div className="flex justify-between">
          <button 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-[50px]"
            onClick={()=>handledelete()}
          >
            Delete
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  mt-[50px]"
            onClick={()=>{setIsModalOpen(false)}} // Add your cancel logic here
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
)}
     </>
  )
}

export default Delete