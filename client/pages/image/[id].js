import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAPIKey, getAPIBaseURL } from "../../API/API_pexels";
import supabase from "../../supabase";
import { useAuth } from "../../components/AuthContext";
import Link from "next/link";
import gravatar from "gravatar";

const ImageDetail = ({ imageDetailsProp, commentsProp }) => {
  const router = useRouter();
  const { id } = router.query;
  const [email, setEmail] = useState("");
  const [imageDetails, setImageDetails] = useState(imageDetailsProp);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [comments, setComments] = useState(commentsProp);
  const [newComment, setNewComment] = useState("");
  const [editedComments, setEditedComments] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const { user_session } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [userAlbums, setUserAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(undefined);

  useEffect(() => {
    setImageDetails(imageDetailsProp);
    setComments(commentsProp);
  }, [imageDetailsProp, commentsProp]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (router.isReady && id) {
          const apiKey = getAPIKey();
          const baseUrl = getAPIBaseURL();
          const url = `${baseUrl}/photos/${id}`;

          const response = await axios.get(url, {
            headers: { Authorization: apiKey },
          });

          setImageDetails(response.data);

          addImageToDatabase(id, response.data.src.original);

          const commentsResponse = await supabase
            .from("commentaire")
            .select("*")
            .eq("api_image_id", id);

          setComments(commentsResponse.data);
        }
        c;
      } catch (error) {
        console.error("Fetching image details failed:", error);
      }
    };

    fetchData();
  }, [router.isReady, id]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isImageFullscreen && e.target.tagName !== "IMG") {
        setIsImageFullscreen(false);
      }
    };

    const handleEscapeKey = (e) => {
      if (isImageFullscreen && e.key === "Escape") {
        setIsImageFullscreen(false);
      }
    };

    if (isImageFullscreen) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isImageFullscreen]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const IDimages = imageDetails?.src?.original;

        if (!user_session?.id || IDimages === undefined) {
          console.error("User ID or image ID is missing");
          console.log("user_session.id:", user_session?.id);
          console.log("IDimages:", IDimages);
          return;
        }

        const { data, error } = await supabase
          .from("favoris_image")
          .select("*")
          .eq("id_user", user_session.id)
          .eq("url_image", IDimages);

        if (error) {
          throw error;
        }

        setIsLiked(data.length > 0);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du statut de like:",
          error.message,
        );
      }
    };

    fetchLikeStatus();
  }, [imageDetails?.src?.original, user_session?.id]);

  useEffect(() => {
    fetchUserAlbums();
  }, [user_session]);

  const fetchUserAlbums = async () => {
    try {
      if (user_session) {
        const { data, error } = await supabase
          .from("album")
          .select("id, name_liste")
          .filter("id_user", "eq", user_session.id);

        if (!error) {
          setUserAlbums(data);

          if (data.length > 0) {
            setSelectedAlbum(data[0].id);
          }
        } else {
          console.error(
            "Erreur lors de la récupération des albums de l'utilisateur:",
            error,
          );
        }
      }
    } catch (error) {
      console.error("Erreur dans fetchUserAlbums:", error);
    }
  };

  //Gestion des images

  const addImageToDatabase = async (apiImageId, imageUrl) => {
    try {
      const { data: selectData, error: selectError } = await supabase
        .from("images")
        .select("*")
        .eq("api_image_id", apiImageId)
        .single();

      if (!selectData) {
        console.log(
          "ID non trouvé. Ajout d'une nouvelle entrée dans la table.",
        );
        const { error: insertError } = await supabase
          .from("images")
          .insert([{ api_image_id: apiImageId, views: 1, url: imageUrl }]);

        if (insertError) {
          console.error(
            "Erreur lors de l’insertion de la nouvelle image :",
            insertError,
          );
        } else {
          console.log("Nouvelle entrée ajoutée avec succès !");
        }
      } else {
        console.log("ID déjà existant dans la table.");
        const { error: updateError } = await supabase
          .from("images")
          .update({ views: selectData.views + 1 })
          .eq("api_image_id", apiImageId);

        if (updateError) {
          console.error(
            "Erreur lors de la mise à jour des vues de l’image :",
            updateError,
          );
        } else {
          console.log("Vues mises à jour avec succès !");
        }
      }
    } catch (error) {
      console.error("Erreur dans addImageToDatabase :", error);
    }
  };

  //Gestion du Download

  const handleDownload = async (url, filename) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const defaultFilename =
        filename || `image_${new Date().toISOString()}.png`;
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", defaultFilename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error during image download:", error);
    }
  };

  if (!imageDetails) {
    return <div>Loading...</div>;
  }

  const toggleLikeDislike = async () => {
    try {
      const IDimages = imageDetails.src.original;

      if (!user_session) {
        console.error("Utilisateur non connecté");
        console.log(user_session);
        router.push("/../account/login");
        return;
      }

      setIsLiked((prevIsLiked) => !prevIsLiked);

      const likeKey = `like_${user_session?.id}_${IDimages}`;
      localStorage.setItem(likeKey, isLiked ? "false" : "true");

      if (isLiked) {
        const { data, error } = await supabase
          .from("favoris_image")
          .delete()
          .eq("id_user", user_session.id)
          .eq("url_image", IDimages);

        if (error) {
          throw error;
        }

        console.log("Image n'est plus aimée!", data);
      } else {
        const { data: existingFavorites, error } = await supabase
          .from("favoris_image")
          .select("*")
          .eq("id_user", user_session.id)
          .eq("url_image", IDimages);

        if (error) {
          throw error;
        }

        if (existingFavorites.length === 0) {
          const { data, error } = await supabase
            .from("favoris_image")
            .insert([
              { id_user: user_session.id, url_image: IDimages, id_image: id },
            ]);

          if (error) {
            throw error;
          }

          console.log("Image aimée!", data);
        } else {
          console.log(
            "Cette combinaison  user_session.id et IDimages existe déjà dans la table favoris.",
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors du basculement like/dislike:", error.message);
    }
  };

  //Gestion des commentaires

  const ajouter_commentaire = async (comment) => {
    try {
      const IDimages = imageDetails.src.original;

      if (!user_session) {
        console.error("User not logged in");
        router.push("/../login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("id", user_session.id)
        .single();

      if (userError) {
        throw userError;
      }

      if (!userData) {
        console.error("userData is not defined");
        return;
      }

      const username = userData?.username;
      const email = userData?.email;

      const { data, error } = await supabase.from("commentaire").insert([
        {
          commentaire: comment,
          id_user: user_session.id,
          url_image: IDimages,
          api_image_id: id,
          username: username,
          email: email,
          signaler: false,
        },
      ]);

      if (error) {
        throw error;
      }

      setEmail(email);

      console.log("Comment added successfully:", data);
      const commentsResponse = await supabase
        .from("commentaire")
        .select("*")
        .eq("api_image_id", id);

      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const editer_commentaire = async (commentId, newComment) => {
    try {
      const { data: commentData, error: commentError } = await supabase
        .from("commentaire")
        .select()
        .eq("id", commentId)
        .single();

      if (commentError) {
        throw commentError;
      }

      const comment = commentData;

      if (user_session.id === comment.id_user) {
        const { data, error } = await supabase
          .from("commentaire")
          .update({ commentaire: newComment })
          .eq("id", commentId);

        if (error) {
          throw error;
        }

        console.log("Comment edited successfully:", data);
        const commentsResponse = await supabase
          .from("commentaire")
          .select("*")
          .eq("api_image_id", id);

        setComments(commentsResponse.data);
      } else {
        console.error("User does not have permission to edit this comment");
      }
    } catch (error) {
      console.error("Error editing comment:", error.message);
    }
  };

  const handleEditComment = (commentId) => {
    setEditedComments((prev) => ({
      ...prev,
      [commentId]: true,
    }));
  };

  const handleCommentChange = (commentId, newText) => {
    setEditedComments((prev) => ({
      ...prev,
      [commentId]: true,
    }));
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, newComment: newText }
          : comment,
      ),
    );
  };

  const handleSaveEdit = async (commentId) => {
    const editedComment = comments.find((comment) => comment.id === commentId);

    if (editedComment.newComment) {
      await editer_commentaire(commentId, editedComment.newComment);
    }

    setEditedComments((prev) => ({
      ...prev,
      [commentId]: false,
    }));
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (!user_session.id) {
        console.error("User not logged in");
        return;
      }

      const { data: commentData, error: commentError } = await supabase
        .from("commentaire")
        .select()
        .eq("id", commentId)
        .single();

      if (commentError) {
        throw commentError;
      }

      const comment = commentData;

      if (user_session.id === comment.id_user) {
        const { data, error } = await supabase
          .from("commentaire")
          .delete()
          .eq("id", commentId)
          .eq("id_user", user_session.id);

        if (error) {
          throw error;
        }
        console.log("Comment deleted successfully:", data);
        const commentsResponse = await supabase
          .from("commentaire")
          .select("*")
          .eq("api_image_id", id);

        setComments(commentsResponse.data);
        setEditingCommentId(commentId);
      } else {
        console.error("User does not have permission to delete this comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const signalerCommentaire = async (commentaireId) => {
    try {
      const { data, error } = await supabase
        .from("commentaire")
        .update({ signaler: true })
        .eq("id", commentaireId);

      if (error) {
        throw error;
      }

      console.log("Commentaire signalé avec succès:", data);
    } catch (error) {
      console.error(
        "Erreur lors du signalement du commentaire:",
        error.message,
      );
    }
  };

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handleButtonClicks = () => {
    setShowOptions2(!showOptions2);
  };

  const handleAddToExistingAlbum = async () => {
    try {
      if (selectedAlbum) {
        const imageId = id;
        const imageUrl = imageDetails.src.original;

        const { data, error } = await supabase.from("link_image_album").insert([
          {
            id_album: selectedAlbum,
            id_image: imageId,
            url: imageUrl,
          },
        ]);

        if (!error) {
          console.log("Image added to existing album successfully:", data);
          fetchUserAlbums();
          setShowOptions2(false);
          fetchUserAlbums();
        } else {
          console.error("Error adding image to existing album:", error);
        }
      } else {
        console.warn("No album selected.");
      }
    } catch (error) {
      console.error("Error in handleAddToExistingAlbum:", error);
    }
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
    <div className="w-4/5 mx-auto body">
      <div className="relative">
        <p className="h1 dark:text-white text-center my-5">
          <strong>Image Name:</strong> {imageDetails.alt}
        </p>

        <div
          onClick={() => setIsImageFullscreen(!isImageFullscreen)}
          className="cursor-pointer"
        >
          <img
            src={imageDetails.src.original}
            alt={imageDetails.alt}
            className="image-preview w-auto h-auto object-cover mx-auto max-h-screen mb-4 cursor-pointer border-4 border-custom1"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex justify-end space-x-1000 my-5">
            <button
              onClick={toggleLikeDislike}
              className={`bg-${
                isLiked ? "gray" : "gray"
              }-800 text-white px-4 py-2 rounded-md ml-2`}
            >
              {isLiked ? (
                <img
                  src="/images/heart.svg"
                  alt="Dislike"
                  className="w-8 h-8"
                />
              ) : (
                <img src="/images/hearth.svg" alt="Like" className="w-8 h-8" />
              )}
            </button>

            <button
              onClick={() =>
                handleDownload(
                  imageDetails.src.original,
                  `${imageDetails.alt}.jpeg`,
                )
              }
              className="bg-gray-800 text-white px-4 py-2 rounded-md ml-2"
            >
              {" "}
              Download Image{" "}
            </button>
          </div>

          <div className="flex justify space-x-2 my-5">
            <div className="relative inline-block">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleButtonClicks}
              >
                Ajouter l'image à un album
              </button>
              {showOptions2 && (
                <div className="absolute botom-10 right-29 bg-white border border-gray-300 p-2 rounded">
                  <div className="mb-2">
                    <label
                      htmlFor="albumName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vos albums
                    </label>
                    <div className="w-full border-b-2 border-black mb-2"></div>
                    <select
                      id="selectAlbum"
                      name="selectAlbum"
                      value={selectedAlbum || ""}
                      onChange={(e) => setSelectedAlbum(e.target.value)}
                      className="mt-1 p-2 border rounded"
                    >
                      <option value="" disabled>
                        Sélectionnez un album
                      </option>
                      {userAlbums.map((album) => (
                        <option key={album.id} value={album.id}>
                          {album.name_liste}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full border-b-2 border-black mb-2"></div>
                  <button
                    className="bg-gray-800 text-white px-1 py-1 rounded-md ml-2 "
                    onClick={handleAddToExistingAlbum}
                  >
                    Ajouter à l'album existant
                  </button>
                </div>
              )}
            </div>

            <div className="relative inline-block">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-md ml-1 mr-1"
                onClick={handleButtonClick}
              >
                Créer un album
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
        </div>
      </div>

      <h2 className="h2 ml-3">Infomartions:</h2>

      <div className="dark:text-white space-y-2 text-center">
        <p>Photographer: {imageDetails.photographer}</p>
        <p>
          Photographer URL:{" "}
          <a
            href={imageDetails.photographer_url}
            target="_blank"
            rel="noreferrer"
          >
            {imageDetails.photographer_url}
          </a>
        </p>
        <p>
          Image URL:{" "}
          <a href={imageDetails.url} target="_blank" rel="noreferrer">
            {imageDetails.url}
          </a>
        </p>
        <p>
          Dimensions: {imageDetails.width} x {imageDetails.height}
        </p>
      </div>

      <h2 className="h2 ml-3">Commentaires:</h2>
      <div className="p-4">
        <textarea
          id="commentaireInput"
          className="w-full border p-2 mb-2"
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        >
          {" "}
        </textarea>
        <button
          onClick={() => ajouter_commentaire(newComment)}
          id="ajouterCommentaireBtn"
          className="bg-gray-800 text-white p-2 rounded hover:bg-blue-600"
        >
          Ajouter Commentaire
        </button>
      </div>
      <div className="comments-container  p-6 rounded-md ">
        <ul className="space-y-6">
          {Array.isArray(comments) &&
            comments.map((comment) => (
              <li key={comment.id} className="border p-6 rounded-md bg-white ">
                <div className="flex items-center text-xl font-semibold mb-2 text-blue-600">
                  {console.log(comment.userEmail)}
                  <img
                    src={gravatar.url(
                      comment.email,
                      { s: "50", r: "x", d: "retro" },
                      true,
                    )}
                    alt="Gravatar User Icon"
                    className="mr-2"
                  />
                  <Link href={`/account_user/${comment.username}`} passHref>
                    {comment.username}
                  </Link>
                </div>
                {editedComments[comment.id] ? (
                  <div className="mb-4">
                    <textarea
                      value={comment.newComment || ""}
                      onChange={(e) =>
                        handleCommentChange(comment.id, e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="text-blue-500 hover:underline focus:outline-none"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{comment.commentaire}</p>
                )}
                <div className="flex justify-end space-x-4 mt-4">
                  {user_session && user_session.id === comment.id_user && (
                    <div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-blue-500 hover:underline focus:outline-none mr-4"
                      >
                        Supprimer
                      </button>
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="text-blue-500 hover:underline focus:outline-none"
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => signalerCommentaire(comment.id)}
                    className="text-red-500 hover:underline focus:outline-none"
                  >
                    Signaler
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {isImageFullscreen && (
        <div
          className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-75 flex justify-center items-center"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative">
            <img
              src={imageDetails.src.original}
              alt={imageDetails.alt}
              className="fullscreen-image h-screen mx-auto"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsImageFullscreen(false);
              }}
              className="close-button absolute top-4 right-4 text-white text-3xl focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  try {
    const { id } = params;
    const apiKey = getAPIKey();
    const baseUrl = getAPIBaseURL();
    const url = `${baseUrl}/photos/${id}`;
    const response = await axios.get(url, {
      headers: { Authorization: apiKey },
    });

    const imageDetails = response.data;

    const commentsResponse = await supabase
      .from("commentaire")
      .select("*")
      .eq("api_image_id", id);
    const comments = commentsResponse.data;

    return {
      props: {
        imageDetails,
        comments,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Fetching image details failed:", error);
    return {
      props: {
        imageDetails: null,
        comments: [],
      },
      revalidate: 60,
    };
  }
}

export default ImageDetail;
