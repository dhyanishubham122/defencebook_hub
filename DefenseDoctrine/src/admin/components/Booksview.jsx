import React, { useState, useEffect } from 'react';

const Booksview = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Fetch books and categories on component mount or when dependencies change
    useEffect(() => {
        fetchBooks();
    }, [selectedCategory, currentPage]);

  

    return (
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
                            src={`${apiUrl}/${book.image}`}
                            alt={book.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                            <p className="text-gray-600 mb-2">{book.author}</p>
                            <p className="text-gray-700 mb-4">{book.description}</p>
                            <p className="text-yellow-500 mb-2">Rating: {book.rating}</p>
                            <a
                                href={book.purchasedLinkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Buy Now
                            </a>
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
    );
};

export default Booksview;