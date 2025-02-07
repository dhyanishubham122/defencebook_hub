import React from 'react';

const QuotesSection = () => {
  const quotes = [
    {
      text: "Bravery is what makes you capable for war.",
      author: "PARA SF",
    },
    {
      text: "Touch the Sky with Glory! Nabha Sparsham Deeptam",
      author: "AIRFORCE",
    },
    {
      text: "Sham No Varunah! May the Lord of Water be auspicious to us!",
      author: "INDIAN NAVY",
    },
    {
      text: "Badri Vishal Ki Jai! Victory to Lord Badri Vishal",
      author: "Garhwal Rifles Regiment",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {quotes.map((quote, index) => (
          <div
            key={index}
            className="relative bg-gray-800/80 backdrop-blur-md rounded-lg p-8 hover:bg-gray-800/90 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-700 shadow-lg hover:shadow-xl"
          >
            <p className="text-white text-2xl font-semibold italic">
              "{quote.text}"
            </p>
            <p className="mt-4 text-white/80 text-right text-lg">- {quote.author}</p>
            <div className="absolute inset-0 border-2 border-transparent hover:border-gray-600/50 rounded-lg pointer-events-none transition-all duration-300 ease-in-out"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotesSection;