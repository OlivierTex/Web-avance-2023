import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bank() {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [randomImages, setRandomImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const apiKey = '2vzVSb3MiYTutC5TeAiwIn8rGEZBoyhbbBws2jTY4bZq34GJhY8vOz5U'; 
  const itemsPerPage = 16;

  useEffect(() => {
    loadImages(currentPage);
  }, [currentPage]);

  const loadImages = async (page) => {
    const baseUrl = 'https://api.pexels.com/v1/';
    const apiUrl = searchTerm === ''
      ? `${baseUrl}curated?per_page=${itemsPerPage}&page=${page}`
      : `${baseUrl}search?query=${searchTerm}&per_page=${itemsPerPage}&page=${page}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: apiKey,
        },
      });

      if (searchTerm === '') {
        setRandomImages(response.data.photos);
      } else {
        setImages(response.data.photos);
      }

      setTotalPages(Math.ceil(response.data.total_results / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    loadImages(1);
  };

  const handlePageClick = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-light dark:bg-dark">
      <h1 className="h1">Banque d'image</h1>
      <p className="paragraphe">Découvrez notre sélection de photos de haute qualité.</p>
      <br></br>
      <form onSubmit={handleSearch} className="flex justify-center mb-4">
      <select id="infoSelect" name="infos" onchange="reloadPageWithSelection()">
          <option value="info1">Mise en avant</option>
          <option value="info2">Like : Odre croissant</option>
          <option value="info3">Like : Odre décroissant</option>
          <option value="info4">Commentaire : Odre croissant</option>
          <option value="info5">Commentaire : Odre décroissant</option>
        </select>
        <input
          type="search"
          id="default-search"
          className="block p-4 pl-10 w-1/2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ml-4"
          placeholder="Search Mockups, Logos..."
          required
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md ml-4">
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

      <div className="flex justify-center items-center mt-4">
        {Array.from({ length: 5 }, (_, index) => index + 1).map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            disabled={currentPage === pageNumber}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Bank;
