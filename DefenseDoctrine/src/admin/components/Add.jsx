import React, { useState } from "react";

const Add = () => {
  // State to manage form data
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [image, setImage] = useState(null); // Store the image file
  const [imagePreview, setImagePreview] = useState(null); // Store the preview URL
  const [purchasedLinkUrl, setPurchasedLinkUrl] = useState("");
  const tokendata = JSON.parse(localStorage.getItem("admin"));
  const token = tokendata.token;
 const categories=[
'war','victories','training','defence','terrorism','officertalk','other'
 ];
 const hadleCategoryChange=(e)=>{
  setCategory(e.target.value);
 }
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the file and other form data
    const data = new FormData();
    data.append("title", title);
    data.append("author", author);
    data.append("description", description);
    data.append("category", category);
    data.append("rating", rating);
    data.append("pdfUrl", pdfUrl);
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
      setPdfUrl("");
      setImage(null);
      setImagePreview(null); // Reset the image preview
      setPurchasedLinkUrl("");
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

  return (
    <div>
      <h1>Add New Item</h1>
      <form onSubmit={handleSubmit}>
        {/* Text Inputs */}
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label> Category:</label>
          <select id="category" value={category} onChange={hadleCategoryChange} required>
             <option value="disable">
               choose a category
             </option>
             {categories.map((cat,index)=>{
              return <option key={index} value={cat}>{cat}</option>
             })}
          </select>
          {/* <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          /> */}
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <label>PDF URL:</label>
          <input
            type="url"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // Use the new handler
            required
          />
        </div>
        {imagePreview && (
          <div>
            <p>Image Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "300px", borderRadius: "8px", marginTop: "10px" }}
            />
          </div>
        )}
        <div>
          <label>Purchased Link URL:</label>
          <input
            type="url"
            value={purchasedLinkUrl}
            onChange={(e) => setPurchasedLinkUrl(e.target.value)}
          />
        </div>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default Add;
