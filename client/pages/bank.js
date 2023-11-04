import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bank() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [images, setImages] = useState([]); 
  const [randomImages, setRandomImages] = useState([]); 
  const apiKey = '2vzVSb3MiYTutC5TeAiwIn8rGEZBoyhbbBws2jTY4bZq34GJhY8vOz5U'; 

  useEffect(() => {
    const getRandomImages = async () => {
      const randomApiUrl = 'https://api.pexels.com/v1/curated?per_page=16'; 

      try {
        const response = await axios.get(randomApiUrl, {
          headers: {
            Authorization: apiKey,
          },
        });

        setRandomImages(response.data.photos);
      } catch (error) {
        console.error(error);
      }
    };

    getRandomImages(); 
  }, []); 

  const handleSearch = async (e) => {
    e.preventDefault();
    const apiUrl = `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=16`; 
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: apiKey,
        },
      });

      setImages(response.data.photos); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-light dark:bg-dark">
      <h1 className="h1">Banque d'image</h1>
      <p className="paragraphe">Découvrez notre sélection de photos de haute qualité.</p>
      <br></br>
      <form onSubmit={handleSearch} className="flex justify-center mb-4">
        <input
          type="search"
          id="default-search"
          className="block p-4 pl-10 w-1/2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Search Mockups, Logos..."
          required
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded-md ml-4"
        >
          Rechercher
        </button>
      </form>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchTerm === '' ? (
            randomImages.map((image) => (
              <img key={image.id} src={image.src.medium} alt={image.alt} className="rounded-md shadow-lg"/>
            ))
          ) : (
            images.map((image) => (
              <img key={image.id} src={image.src.medium} alt={image.alt} className="rounded-md shadow-lg"/>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Bank;
