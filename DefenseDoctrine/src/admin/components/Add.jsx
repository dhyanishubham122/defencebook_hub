import React, { useState, useRef } from "react";

const Add = () => {
  // State to manage form data
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [image, setImage] = useState(null); // Store the image file
  const [imagePreview, setImagePreview] = useState(null); // Store the preview URL
  const [purchasedLinkUrl, setPurchasedLinkUrl] = useState("");
  const tokendata = JSON.parse(localStorage.getItem("admin"));
  const token = tokendata ? tokendata.token : null;
  const fileinputRef = useRef(null);
  const pdfInputRef = useRef(null); // Add this line

  const categories = [
    "war",
    "victories",
    "training",
    "defence",
    "terrorism",
    "officertalk",
    "other",
  ];

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Admin token not found. Please log in.");
      return;
    }

    // Create a FormData object to send the file and other form data
    const data = new FormData();
    data.append("title", title);
    data.append("author", author);
    data.append("description", description);
    data.append("category", category);
    data.append("rating", rating);
    data.append("pdf", pdfUrl); // Append the PDF file
    data.append("image", image); // Append the image file
    data.append("purchasedLinkUrl", purchasedLinkUrl);

    try {
      const response = await fetch("http://localhost:4000/admin/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
        body: data, // Send the FormData object
      });

      if (!response.ok) {
        throw new Error("Failed to add data");
      }

      const result = await response.json();
      console.log("Data added successfully:", result);
      alert("Data added successfully!");

      // Reset the form after successful submission
      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setRating("");
      setPdfUrl(null);
      setImage(null);
      setImagePreview(null); // Reset the image preview
      setPurchasedLinkUrl("");
      if (fileinputRef.current) fileinputRef.current.value = ""; // Reset the image file input
      if (pdfInputRef.current) pdfInputRef.current.value = ""; // Reset the PDF file input
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add data. Please try again.");
    }
  };

  // Handle image file change and update preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Update the image state

    if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = () => {
        setImagePreview(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    } else {
      setImagePreview(null); // Clear the preview if no file is selected
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdfUrl(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Add New Book
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Author:
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating:
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PDF URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PDF URL:
            </label>
            <input
              type="file"
              accept="application/pdf"
              ref={pdfInputRef}
              onChange={handlePdfChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image:
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileinputRef}
              onChange={handleImageChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <p className="text-sm font-medium text-gray-700">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Purchased Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchased Link URL:
            </label>
            <input
              type="url"
              value={purchasedLinkUrl}
              onChange={(e) => setPurchasedLinkUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;