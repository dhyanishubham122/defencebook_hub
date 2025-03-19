import React, { useState, useEffect } from 'react';
import BookCard from '../components/bookcard';
import axios from 'axios';

function Book() {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');  // Store "No results found" message
    const [featuredbooks,setFeaturedbooks]=useState([]);
    const [filters, setFilters] = useState({
        author: '',
        title: '',
        category: '',
    });
    const queryparam=new URLSearchParams(location.search);
    const category=queryparam.get("category");
    console.log("dfgsdhd category is:",category);
    useEffect(() => {
        const fetchFeaturedBooks = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/book`); 
                setBooks(response.data);
                if (category) {
                    setFeaturedbooks(response.data.filter(book => book.category === category));
                } else {
                    setFeaturedbooks(response.data);
                }
                setError('');  // Clear error on successful fetch
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchFeaturedBooks();   
    }, [category]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSearch = async () => {
        try {
            const filteredParams = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value)
            );
            const queryParams = new URLSearchParams(filteredParams).toString();
            const url = `${apiUrl}/user/book?${queryParams}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("No results found.");
            }

            const data = await response.json();

            if (data.length === 0) {
                setError("No books found matching your criteria.");
                setFeaturedbooks([]);  // Clear books list
            } else {
                setFeaturedbooks(data);
                setError("");  // Clear error if results are found
            }
        } catch (error) {
            setError("No books found matching your criteria.");  
            setFeaturedbooks([]); // Ensure books are cleared when no result is found
            console.error("Error fetching books:", error.message);
        }
    };

    return (
        <>
            <div className="shadow-md lg:p-[120px] p-6 md:p-12 flex flex-col bg-gray-700/70">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-10 lg:mt-0 mt-12 text-white font-semibold italic">
                    Filter your Search
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Filter by Author</label>
                        <select
                            name="author"
                            value={filters.author}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Any Author</option>
                            {books.map((author, index) => (
                                <option key={index} value={author.author}>{author.author}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Filter by Book Name</label>
                        <select
                            name="title"
                            value={filters.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Any Title</option>
                            {books.map((title, index) => (
                                <option key={index} value={title.title}>{title.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Filter by Category</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Any Category</option>
                            {books.map((cat, index) => (
                                <option key={index} value={cat.category}>{cat.category}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleSearch}
                    className="mt-5 w-[200px] self-center md:self-end bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Search
                </button>
            </div>

            {/* Show error message if no results */}
            {error && (
                <div className="text-red-500 text-lg text-center mt-6">
                    {error}
                </div>
            )}

            {/* Book List */}
            <div className="grid grid-cols-1 pt-4 md:grid-cols-3 gap-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
                {featuredbooks.length > 0 ? (
                    featuredbooks.map((book) => (
                        <div key={book._id} className="flex justify-center max-w-[300px] mx-auto pb-[100px]">
                            <BookCard book={book} />
                        </div>
                    ))
                ) : null}
            </div>
        </>
    );
}

export default Book;
