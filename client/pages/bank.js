import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bank() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [images, setImages] = useState([]); 
  const [randomImages, setRandomImages] = useState([]); 
  const apiKey = '2vzVSb3MiYTutC5TeAiwIn8rGEZBoyhbbBws2jTY4bZq34GJhY8vOz5U';
  useEffect(() => {
    const getRandomImages = async () => {
      const randomApiUrl = 'https://api.pexels.com/v1/curated?per_page=10';

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
    const apiUrl = `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=10`;

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
    <div>
      <h1 className="h1">Banque d'image</h1>
      <p className="paragraphe">Découvrez notre sélection de photos de haute qualité.</p>

      <div className="mt-8">
        <div>
          <form onSubmit={handleSearch} id="form">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchTerm('')} 
                onBlur={() => setSearchTerm('Recherche...')}
              />
              <input type="submit" className="bouton-sumbit" id="search" value="Rechercher" />
            </div>
            <div className="form-group">
              
            </div>
          </form>
        </div>

        <div>
          {searchTerm === '' ? (
            randomImages.map((image) => (
              <img key={image.id} src={image.src.medium} alt={image.url} />
            ))
          ) : (
            images.map((image) => (
              <img key={image.id} src={image.src.medium} alt={image.url} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Bank;
