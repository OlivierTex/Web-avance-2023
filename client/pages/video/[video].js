import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';
import supabase from '../../supabase';

const VideoPage = () => {
  const router = useRouter();
  const { video } = router.query;
  const [videoData, setVideoData] = useState(null);
  const { user_session } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (video) {
        try {
          const response = await axios.get(`https://api.pexels.com/videos/videos/${video}`, {
            headers: {
              Authorization: 'Your-API-Key', // Remplacez par votre clé d'API Pexels
            },
          });
          setVideoData(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des données de la vidéo:', error.message);
        }
      }
    };

    fetchVideoData();
  }, [video]);

  const toggleLikeDislike = async () => {
    try {
      if (!user_session) {
        console.error('Utilisateur non connecté');
        router.push('/../account/login');
        return;
      }

      setIsLiked((prevIsLiked) => !prevIsLiked);

      const likeKey = `like_${user_session?.id}_${video}`;
      localStorage.setItem(likeKey, isLiked ? 'false' : 'true');

      const { data: existingFavorites, error: existingError } = await supabase
        .from('favoris')
        .select('url_images')
        .eq('id_user', user_session.id)
        .eq('url_images', video);

      if (existingError) {
        throw existingError;
      }

      if (isLiked) {
        // Suppression si la vidéo est déjà dans les favoris
        if (existingFavorites.length > 0) {
          const { data, error } = await supabase
            .from('favoris')
            .delete()
            .eq('id_user', user_session.id)
            .eq('url_images', video);

          if (error) {
            throw error;
          }

          console.log('Vidéo n\'est plus aimée!', data);
        }
      } else {
        // Ajout si la vidéo n'est pas dans les favoris
        if (existingFavorites.length === 0) {
          const { data, error } = await supabase
            .from('favoris')
            .insert([
              { like_boolean: false, id_user: user_session.id, url_images: video, api_image_id: video },
            ]);

          if (error) {
            throw error;
          }

          console.log('Vidéo aimée!', data);
        } else {
          console.log('Cette combinaison user_session.id et video existe déjà dans la table favoris.');
        }
      }
    } catch (error) {
      console.error('Erreur lors du basculement like/dislike:', error.message);
    }
  };

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* ... (affichage des détails de la vidéo) */}
      <button onClick={toggleLikeDislike}>
        {isLiked ? 'Dislike' : 'Like'}
      </button>
    </div>
  );
};

export default VideoPage;
