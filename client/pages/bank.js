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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadImages(1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-light dark:bg-dark">
      <h1 className="h1">Banque d'image</h1>
      <p className="paragraphe">Découvrez notre sélection de photos de haute qualité.</p>
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
          {(searchTerm === '' ? randomImages : images).map((image) => (
            <img key={image.id} src={image.src.medium} alt={image.alt} className="rounded-md shadow-lg"/>
          ))}
        </div>
      </div>
            <br></br><br></br>
      <div className="flex justify-center mb-4">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
              className={`flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === 1 ? 'cursor-not-allowed dark:text-gray-600 dark:bg-gray-700' : ''}`}
              disabled={currentPage === 1}>
              Previous
            </button>
          </li>

          {Array.from({ length: 5 }, (_, index) => {
            let pageNumber = currentPage > 2 ? currentPage - 2 + index : index + 1;
            return (
              <li key={pageNumber}>
                <button onClick={() => handlePageClick(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                    currentPage === pageNumber 
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:text-white' 
                      : 'text-gray-500 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
                  {pageNumber}
                </button>
              </li>
            );
          })}

          <li>
            <button onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === totalPages ? 'cursor-not-allowed dark:text-gray-600 dark:bg-gray-700' : ''}`}
              disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Bank;
