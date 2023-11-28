import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useRouter } from 'next/router';

const Utilisateur = () => {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/account/login');
      } else {
        setLoading(true);
        loadImages(); 
      }
    });
  }, []);

  const loadImages = async () => {
    try {
      const { user, session } = supabase.auth;
      if (user) {
        const { data: userFavorites, error } = await supabase
          .from('favoris')
          .select('url_images, api_image_id')
          .filter('id_user', 'eq', session.user.id);

        if (!error) {
          const favoriteImages = userFavorites.map((favorite, index) => ({
            id: index,
            src: favorite.url_images,
            alt: `Favorite Image ${index}`,
            api_image_id: favorite.api_image_id,
          }));

          setImages(favoriteImages);
          setTotalPages(Math.ceil(favoriteImages.length / itemsPerPage));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deconnecterUtilisateur = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.push('/account/login');
    }
  };

  if (loading)
    return (
      <div className={`bg-light dark:bg-dark p-8`}>
        <div className="content-center mb-4">
          <h1 className="text-3xl text-center font-bold ">Compte Utilisateur</h1>
          <button onClick={deconnecterUtilisateur} className="bg-gray-800 text-white px-4 py-2 rounded-md">
            Se déconnecter
          </button>
        </div>

        <div className="mb-4">
          <h2 className="h2">Images Likées</h2>
          <div className="flex flex-wrap justify-center mt-8 gap-y-4">
            {images.map((image) => (
              <div key={image.id} className="w-1/5 mx-auto">
                <img src={image.src} alt={image.alt} className="rounded-lg shadow-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default Utilisateur;
