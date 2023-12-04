import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useRouter } from "next/router";
import Dashboard from "../../components/UserDashboard";

const Utilisateur = () => {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/account/login");
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
          .from("favoris")
          .select("url_images, api_image_id, boolean_column")
          .filter("id_user", "eq", session.user.id);

        console.log("userFavorites:", userFavorites);

        if (!error) {
          const favoriteMedia = userFavorites.map((favorite, index) => ({
            src: favorite.url_images,
            isVideo: favorite.like_boolean,
            api_image_id: favorite.api_image_id,
          }));

          console.log("favoriteMedia:", favoriteMedia);

          setImages(favoriteMedia);
          setTotalPages(Math.ceil(favoriteMedia.length / itemsPerPage));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deconnecterUtilisateur = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.push("/account/login");
    }
  };

  if (loading)
    return (
      <div className="mx-auto w-4/5">
        <div className={`bg-light dark:bg-dark`}>
          <div className="content-center mb-4">
            <h1 className="text-3xl text-center font-bold mt-6">
              Compte Utilisateur
            </h1>
            <button
              onClick={deconnecterUtilisateur}
              className="bg-gray-800 text-white px-4 py-2 mt-4"
            >
              Se déconnecter
            </button>
          </div>
        </div>
        <Dashboard />
      </div>
    );
};

export default Utilisateur;
