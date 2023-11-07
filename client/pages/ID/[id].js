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

  const handleDownload = async (url, filename) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob', 
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error during image download', error);
    }
  };

  if (!imageDetails) {
    return <div>Loading...</div>;
  }

  return (
      <div className="body">
        <br></br>
          <div className="relative">
          <p className="text-center"><strong>Image Name:</strong> {imageDetails.alt}</p>
          <button 
            onClick={() => handleDownload(imageDetails.src.original, `${imageDetails.alt}.jpeg`)}
            className="absolute top-0 right-0 bg-gray-800 text-white px-2 py-1 rounded-md text-xs"
          >
            Download Image
          </button>
          </div>
             <br></br>
          <div onClick={toggleFullscreen} className="cursor-pointer">
            <img 
              src={imageDetails.src.original} 
              alt={imageDetails.alt} 
              className="w-auto h-auto object-cover mx-auto max-h-screen mb-4 cursor-pointer border-4 border-custom1" 
            />
          </div>
          <div className="space-y-2 text-center">
            <p>Photographer: {imageDetails.photographer}</p>
            <p>Photographer <a href={imageDetails.photographer_url} target="_blank" rel="noreferrer">{imageDetails.photographer_url}</a></p>
            <p>Image URL: <a href={imageDetails.url} target="_blank" rel="noreferrer">{imageDetails.url}</a></p>
            <p>Dimensions: {imageDetails.width} x {imageDetails.height}</p>
          </div>
          <br></br>
       
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
