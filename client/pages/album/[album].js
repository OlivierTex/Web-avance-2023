import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import supabase from '../../supabase';

function AlbumPage() {
  const router = useRouter();
  const { album } = router.query;
  const [albumData, setAlbumData] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);
  const [newTitle, setNewTitle] = useState(''); 
  const [newDescription, setNewDescription] = useState(''); 

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const { data: albumData, error } = await supabase
          .from('album')
          .select('id, name_liste, description_liste, username')
          .eq('id', album)
          .single();

        if (error) {
          throw error;
        }

        setAlbumData(albumData);

        const { data: linkImageData, error: linkImageError } = await supabase
          .from('link_image_album')
          .select('id, id_image, url') 
          .eq('id_album', album);

        if (linkImageError) {
          throw linkImageError;
        }

        setAlbumImages(linkImageData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'album:", error);
      }
    };

    if (album) {
      fetchAlbumData();
    }
  }, [album]);

  const handleDeleteImage = async (imageId) => {
    try {
      const { data: linkImageData, error: linkImageError } = await supabase
        .from('link_image_album')
        .delete()
        .eq('id', imageId);

      if (linkImageError) {
        throw linkImageError;
      }

      setAlbumImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      await supabase
        .from('link_image_album')
        .delete()
        .eq('id_album', album);
  
      const { data, error } = await supabase
        .from('album')
        .delete()
        .eq('id', album);
  
      if (error) {
        throw error;
      }
  
      router.push('/album');
    } catch (error) {
      console.error("Erreur lors de la suppression de l'album:", error);
    }
  };

  const handleEditAlbum = async (newTitle, newDescription) => {
    try {
      const { data, error } = await supabase
        .from('album')
        .update({
          name_liste: newTitle,
          description_liste: newDescription,
        })
        .eq('id', album);

      if (error) {
        throw error;
      }

      setAlbumData((prevData) => ({
        ...prevData,
        name_liste: newTitle,
        description_liste: newDescription,
      }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'album:", error);
    }
  };

  if (!albumData || !albumImages) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div className="bg-light dark:bg-dark">
      <h1 className="h1 mb-3">{albumData.name_liste}</h1>
      <p className="text-gray-600 mb-4">Description : {albumData.description_liste}</p>
      <p className="text-gray-500 mb-4">Créé par : {albumData.username}</p>

      <div className="flex flex-wrap">
        {albumImages.map((image) => (
          <div key={image.id} className="m-2">
            <Link href={`/image/${image.id_image}`} passHref>
              <img
                src={image.url}
                alt={`Image ${image.id}`}
                className="rounded-md max-w-xs"
              />
            </Link>
            <button
              onClick={() => handleDeleteImage(image.id)}
              className="text-red-500 block mt-2"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <Link href="/album">
        <button className="text-blue-500 mt-4 block">Retour à la liste des albums</button>
      </Link>

      <div className="mt-4">
        <button onClick={handleDeleteAlbum} className="text-red-500">
          Supprimer l'album
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Éditer l'album</h2>
        <input
          type="text"
          placeholder="Nouveau titre"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border rounded-md p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Nouvelle description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border rounded-md p-2 mr-2"
        />
        <button onClick={() => handleEditAlbum(newTitle, newDescription)} className="text-blue-500">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

export default AlbumPage;
