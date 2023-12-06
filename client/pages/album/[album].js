import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import supabase from "../../supabase";
import { useAuth } from "../../components/AuthContext";
import axios from "axios";

function AlbumPage() {
  const router = useRouter();
  const { album } = router.query;
  const [albumData, setAlbumData] = useState(null);
  const [albumMedia, setAlbumMedia] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [albumImages, setAlbumImages] = useState([]);
  const [albumVideos, setAlbumVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editedComments, setEditedComments] = useState({});
  const { user_session } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const { data: albumData, error } = await supabase
          .from("album")
          .select("id, name_liste, description_liste, username,id_user,created_at")
          .eq("id", album)
          .single();

        if (error) {
          throw error;
        }

        setAlbumData(albumData);

        const { data: linkImageData, error: linkImageError } = await supabase
          .from("link_image_album")
          .select("id, id_image, url")
          .eq("id_album", album);

        if (linkImageError) {
          throw linkImageError;
        }

        const { data: linkVideoData, error: linkVideoError } = await supabase
          .from("link_video_album")
          .select("id, id_video, url,imagevideo")
          .eq("id_album", album);

        if (linkVideoError) {
          throw linkVideoError;
        }

        setAlbumImages(linkImageData);
        setAlbumVideos(linkVideoData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'album:",
          error,
        );
      }
      const commentsResponse = await supabase
        .from("commentaire")
        .select("*")
        .eq("api_image_id", album);

      setComments(commentsResponse.data);
    };

    if (album) {
      fetchAlbumData();
    }
  }, [album]);


  
  const toggleLikeDislike = async () => {
    try {
      const { data: albumData, error } = await supabase
        .from("album")
        .select("id, name_liste, description_liste, username")
        .single();

      const IDalbum = albumData.id;

      if (!user_session) {
        console.error("Utilisateur non connecté");
        console.log(user_session);
        router.push("/../account/login");
        return;
      }

      setIsLiked((prevIsLiked) => !prevIsLiked);

      const likeKey = `like_${user_session?.id}_${IDalbum}`;
      localStorage.setItem(likeKey, isLiked ? "false" : "true");

      const { data: existingFavorites, error: existingError } = await supabase
        .from("favoris_album")
        .select("*")
        .eq("id_user", user_session.id)
        .eq("id_album", IDalbum);

      if (existingError) {
        throw existingError;
      }

      if (isLiked) {
        if (existingFavorites.length > 0) {
          const { data, error } = await supabase
            .from("favoris_album")
            .delete()
            .eq("id_user", user_session.id)
            .eq("id_album", IDalbum);

          if (error) {
            throw error;
          }

          console.log("Album n'est plus aimée!", data);
        }
      } else {
        if (existingFavorites.length === 0) {
          const { data, error } = await supabase.from("favoris_album").insert([
            {
              id_user: user_session.id,
              id_album: IDalbum,
            },
          ]);

          if (error) {
            throw error;
          }

          console.log("Album aimée!", data);
        } else {
          console.log(
            "Cette combinaison user_session.id et IDalbum existe déjà dans la table favoris.",
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors du basculement like/dislike:", error.message);
    }
  };

  const handleDeleteMedia = async (mediaId, isVideo) => {
    try {
      if (user_session.id === albumData.id_user) {
      const mediaTable = isVideo ? "link_video_album" : "link_image_album";

      const { data: linkMediaData, error: linkMediaError } = await supabase
        .from(mediaTable)
        .delete()
        .eq("id", mediaId);

      if (linkMediaError) {
        throw linkMediaError;
      }

      if (isVideo) {
        setAlbumVideos((prevVideos) =>
          prevVideos.filter((video) => video.id !== mediaId),
        );
      } else {
        setAlbumImages((prevImages) =>
          prevImages.filter((image) => image.id !== mediaId),
        );
      }
    } else {
      console.error("User does not have permission to edit this album");
    }
  } catch (error) {
      console.error("Erreur lors de la suppression de l'image/vidéo:", error);
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      if (user_session.id === albumData.id_user) {

      await supabase.from("link_image_album").delete().eq("id_album", album);

      await supabase.from("link_video_album").delete().eq("id_album", album);

      const { data, error } = await supabase
        .from("album")
        .delete()
        .eq("id", album);

      if (error) {
        throw error;
      }

      router.push("/album");
    } else {
      console.error("User does not have permission to edit this album");
    }
  }
    catch (error) {
      console.error("Erreur lors de la suppression de l'album:", error);
    }
  };

  const handleEditAlbum = async (newTitle, newDescription) => {
    try {
      if (user_session.id === albumData.id_user) {
     
      const { data, error } = await supabase
        .from("album")
        .update({
          name_liste: newTitle,
          description_liste: newDescription,
        })
        .eq("id", album);

      if (error) {
        throw error;
      }

      setAlbumData((prevData) => ({
        ...prevData,
        name_liste: newTitle,
        description_liste: newDescription,
      }));
    } else {
      console.error("User does not have permission to edit this album");
    }
    }
   
    catch (error) {
      console.error("Erreur lors de la mise à jour de l'album:", error);
    }
  };

  if (!albumData || !albumMedia) {
    return <p>Chargement en cours...</p>;
  }

  const ajouter_commentaire = async (comment) => {
    try {
      if (!user_session) {
        console.error("User not logged in");
        router.push("/../login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("username")
        .eq("id", user_session.id)
        .single();

      if (userError) {
        throw userError;
      }

      const username = userData?.username;

      const { data, error } = await supabase.from("commentaire").insert([
        {
          commentaire: comment,
          id_user: user_session.id,
          url_image: null,
          api_image_id: albumData.id,
          username: username,
          signaler: false,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Comment added successfully:", data);
      window.location.reload();
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
        window.location.reload();
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
        window.location.reload();
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

  return (
    <div className="bg-light dark:bg-dark">
      <h1 className="h1 mb-3">{albumData.name_liste}</h1>
      <p className="text-gray-600  ml-20 mb-4">
        Description : {albumData.description_liste}
      </p>
      <p className="text-gray-500  ml-20 mb-4">
        <Link href={`/account_user/${albumData.username}`} passHref>
          Créé par : {albumData.username}
        </Link>
      </p>
      <p className="text-gray-500  ml-20 mb-4">
        Créé le : {albumData.created_at}
      </p>

      <div className="w-4/5 mx-auto">
        <div className="grid grid-cols-3 justify-items-center gap-y-4 mt-8">
          {albumImages.map((image) => (
            <div key={image.id} className="m-2">
              <Link href={`/image/${image.id_image}`} passHref>
                <img
                  src={image.url}
                  alt={`Image ${image.id}`}
                  className="rounded-md max-w-xs cursor-pointer"
                />
              </Link>
              <button
                onClick={() => handleDeleteMedia(image.id, false)}
                className="text-red-500 block mt-2 cursor-pointer"
              >
                Supprimer l'image
              </button>
            </div>
          ))}

          {albumVideos.map((video) => (
            <div key={video.id} className="m-2">
              <Link href={`/video/${video.id_video}`} passHref>
                <img
                  src={video.imagevideo}
                  alt={`Video ${video.id}`}
                  className="rounded-md max-w-xs cursor-pointer"
                />
              </Link>
              <button
                onClick={() => handleDeleteMedia(video.id, true)}
                className="text-red-500 block mt-2 cursor-pointer"
              >
                Supprimer la video
              </button>
            </div>
          ))}
        </div>
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
              <img src="/images/heart.svg" alt="Dislike" className="w-8 h-8" />
            ) : (
              <img src="/images/hearth.svg" alt="Like" className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      <h2 className="text-3xl  m-6 text-gray-800">Gestion album:</h2>
      <div className="border p-6 rounded-md m-6 bg-white mb-1">
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
            className="border rounded-md  p-2 mr-2"
          />
          <button
            onClick={() => handleEditAlbum(newTitle, newDescription)}
            className="text-blue-500 "
          >
            Enregistrer les modifications
          </button>
          <button
            onClick={() => handleDeleteAlbum(album.id)}
            className="text-red-500 ml-10"
          >
            Supprimer l'album
          </button>
        </div>
      </div>

      <h2 className="text-3xl  m-6 text-gray-800">Commentaires:</h2>
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
          {comments.map((comment) => (
            <li key={comment.id} className="border p-6 rounded-md bg-white ">
              <p className="text-xl font-semibold mb-2 text-blue-600">
                <Link href={`/account_user/${comment.username}`} passHref>
                  {comment.username}
                </Link>
              </p>
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
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:underline focus:outline-none"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => signalerCommentaire(comment.id)}
                  className="text-red-500 hover:underline focus:outline-none"
                >
                  Signaler
                </button>
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  Modifier
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AlbumPage;
