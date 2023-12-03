import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "./AuthContext";
import Link from "next/link";

function Dashboard() {
  const { user_session } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [initialUsername, setInitialUsername] = useState(username);
  const [initialEmail, setInitialEmail] = useState(email);
  const [initialBio, setInitialBio] = useState(bio);

  const [favorisAlbumData, setFavorisAlbumData] = useState([]);
  const [favorisImageData, setFavorisImageData] = useState([]);
  const [favorisVideoData, setFavorisVideoData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user_session) {
        const { data: users, error } = await supabase
          .from("user")
          .select("username, email, bio")
          .eq("id", user_session.id);

        if (error) {
          console.error(error);
        } else if (users.length > 0) {
          setUsername(users[0].username);
          setEmail(users[0].email);
          setBio(users[0].bio);

          setInitialUsername(users[0].username);
          setInitialEmail(users[0].email);
          setInitialBio(users[0].bio);
        }
      }
    };

    fetchUserData();
    fetchFavorisData();


  }, [user_session]);



  
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    const { error } = await supabase
      .from("user")
      .update({
        username: username,
        email: email,
        bio: bio,
      })
      .eq("id", user_session.id);

    if (error) {
      console.error(error);
    } else {
      console.log("User settings updated successfully");
      setInitialUsername(username);
      setInitialEmail(email);
      setInitialBio(bio);
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

        console.log("Favoris_video data:",videoData);

        const { data: albumsLikeData, likerror } = await supabase
          .from("favoris_album")
          .select("id_user,id_album")
          .eq("id_user", user_session.id);

        console.log("Favoris_album data:",albumsLikeData);

        if (likerror) {
          throw likerror;
        }

        const { data: albumsData, albumerror } = await supabase
        .from("album")
        .select("*")
        .in("id", albumsLikeData.map((album) => album.id_album));

        console.log("album data:",albumsData);

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

                console.log("album data:",imageMedia);
        
              const { data: videoMedia, error: videoError } = await supabase
                .from("link_video_album")
                .select("id_video, id_album, url, imagevideo")
                .eq("id_album", album.id)  
                .limit(5);

                console.log("album data:",videoMedia);
        
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
          })
        );
        

        setFavorisAlbumData(albumsWithMedia);
        setFavorisImageData(imageData);
        setFavorisVideoData(videoData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des favoris:", error);
      }
    };




  return (
    <div className="">
      <div className="">
        <h2 className=" w-4/5 mx-auto text-2xl font-bold">Paramètres du compte</h2>
        <div className=" w-4/5 mx-auto grid grid-cols-2 gap-4 items-startflex justify-start space-y-4  bg-gray-400 p-4">
          <label htmlFor="username" className="block text-left">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 border rounded ${
              username == initialUsername ? "bg-gray-300" : ""
            }`}
          />
          <label htmlFor="email" className="block text-left">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded ${
              email == initialEmail ? "bg-gray-300" : ""
            }`}
          />
          <label htmlFor="bio" className="block text-left">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`w-full p-2 border rounded h-12 max-h-64 min-h-12 ${
              bio == initialBio ? "bg-gray-300" : ""
            }`}
          />
        </div>
        <button
          onClick={handleSaveChanges}
          className={`px-4 py-2 rounded  text-white ${
            username === initialUsername &&
            email === initialEmail &&
            bio === initialBio
              ? "bg-gray-500"
              : "bg-green-600"
          }`}
          disabled={
            username === initialUsername &&
            email === initialEmail &&
            bio === initialBio
          }
        >
          {" "}
          Enregistrer{" "}
        </button>
      </div>


      <div className="mb-4">
        <h2 className="w-4/5 mx-auto h2 mb-2">Image Likés</h2>
        <div className="w-4/5 mx-auto grid grid-cols-3 justify-items-center gap-y-4 mt-8">
          {favorisImageData.map((image) => (
            <div key={image.id} className="m-2">
              <Link href={`/image/${image.id_image}`} passHref>
                <img
                  src={image.url_image}
                  alt={`Image ${image.id}`}
                  className="rounded-md max-w-xs cursor-pointer"
                />
              </Link>
            </div>
          ))}
        </div>
        <h2 className=" w-4/5 mx-auto h2 mb-2">Video likés</h2>
        <div className="w-4/5 mx-auto grid grid-cols-3 justify-items-center gap-y-4 mt-8">
          {favorisVideoData.map((video) => (
            <div key={video.id} className="m-2">
              <Link href={`/video/${video.id_video}`} passHref>
                <img
                  src={video.imagevideo}
                  alt={`Video ${video.id}`}
                  className="rounded-md max-w-xs cursor-pointer"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <h2 className=" w-4/5 mx-auto h2 mb-2">Album likés</h2>
      {favorisAlbumData.map((album) => (
          <div key={album.id} className="comments-container p-6 rounded-md">
            <Link href={`/album/${album.id}`}>
              <div className="border p-6 rounded-md bg-white mb-1">
                <h2 className="text-xl font-bold mb-1">{album.name_liste}</h2>
                <p className="text-gray-600 mb-1">
                  Description : {album.description_liste}
                </p>
                <p className="text-gray-500 mb-1">
                  Créé par : {album.username}
                </p>
                <p className="text-gray-500 mb-1">
                 Date de création : {album.created_at}
                </p>
                <p className="text-gray-600 ">Image :</p>
                <div className="flex space-x-4 mb-4">
                  {album.images.map((image) => (
                    <img
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
