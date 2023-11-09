import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAPIKey, getAPIBaseURL } from '../../API/API_pexels';
import supabase from '../../supabase';

const ImageDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [imageDetails, setImageDetails] = useState(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const addImageToDatabase = async (apiImageId) => {
    try {
      const { data: selectData, error: selectError } = await supabase
        .from('images')
        .select('*')
        .eq('api_image_id', apiImageId)
        .single();
  
      if (!selectData) {
        console.log('ID non trouvé. Ajout d\'une nouvelle entrée dans la table.');
        const { error: insertError } = await supabase
          .from('images')
          .insert([{ api_image_id: apiImageId, views: 1 }]);
  
        if (insertError) {
          console.error('Erreur lors de l’insertion de la nouvelle image :', insertError);
        } else {
          console.log('Nouvelle entrée ajoutée avec succès !');
        }
      } else {
        console.log('ID déjà existant dans la table.');
        const { error: updateError } = await supabase
          .from('images')
          .update({ views: selectData.views + 1 })
          .eq('api_image_id', apiImageId);
  
        if (updateError) {
          console.error('Erreur lors de la mise à jour des vues de l’image :', updateError);
        } else {
          console.log('Vues mises à jour avec succès !');
        }
      }
    } catch (error) {
      console.error('Erreur dans addImageToDatabase :', error);
    }
  };
  
  useEffect(() => {
    if (id) {
      addImageToDatabase(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchImageDetails = async () => {
      const apiKey = getAPIKey();
      const baseUrl = getAPIBaseURL();
      const url = `${baseUrl}/photos/${id}`;

      try {
        const response = await axios.get(url, {
          headers: { Authorization: apiKey },
        });
        setImageDetails(response.data);

      } catch (error) {
        console.error('Fetching image details failed:', error);
      }
    };

    if (router.isReady && id) {
      fetchImageDetails();
    }
  }, [id, router.isReady]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isImageFullscreen && e.target.tagName !== 'IMG') {
        setIsImageFullscreen(false);
      }
    };

    if (isImageFullscreen) {
      document.addEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      if (!isImageFullscreen) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isImageFullscreen]);

  const handleDownload = async (url, filename) => {
    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error during image download:', error);
    }
  };

  if (!imageDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="body">
      <div className="relative">
        <p className="text-center my-5">
          <strong>Image Name:</strong> {imageDetails.alt}
        </p>
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md ml-2 "> Like </button>
          <button onClick={() => handleDownload(imageDetails.src.original, `${imageDetails.alt}.jpeg`)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md ml-2"> Download Image </button>
        </div>
      </div>
      <div onClick={() => setIsImageFullscreen(!isImageFullscreen)} className="cursor-pointer">
        <img
          src={imageDetails.src.original}
          alt={imageDetails.alt}
          className="image-preview w-auto h-auto object-cover mx-auto max-h-screen mb-4 cursor-pointer border-4 border-custom1"
        />
      </div>
      <div className="space-y-2 text-center">
        <p>Photographer: {imageDetails.photographer}</p>
        <p>
          Photographer URL:{' '}
          <a href={imageDetails.photographer_url} target="_blank" rel="noreferrer">
            {imageDetails.photographer_url}
          </a>
        </p>
        <p>
          Image URL:{' '}
          <a href={imageDetails.url} target="_blank" rel="noreferrer">
            {imageDetails.url}
          </a>
        </p>
        <p>
          Dimensions: {imageDetails.width} x {imageDetails.height}
        </p>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md ">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">Commentaires</h2>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                <div className="ml-2 font-semibold">Utilisateur 1</div>
              </div>
              <p className="text-gray-700">Ceci est le premier commentaire.</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">B</div>
                <div className="ml-2 font-semibold">Utilisateur 2</div>
              </div>
              <p className="text-gray-700">Voici un autre commentaire.</p>
            </div>

          </div>
        </div>

      {isImageFullscreen && (
        <div
          className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-75 flex justify-center items-center"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative">
            <img src={imageDetails.src.original} alt={imageDetails.alt} className="fullscreen-image h-screen mx-auto" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsImageFullscreen(false);
              }}
              className="close-button absolute top-4 right-4 text-white text-3xl focus:outline-none"
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
