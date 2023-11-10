import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Utilisateur = () => {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const userIdCookie = Cookies.get('userId');

  const loadImages = async () => {
    try {
      if (userIdCookie) {
        const { data: userFavorites, error } = await supabase
          .from('favoris')
          .select('url_images, api_image_id') 
          .filter('id_user', 'eq', userIdCookie);

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

  useEffect(() => {
    if (userIdCookie) {
      loadImages();
    } else {
      router.push('/login');
    }
  }, [userIdCookie, router]);

  const deconnecterUtilisateur = () => {
    Cookies.remove('mon_cookie_auth');
    router.push('/login');
  };

  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1">Utilisateur</h1>
      <button onClick={deconnecterUtilisateur} className="text-blue-600 hover:text-blue-900 ml-4">
        Se déconnecter
      </button>
      <div className="p">Compte utilisateur</div><br></br>
      <div className="p">Image liké</div>
      <div className="flex flex-wrap justify-center mt-8 gap-y-4">
        <div className="w-1/5 mx-auto">
          {images.map((image) => (
            <Link key={image.api_image_id} href={`/ID/${image.api_image_id}`} passHref>
              <img
                key={image.id}
                src={image.src}
                className="rounded-md shadow-lg cursor-pointer transition-transform duration-500 transform hover:scale-105 m-2"
                alt={image.alt}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="p">commentaire</div>
    </div>
  );
};


export default Utilisateur;
