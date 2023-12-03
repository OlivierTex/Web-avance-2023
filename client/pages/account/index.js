import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useRouter } from "next/router";
import Dashboard from "../../components/UserDashboard";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";

const Utilisateur = () => {
  const router = useRouter();
  const { user_session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [favorisImageData, setFavorisImageData] = useState([]);
  const [favorisVideoData, setFavorisVideoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();

        if (!user) {
          router.push("/account/login");
        } else {
          console.debug("User session:", user);
          setLoading(true);
        }
        if (user_session.id) {
          fetchFavorisData(user_session.id);
        } else {
          console.error("User ID is undefined");
        }
      } catch (error) {
      console.error("Error fetching user:", error);
    }
    };

    fetchData();
  }, [router]);

  const fetchFavorisData = async (userId) => {
    try {

      const { data: imageData, error: imageError } = await supabase
        .from("favoris_image")
        .select("*")
        .eq("id_user", userId);

      if (imageError) {
        throw imageError;
      }

      console.log("Favoris_album data:", albumData);

      const { data: videoData, error: videoError } = await supabase
        .from("favoris_video")
        .select("*")
        .eq("id_user", userId);

      if (videoError) {
        throw videoError;
      }

      setFavorisImageData(imageData);
      setFavorisVideoData(videoData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données des favoris:", error);
    }
  };

  const deconnecterUtilisateur = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      router.push("/account/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-4/5">
        <div className={`bg-light dark:bg-dark p-8`}>
          <div className="content-center mb-4">
            <h1 className="text-3xl text-center font-bold ">
              Compte Utilisateur
            </h1>
            <button
              onClick={deconnecterUtilisateur}
              className="bg-gray-800 text-white px-4 py-2"
            >
              Se déconnecter
            </button>
            <Dashboard />
          </div>

          <div className="mb-4">
            <h2 className="h2 mb-2">Image Likés</h2>
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
            <h2 className="h2 mb-2">Video likés</h2>
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
            <h2 className="h2 mb-2">Album Likés</h2>

            <div className="flex flex-wrap justify-center mt-8 gap-y-4">
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Chargement...</div>;
};

export default Utilisateur;
