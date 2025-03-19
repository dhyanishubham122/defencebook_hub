import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// ✅ Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Bookdetails() {
  const [book, setBook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(""); 
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const pdfViewerRef = useRef();

  const queryparam = new URLSearchParams(window.location.search);
  const title = queryparam.get("title");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/user/book?title=${title}`);
        if (response.data.length > 0) {
          setBook(response.data[0]);
          setPdfUrl(encodeURI(`http://localhost:4000/${response.data[0].pdfUrl}`));
        } else {
          setBook(null);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    };

    if (title) {
      fetchBook();
    }
  }, [title]);

  // 🛠 Dynamically adjust scale based on container width
  useEffect(() => {
    const updateScale = () => {
      if (pdfViewerRef.current) {
        const containerWidth = pdfViewerRef.current.clientWidth;
        setScale(containerWidth / 800); // Normalize scale (800 is a reference width)
      }
    };

    updateScale(); // Initial call
    window.addEventListener("resize", updateScale); // Listen for resizes
    return () => window.removeEventListener("resize", updateScale); // Cleanup
  }, []);

  if (!book) return <p className="text-center text-gray-500 mt-10">Loading or book not found...</p>;
  if (!pdfUrl) return <p className="text-center text-gray-500 mt-10">PDF not available...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-16 bg-gray-400 p-4">
      
      {/* Book Details Section */}
      <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
  {/* Background Image with Overlay */}
  <div 
    className="absolute inset-0 bg-cover bg-center filter brightness-75" 
    style={{ backgroundImage: `url(http://localhost:4000/${book.image})` }}>
  </div>

  {/* Glassmorphic Book Details Card */}
  <div className="relative bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center">
    {/* Book Cover Image */}
    <div className="w-48 h-64 md:w-56 md:h-72 overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
      <img 
        src={`http://localhost:4000/${book.image}`} 
        alt={book.title} 
        className="w-full h-full object-cover"
      />
    </div>

    {/* Book Details */}
    <div className="md:ml-8 flex-1 text-center md:text-left">
      <h1 className="text-4xl font-bold text-white drop-shadow-lg">{book.title}</h1>
      <h2 className="text-lg text-indigo-300 font-semibold mt-2">By {book.author}</h2>

      {/* Animated Divider */}
      <div className="w-24 h-1 bg-indigo-400 rounded-full my-4 animate-pulse"></div>

      <p className="text-white text-lg leading-relaxed">
        {book.description.length > 200 ? book.description.substring(0, 200) + "..." : book.description}
      </p>

      {/* Call-to-Action Buttons */}
      <div className="mt-6 flex justify-center md:justify-start space-x-4">
        <a 
          href={book.purchasedLinkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300">
          🛒 Purchase Link
        </a>

        <button 
          className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-indigo-600 transition-all duration-300">
          ⭐ Add to Wishlist
        </button>
      </div>
    </div>
  </div>
</div>


      {/* PDF Viewer Section */}
      <div className="w-full max-w-4xl p-4 mt-10 bg-white rounded-lg shadow-lg border border-gray-200">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          {/* Zoom Controls */}
          <div className="flex space-x-2">
            <button onClick={() => setScale(scale + 0.2)} className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition">
              ➕ Zoom In
            </button>
            <button onClick={() => setScale(scale > 0.6 ? scale - 0.2 : 0.6)} className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-600 transition">
              ➖ Zoom Out
            </button>
          </div>

          {/* Print & Download */}
          <div className="flex space-x-2">
            <button onClick={() => window.open(pdfUrl, "_blank")} className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-700 transition">
              🖨️ Print
            </button>
            <button onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = `${book.title}.pdf`;
              link.click();
            }} className="px-4 py-2 bg-purple-400 text-white rounded-md hover:bg-purple-600 transition">
              ⬇️ Download
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div ref={pdfViewerRef} className="border border-gray-300 shadow-md bg-gray-400 p-4 rounded-lg w-full overflow-auto">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error("PDF Load Error:", error)}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button 
            onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1)} 
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
            ⬅️ Prev
          </button>
          <span className="text-lg font-bold text-gray-700">
            Page {pageNumber} / {numPages || "?"}
          </span>
          <button 
            onClick={() => setPageNumber(pageNumber < numPages ? pageNumber + 1 : numPages)} 
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bookdetails;
