import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import supabase from '../supabase';

function Album() {
  const [albums, setAlbums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data: albumsData, error } = await supabase
          .from('album')
          .select('id, name_liste, description_liste, username');

        if (error) {
          throw error;
        }

        const albumsWithMedia = await Promise.all(
          albumsData.map(async (album) => {
            const { data: mediaData, error: mediaError } = await supabase
              .from('link_image_album')
              .select('id, id_album, url')
              .eq('id_album', album.id)
              .limit(5);

            if (mediaError) {
              throw mediaError;
            }

            return {
              ...album,
              media: mediaData || [],
            };
          })
        );

        setAlbums(albumsWithMedia);
      } catch (error) {
        console.error('Erreur lors de la récupération des albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) => {
    const searchFields = [album.username, album.name_liste];
  
    return searchFields.some((field) => {
      // Vérifier si le champ est null ou undefined avant d'appeler toLowerCase()
      const fieldValue = field ? field.toLowerCase() : '';
      return fieldValue.includes(searchTerm.toLowerCase());
    });
  });

  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1 mb-3">Albums</h1>
      <div className="w-4/5 mx-auto flex justify-center mb-2 dropdown rounded-md">
        <input
          type="search"
          id="default-search"
          className="block p-4 pl-10 w-1/3 text-sm text-gray-900 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ml-4"
          placeholder="Rechercher par nom d'utilisateur ou nom de liste..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="button"
          className="text-white bg-gray-800 px-4 py-2 rounded-md ml-4"
          onClick={() => setSearchTerm('')}
        >
          Réinitialiser
        </button>
      </div>
      {filteredAlbums.map((album) => (
        <div key={album.id} className="comments-container p-6 rounded-md ">
            <Link href={`/album/${album.id}`}>
            <div className="border p-6 rounded-md bg-white">
            
                <h2 className="text-xl font-bold">{album.name_liste}</h2>
                <p className="text-gray-600">Description : {album.description_liste}</p>
                <p className="text-gray-500">Créé par : {album.username}</p>
            
                <div className="flex space-x-4">
                    {album.media.map((media) => (
                    <img
                        key={media.id}
                        src={media.url}
                        alt={`Media ${media.id}`}
                        className="w-24 h-24"
                    />
                    ))}
                </div>
            </div>
            </Link>
        </div>
        ))}
    </div>
  );
}

export default Album;
