import React, { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "../../supabase";
import { useAuth } from "../../components/AuthContext";

function Album() {
  const [albums, setAlbums] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const { user_session } = useAuth();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data: albumsData, error } = await supabase
          .from("album")
          .select("id, name_liste, description_liste, username");

        if (error) {
          throw error;
        }

        const albumsWithMedia = await Promise.all(
          albumsData.map(async (album) => {
            const { data: imageMedia, error: imageError } = await supabase
              .from("link_image_album")
              .select("id_image, id_album, url")
              .eq("id_album", album.id)
              .limit(5);

            const { data: videoMedia, error: videoError } = await supabase
              .from("link_video_album")
              .select("id_video, id_album, url,imagevideo")
              .eq("id_album", album.id)
              .limit(5);

            if (imageError || videoError) {
              throw imageError || videoError;
            }

            return {
              ...album,
              images: imageMedia || [],
              videos: videoMedia || [],
            };
          }),
        );

        setAlbums(albumsWithMedia);
      } catch (error) {
        console.error("Erreur lors de la récupération des albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) => {
    const searchFields = [album.username, album.name_liste];

    return searchFields.some((field) => {
      const fieldValue = field ? field.toLowerCase() : "";
      return fieldValue.includes(searchTerm.toLowerCase());
    });
  });

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handleCreateAlbum = async () => {
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("username")
      .eq("id", user_session.id)
      .single();

    const username = userData?.username;
    try {
      if (user_session.id) {
        const { data, error } = await supabase.from("album").insert([
          {
            id_user: user_session.id,
            name_liste: albumName,
            description_liste: albumDescription,
            username: username,
          },
        ]);

        if (!error) {
          console.log("Nouvel album créé avec succès:", data);
          setShowOptions(false);
          fetchUserAlbums();
        } else {
          console.error("Erreur lors de la création de l'album:", error);
        }
      }
    } catch (error) {
      console.error("Erreur dans handleCreateAlbum:", error);
    }
  };

  return (
    <div className="mx-auto w-4/5">
      <div className={`bg-light dark:bg-dark`}>
        <h1 className="h1 mb-3">Albums</h1>
        <p className="paragraphe mb-4">
          Créez vos propres albums avec notre large selection d'images et de
          vidéos
        </p>
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
            className="text-white bg-gray-100 px-4 py-2 rounded-md ml-4"
            onClick={() => setSearchTerm("")}
          >
            <img
              src="/images/delete-left-solid.svg"
              alt="Réinitialiser"
              className="w-6 h-6 mr-2"
            />
          </button>
          <div className="relative inline-block ">
            <button
              className="text-white bg-gray-100 px-4 py-2 rounded-md ml-4"
              onClick={handleButtonClick}
            >
              <img
                src="/images/folder-plus-solid.svg"
                alt="Créer un album"
                className="w-6 h-6 mr-2"
              />
            </button>
            {showOptions && (
              <div
                className={`absolute ${
                  showOptions ? "top-10" : "hidden"
                } right-0 bg-white border border-gray-300 p-2 rounded mr-3`}
              >
                <div className="mb-2">
                  <label
                    htmlFor="albumName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Création d'album
                  </label>
                  <div className="w-full border-b-2 border-black mb-2"></div>
                  <label
                    htmlFor="albumName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom de l'album:
                  </label>
                  <input
                    type="text"
                    id="albumName"
                    name="albumName"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className="mt-1 p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="albumDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description de l'album:
                  </label>
                  <textarea
                    id="albumDescription"
                    name="albumDescription"
                    value={albumDescription}
                    onChange={(e) => setAlbumDescription(e.target.value)}
                    className="mt-1 p-2 border rounded"
                  />
                </div>
                <div className="w-full border-b-2 border-black mb-2"></div>
                <button
                  className="bg-gray-800 text-white px-1 py-1 rounded-md ml-2 "
                  onClick={handleCreateAlbum}
                >
                  Créer un nouvel album
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredAlbums.map((album) => (
          <div key={album.id} className="comments-container p-6 rounded-md">
            <Link href={`/album/${album.id}`}>
              <div className="border p-6 rounded-md bg-white mb-1">
                <h2 className="text-xl font-bold mb-1">{album.name_liste}</h2>
                <p className="text-gray-600 mb-1">
                  Description : {album.description_liste}
                </p>
                <p className="text-gray-500 mb-1">Créé par : {album.username}</p>
                <p className="text-gray-600 ">
                  Image :
                </p>
                <div className="flex space-x-4 mb-4">
                  {album.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={`Image ${image.id}`}
                      className="w-24 h-24"
                    />
                  ))}
                </div>
                <p className="text-gray-600">
                  Video :</p>
                <div className="flex space-x-4">
                {album.videos.map((video) => (
                  <img
                    key={video.id}
                    src={video.imagevideo}
                    alt={`Video ${video.id}`}
                    className="w-24 h-24"
                  />
                ))}
              </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Album;
