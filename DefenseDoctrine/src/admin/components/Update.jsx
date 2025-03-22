import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // For toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

function Update() {
  const apiUrl = import.meta.env.VITE_API_URL;
    
  const categories = ['war', 'victories', 'training', 'defence', 'terrorism', 'officertalk', 'other'];
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [bookId, setBookId] = useState("");
  const [image, setImage] = useState(null); // Store the image file
  const [imagePreview, setImagePreview] = useState(null); // Store the preview URL
  const [purchasedLinkUrl, setPurchasedLinkUrl] = useState("");
  const fileInputRef = useRef(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/books?category=${selectedCategory}&page=${currentPage}&limit=9`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data.books);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategoryChangeForm = (e) => {
    setCategory(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("rating", rating);
    formData.append("pdfUrl", pdfUrl);
    formData.append("image", image); // Append the image file
    formData.append("purchasedLinkUrl", purchasedLinkUrl);
    
    const tokenData = JSON.parse(localStorage.getItem('admin'));
    const token = tokenData.token;

    try {
      const response = await fetch(`${apiUrl}/admin/updatebook/${bookId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update book');

      // Clear form
      setTitle('');
      setAuthor('');
      setCategory('');
      setDescription('');
      setImage(null);
      setPdfUrl('');
      setPurchasedLinkUrl('');
      fileInputRef.current.value = ''; // Clear the file input
      setIsModalOpen(false);

      toast.success('Book updated successfully!');
      fetchBooks();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <select
            onChange={(e) => handleCategoryChange(e.target.value)}
            value={selectedCategory}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
              <img
                src={`${book.image}`}
                alt="book cover"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 truncate">{book.title}</h3>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => { setIsModalOpen(true); setBookId(book._id); }}
                >
                  UPDATE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for book update */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Enter Book Details</h2>
                <button className="text-xl font-bold text-gray-600 hover:text-gray-800" onClick={()=>{setIsModalOpen(false)}}>×</button>
              </div>
              <form className="overflow-y-auto flex-1" onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter title"
                  />
                  <label className="block text-sm font-medium text-gray-700">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter author"
                  />
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={handleCategoryChangeForm}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter description"
                    rows="4"
                  />
                  <label className="block text-sm font-medium text-gray-700">PDF URL</label>
                  <input
                    type="text"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter pdf url"
                  />
                  <label className="block text-sm font-medium text-gray-700">Purchased Link URL</label>
                  <input
                    type="text"
                    value={purchasedLinkUrl}
                    onChange={(e) => setPurchasedLinkUrl(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter purchased link URL"
                  />
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Update;
