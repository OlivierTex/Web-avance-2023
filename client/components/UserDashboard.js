import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "./AuthContext";
import Link from "next/link";

function Dashboard() {
  const { user_session } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("");

  const [initialUsername, setInitialUsername] = useState(username);
  const [initialEmail, setInitialEmail] = useState(email);
  const [initialBio, setInitialBio] = useState(bio);
  const [initialLanguage, setInitialLanguage] = useState(language);

  const [favorisAlbumData, setFavorisAlbumData] = useState([]);
  const [favorisImageData, setFavorisImageData] = useState([]);
  const [favorisVideoData, setFavorisVideoData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user_session) {
        const { data: users, error } = await supabase
          .from("user")
          .select("username, email, bio, language")
          .eq("id", user_session.id);

        if (error) {
          console.error(error);
        } else if (users.length > 0) {
          setUsername(users[0].username);
          setEmail(users[0].email);
          setBio(users[0].bio);
          setLanguage(users[0].language);

          setInitialUsername(users[0].username);
          setInitialEmail(users[0].email);
          setInitialBio(users[0].bio);
          setInitialLanguage(users[0].language);
        }
      }
    };

    fetchUserData();
    fetchFavorisData();
  }, [user_session]);

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    // Mise à jour des paramètres utilisateurs | un update du type_compte (admin/user) par un user déclenchera un trigger qui refusera la requête
    const { error } = await supabase
      .from("user")
      .update({
        username: username,
        email: email,
        bio: bio,
        language: language,
      })
      .eq("id", user_session.id);

    if (error) {
      console.error(error);
      let errorMessage = "";

      switch (error.message) {
        case 'duplicate key value violates unique constraint "user_username_key"':
          errorMessage = "Le nom d'utilisateur est déjà utilisé.";
          break;
        default:
          errorMessage = "Une erreur inconnue s'est produite.";
      }

      alert(errorMessage);
    } else {
      console.log("User settings updated successfully");
      setInitialUsername(username);
      setInitialEmail(email);
      setInitialBio(bio);
      setInitialLanguage(language);
    }
  };

  const fetchFavorisData = async () => {
    try {
      const { data: imageData, error: imageError } = await supabase
        .from("favoris_image")
        .select("*")
        .eq("id_user", user_session.id);

      if (imageError) {
        throw imageError;
      }

      console.log("Favoris_image data:", imageData);

      const { data: videoData, error: videoError } = await supabase
        .from("favoris_video")
        .select("*")
        .eq("id_user", user_session.id);

      if (videoError) {
        throw videoError;
      }

      console.log("Favoris_video data:", videoData);

      const { data: albumsLikeData, likerror } = await supabase
        .from("favoris_album")
        .select("id_user,id_album")
        .eq("id_user", user_session.id);

      console.log("Favoris_album data:", albumsLikeData);

      if (likerror) {
        throw likerror;
      }

      const { data: albumsData, albumerror } = await supabase
        .from("album")
        .select("*")
        .in(
          "id",
          albumsLikeData.map((album) => album.id_album),
        );

      console.log("album data:", albumsData);

      if (albumerror) {
        throw albumerror;
      }

      const albumsWithMedia = await Promise.all(
        albumsData.map(async (album) => {
          if (album.id) {
            const { data: imageMedia, error: imageError } = await supabase
              .from("link_image_album")
              .select("id_image, id_album, url")
              .eq("id_album", album.id)
              .limit(5);

            console.log("album data:", imageMedia);

            const { data: videoMedia, error: videoError } = await supabase
              .from("link_video_album")
              .select("id_video, id_album, url, imagevideo")
              .eq("id_album", album.id)
              .limit(5);

            console.log("album data:", videoMedia);

            if (imageError || videoError) {
              throw imageError || videoError;
            }

            return {
              ...album,
              images: imageMedia || [],
              videos: videoMedia || [],
            };
          } else {
            console.error("L'album n'a pas d'id défini :", album);
            return null;
          }
        }),
      );

      setFavorisAlbumData(albumsWithMedia);
      setFavorisImageData(imageData);
      setFavorisVideoData(videoData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des favoris:",
        error,
      );
    }
  };

  return (
    <div>
      <div className="flex justify-start w-2/5 space-y-4 bg-gray-400 p-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Paramètres du compte</h2>
          <div
            className="grid grid-cols-3 gap-4 items-start"
            style={{ gridTemplateColumns: "1fr 5fr auto" }}
          >
            {/* Champ Username */}
            <label htmlFor="username" className="block text-right">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-2 border rounded ${
                username == initialUsername ? "bg-gray-300" : ""
              } `}
            />
            {username !== initialUsername ? (
              <button
                onClick={() => setUsername(initialUsername)}
                className="flex items-center justify-center mt-1"
              >
                <img
                  className="w-8 h-8"
                  src="/images/arrow-rotate-left-solid.svg"
                  alt="Reset"
                />
              </button>
            ) : (
              <div />
            )}

            {/* Champ Email */}
            <label htmlFor="email" className="block text-right ">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded ${
                email == initialEmail ? "bg-gray-300" : ""
              } `}
            />
            {email !== initialEmail ? (
              <button
                onClick={() => setEmail(initialEmail)}
                className="flex items-center justify-center mt-1"
              >
                <img
                  className="w-8 h-8"
                  src="/images/arrow-rotate-left-solid.svg"
                  alt="Reset"
                />
              </button>
            ) : (
              <div />
            )}

            {/* Champ Langue */}
            <label htmlFor="language" className="block text-right">
              Langue
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full p-2 border rounded ${
                language == initialLanguage ? "bg-gray-300" : ""
              }`}
            >
              <option value="Non renseigné">Non renseigné</option>
              <option value="Français">Français</option>
              <option value="English">English</option>
            </select>
            {language !== initialLanguage ? (
              <button
                onClick={() => setLanguage(initialLanguage)}
                className="flex items-center justify-center mt-1"
              >
                <img
                  className="w-8 h-8"
                  src="/images/arrow-rotate-left-solid.svg"
                  alt="Reset"
                />
              </button>
            ) : (
              <div />
            )}

            {/* Champ Bio */}
            <label htmlFor="bio" className="block text-right ">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full p-2 border rounded h-12 max-h-64 min-h-12 ${
                bio == initialBio ? "bg-gray-300" : ""
              } `}
            />
            {bio !== initialBio ? (
              <button
                onClick={() => setBio(initialBio)}
                className="flex items-center justify-center mt-1"
              >
                <img
                  className="w-8 h-8"
                  src="/images/arrow-rotate-left-solid.svg"
                  alt="Reset"
                />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end w-2/5 space-y-4 bg-gray-400 p-4">
        <button
          onClick={handleSaveChanges}
          className={`px-4 py-2 rounded text-white ${
            username === initialUsername &&
            email === initialEmail &&
            bio === initialBio &&
            language === initialLanguage
              ? "bg-gray-500"
              : "bg-green-600"
          }`}
          disabled={
            username === initialUsername &&
            email === initialEmail &&
            bio === initialBio &&
            language === initialLanguage
          }
        >
          Enregistrer
        </button>
      </div>

      <div className="mb-4">
        <h2 className="mx-auto h2 mb-2">Image Likés</h2>
        <div className="mx-auto grid grid-cols-3 justify-items-center gap-y-4 mt-8">
          {favorisImageData.map((image) => (
            <div className="m-2">
              <Link href={`/image/${image.id_image}`} passHref>
                <img
                   key={image.id}
                  src={image.url_image}
                  alt={`Image ${image.id}`}
                  className="rounded-md max-w-xs cursor-pointer"
                />
              </Link>
            </div>
          ))}
        </div>
        <h2 className="mx-auto h2 mb-2">Video likés</h2>
        <div className="mx-auto grid grid-cols-3 justify-items-center gap-y-4 mt-8">
          {favorisVideoData.map((video) => (
            <div  className="m-2">
              <Link href={`/video/${video.id_video}`} passHref>
                <img
                  key={video.id}
                  src={video.imagevideo}
                  alt={`Video ${video.id}`}
                  className="rounded-md max-w-xs cursor-pointer"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <h2 className="mx-auto h2 mb-2">Album likés</h2>
      {favorisAlbumData.map((album) => (
        <div key={album.id} className="comments-container p-6 rounded-md">
          <Link href={`/album/${album.id}`}>
            <div className="border p-6 rounded-md bg-white mb-1">
              <h2 className="text-xl font-bold mb-1">{album.name_liste}</h2>
              <p className="text-gray-600 mb-1">
                Description : {album.description_liste}
              </p>
              <p className="text-gray-500 mb-1">Créé par : {album.username}</p>
              <p className="text-gray-500 mb-1">
                Date de création : {album.created_at}
              </p>
              <p className="text-gray-600 ">Image :</p>
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
              <p className="text-gray-600">Video :</p>
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
  );
}

export default Dashboard;
