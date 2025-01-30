import React from 'react'
import { useEffect,useState } from 'react'
function Update() {
 const categories=['war','victories','training','defence','terrorism','officertalk','other']
 const [books,setBooks]=useState([]);
 const [selectedCategory,setSelectedCategory]=useState('');
  const [currentPage,setCurrentPage]=useState(1);
  const[totalPage,setTotalPage]=useState(1);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [bookId,setBookId]=useState("");
  const [image, setImage] = useState(null); // Store the image file
  const [imagePreview, setImagePreview] = useState(null); // Store the preview URL
  const [purchasedLinkUrl, setPurchasedLinkUrl] = useState("");
  console.log("vook id",bookId);
 
  // console.log("ismodal:",isModalOpen);
  // console.log("ajhsfgjd");
 
  const fetchbooks=async()=>{
    try{
    const response=await fetch(`http://localhost:4000/admin/books?category=${selectedCategory}&page=${currentPage}&limit=9`,
      {
        method:'GET',
        headers:{
          'Content-Type':'application/json',

      }
    }
    )
    if(!response.ok)
      throw new Error('Failed to fetch books');
    const data=await response.json();
    console.log("dasf:",data);
    setBooks(data.books);
  }
  catch(err){
    console.log(err);
  }
  }
  useEffect(() => {
    fetchbooks();
    }, [currentPage,selectedCategory]);
  const handlecatchnage=(category)=>{
    setSelectedCategory(category);
    setCurrentPage(1);
    console.log(category);
  }

  const handelImagechange=((e)=>{
    console.log("file object is:",e.target.files);
    setImage(e.target.files[0]);
  })
  const hadlecategorychange=((e)=>{
    console.log("category is:",e.target.value);
    setCategory(e.target.value);
  })
  const handleformsubmit=(e)=>{
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
 console.log("form data is :",formData);
 for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
  }

  return (
    <>
    <div className="container mx-auto p-4">
        <div className='mb-4'>
          <label className="block text-sm font-medium text-gray-700">Category:</label>'
          <select
                    onChange={(e) =>  handlecatchnage(e.target.value)}
                    value={selectedCategory}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >            <option value="">Select Category</option>
            {categories.map((category)=>{
              return(
                <option key={category} value={category}>{category}</option>
              )
            })}
          </select>
        </div>
        {books.map((book)=>(
 <div  key={book.id} className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
 <img
                            src={`http://localhost:4000/${book.image}`}
                            alt="http://localhost:4000/uploads/1737871664559-image (2).png"
   className="w-full h-48 object-cover"
 />
 <div className="p-4 flex item-center justify-between">
   <h3 className="text-xl font-semibold text-gray-800 truncate">{book.title}</h3>
   <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={()=>{setIsModalOpen(true); setBookId(book._id);}} >UPDATE</button>
 </div>
</div>
        ))}

        {/* modal  for boo update*/}
        {
          isModalOpen && (
            
  
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh]  overflow-hidden flex flex-col">
  <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Enter Book Details</h2>
          
        </div>
    <form className="overflow-y-auto flex-1" onSubmit={handleformsubmit}>
      <div className="mb-4">

        {books.map((book)=>{
          return(
            <div key={book.id}>
              <label className="block text-sm font-medium text-gray-700" >Id:{book._id}</label>
             </div>
          )
        })}
        <label className="block text-sm font-medium text-gray-700" value={title} onChange={(e)=>{setTitle(e.target.value)}}>Title</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter title"
        />
        <label className="block text-sm font-medium text-gray-700" value={author} onChange={(e)=>{setAuthor(e.target.value)}}>Author</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter author"
        />
    <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        

                          
                        <select id="category" value={category} onChange={hadlecategorychange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select category</option>
                            {categories.map((category)=>{
                              return(
                            <option  key= {category} value={category}>{category}</option>
                              )
                          })}
                            
                        </select>
      <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter description"
          rows="4"
        />
      <label className="block text-sm font-medium text-gray-700">PDF URL</label>
        <input
          type="text"
          value={pdfUrl} onChange={(e)=>{setPdfUrl(e.target.value)}}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter pdf url"
        />
         <label className="block text-sm font-medium text-gray-700">Purchased Link URL</label>
        <input
          type="text"
          value={purchasedLinkUrl} onChange={(e)=>{setPurchasedLinkUrl(e.target.value)}}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter pdf url"
        />
        <label className='block text-sm font medium text-gray-700'>Image</label>
        <input type="file"             accept="image/*"
  onChange={handelImagechange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
  


      <div className="flex justify-end">
        <button
          type="button"
          onClick={()=>setIsModalOpen(false)}
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
          )
        } 



       {/* end */}

        {/* pagination */}
        <div className="flex justify-center mt-4">
          
           

          
        </div>
       


    </div>
    </>
  )
}

export default Update