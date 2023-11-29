import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAPIKey, getAPIBaseURL } from '../API/API_pexels';

import { useRouter } from 'next/router';

function Home() {
  const [randomImage, setRandomImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomImage = async () => {
      const randomPage = Math.floor(Math.random() * 1000) + 1;
      const baseUrl = getAPIBaseURL();
      const apiUrl = `${baseUrl}curated?per_page=1&page=${randomPage}`;
      const apiKey = getAPIKey();

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: apiKey,
          },
        });
        const randomPhoto = response.data.photos[0];
        setRandomImage(randomPhoto); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandomImage();
  }, []);

  if (!randomImage) {
    return <div>Loading...</div>;
  }

  const handleImageClick = () => {
    router.push(`/id/${randomImage.id}`);
  };

  return (
    <div className="bg-light dark:bg-dark min-h-screen">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome to our site</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">Discover our selection of high-quality photos.</p>
        <div className="flex justify-center mt-8">
          <img 
            src={randomImage.src.large} 
            alt="Random" 
            className="rounded shadow-lg cursor-pointer" 
            onClick={handleImageClick}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
