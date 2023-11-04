import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/navigation';

function Home() {
  const [randomImage, setRandomImage] = useState(null);
  const apiKey = '2vzVSb3MiYTutC5TeAiwIn8rGEZBoyhbbBws2jTY4bZq34GJhY8vOz5U';

  useEffect(() => {
    const fetchRandomImage = async () => {
      const randomPage = Math.floor(Math.random() * 1000) + 1;
      const apiUrl = `https://api.pexels.com/v1/curated?per_page=1&page=${randomPage}`;

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: apiKey,
          },
        });
        const randomPhoto = response.data.photos[0]; 
        setRandomImage(randomPhoto.src.large); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandomImage();
  }, []); 
  return (
    <div className="bg-light dark:bg-dark min-h-screen">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Bienvenue sur notre site</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">Découvrez notre sélection de photos de haute qualité.</p>
        {randomImage && (
          <div className="flex justify-center mt-8">
            <img src={randomImage} alt="Random" className="rounded shadow-lg"/>
          </div>
        )}
        <br></br>
        <Navigation />
      </div>
    </div>
  );
}

export default Home;
