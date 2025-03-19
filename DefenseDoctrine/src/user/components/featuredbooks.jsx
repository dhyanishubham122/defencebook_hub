import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Swiper styles
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import BookCard from '../components/bookcard';

const App = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/book`); // Replace with your API endpoint
        setFeaturedBooks(response.data);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-center mb-16 text-6xl md:text-7xl text-white font-semibold italic">
          Featured Books
        </h1>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2000, // Autoplay delay in milliseconds (2 seconds)
            disableOnInteraction: false, // Continue autoplay even after user interaction
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {featuredBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <div className="flex justify-center max-w-[300px] mx-auto">
                <BookCard book={book} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default App;