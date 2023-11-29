import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import supabase from '../../supabase';

function AlbumPage() {
  const router = useRouter();
  const { album } = router.query;
  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const { data: albumData, error } = await supabase
          .from('album')
          .select('id, name_liste, description_liste, username, link_image_album(id_album, url)')
          .eq('id', album)
          .single();

        if (error) {
          throw error;
        }

        setAlbumData(albumData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'album:', error);
      }
    };

    if (album) {
      fetchAlbumData();
    }
  }, [album]);

  const handleDeleteMedia = async (mediaId) => {
    try {
      // Ajoutez ici le code pour supprimer le média de la base de données
      // Utilisez supabase.from('votreTable').delete().eq('id', mediaId);
      // Assurez-vous de mettre à jour l'état local pour refléter les changements
    } catch (error) {
      console.error('Erreur lors de la suppression du média:', error);
    }
  };

  const handleEditMedia = async (mediaId) => {
    // Ajoutez ici le code pour la fonction d'édition du média si nécessaire
  };

  if (!albumData) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div className="bg-light dark:bg-dark">
      <h1 className="h1 mb-3">{albumData.name_liste}</h1>
      <p className="text-gray-600 mb-4">Description : {albumData.description_liste}</p>
      <p className="text-gray-500 mb-4">Créé par : {albumData.username}</p>

      <div className="flex flex-wrap">
  {albumData.media && albumData.media.map((media) => (
    <div key={media.id} className="m-2">
      <img
        src={media.url}
        alt={`Media ${media.id}`}
        className="rounded-md"
      />
    </div>
  ))}
</div>


      <Link href="/album">
        <button className="text-blue-500 mt-4 block">Retour à la liste des albums</button>
      </Link>
    </div>
  );
}

export default AlbumPage;
