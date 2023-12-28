import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useRouter } from "next/router";
import Dashboard from "../../components/UserDashboard";

const Utilisateur = ({ images }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/account/login");
      } else {
        setLoading(true);
      }
    });
  }, []);

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
            <h1 className="h1">Compte Utilisateur</h1>
            <button
              onClick={deconnecterUtilisateur}
              className="bg-gray-800 text-white px-4 py-2 mt-4"
            >
              Se déconnecter
            </button>
          </div>
        </div>
        <Dashboard images={images} />
      </div>
    );
};

export const getStaticProps = async () => {
  try {
    const { user, session } = supabase.auth;
    if (user) {
      const { data: userFavorites, error } = await supabase
        .from("favoris")
        .select("url_images, api_image_id, boolean_column")
        .filter("id_user", "eq", session.user.id);

      if (!error) {
        const favoriteMedia = userFavorites.map((favorite, index) => ({
          src: favorite.url_images,
          isVideo: favorite.like_boolean,
          api_image_id: favorite.api_image_id,
        }));

        return {
          props: {
            images: favoriteMedia,
          },
          revalidate: 60 * 60,
        };
      }
    }
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      images: [],
    },
    revalidate: 60 * 60,
  };
};

export default Utilisateur;
