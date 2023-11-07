import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAPIKey, getAPIBaseURL } from '../../API/API_pexels';

const ImageDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [imageDetails, setImageDetails] = useState(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchImageDetails = async () => {
      const apiKey = getAPIKey(); 
      const baseUrl = getAPIBaseURL();
      const url = `${baseUrl}photos/${id}`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: apiKey,
          },
        });
        setImageDetails(response.data);
      } catch (error) {
        console.error('Fetching image details failed:', error);
      }
    };

    fetchImageDetails();
  }, [id, router.isReady]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isImageFullscreen && e.target.tagName !== 'IMG') {
        toggleFullscreen();
      }
    };

    if (isImageFullscreen) {
      document.addEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [isImageFullscreen]);

  const toggleFullscreen = () => {
    setIsImageFullscreen(!isImageFullscreen);
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  if (!imageDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="h-screen flex flex-col items-center justify-center">
          <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          <p><strong>Image Name:</strong> {imageDetails.alt}</p>
          <br></br>
          <div 
            onClick={toggleFullscreen} 
            className="cursor-pointer"
          >
            <img src={imageDetails.src.original} alt={imageDetails.alt} className="w-auto h-auto object-cover mx-auto max-h-screen mb-4 cursor-pointer border-4 border-custom1" />
          </div>
          <div className="text-center">
            <p><strong>Photographer:</strong> {imageDetails.photographer}</p>
            <p><strong>Photographer URL:</strong> <a href={imageDetails.photographer_url} target="_blank" rel="noreferrer">{imageDetails.photographer_url}</a></p>
            <p><strong>Image URL:</strong> <a href={imageDetails.url} target="_blank" rel="noreferrer">{imageDetails.url}</a></p>
            <p><strong>Dimensions:</strong> {imageDetails.width} x {imageDetails.height}</p>
          </div>
          <br></br>
          <button 
            onClick={() => handleDownload(imageDetails.src.original, `${imageDetails.alt}.jpeg`)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Image
          </button>
          
        </div>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      </div>
  
      {isImageFullscreen && (
        <div 
          className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-75 flex justify-center items-center" 
          onClick={toggleFullscreen} 
        >
          <div className="relative">
            <img 
              src={imageDetails.src.original} 
              alt={imageDetails.alt} 
              className="h-screen mx-auto" 
            />
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                toggleFullscreen();
              }} 
              className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ImageDetail;
