import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getAPIKey, getAPIBaseURL } from '../../API/API_pexels';
import { useAuth } from '../../components/AuthContext';
import supabase from '../../supabase';

const VideoPage = () => {
  const router = useRouter();
  const { video } = router.query;
  const [videoData, setVideoData] = useState(null);
  const apiKey = getAPIKey(); 
  const [isLiked, setIsLiked] = useState(false);
  const { user_session } = useAuth();
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(''); 
  const [editedComments, setEditedComments] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [userAlbums, setUserAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(undefined);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (video) {
        try {
          const response = await axios.get(`https://api.pexels.com/videos/videos/${video}`, {
            headers: {
              Authorization: apiKey,
            },
          });

          setVideoData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
      const commentsResponse = await supabase
            .from('commentaire')
            .select('*')
            .eq('api_image_id', video);

          setComments(commentsResponse.data);
    };

    fetchVideoData();
  }, [video, apiKey]);

  useEffect(() => {
    fetchUserAlbums();
  }, [user_session]);

  const fetchUserAlbums = async () => {
    try {
      
      if (user_session) {
        const { data, error } = await supabase
          .from('album')
          .select('id, name_liste')
          .filter('id_user', 'eq', user_session.id);
  
        if (!error) {
          setUserAlbums(data);
  
            if (data.length > 0) {
              setSelectedAlbum(data[0].id);
            }
          
        } else {
          console.error('Erreur lors de la récupération des albums de l\'utilisateur:', error);
        }
      }
    } catch (error) {
      console.error('Erreur dans fetchUserAlbums:', error);
    }
  };

  const toggleLikeDislike = async () => {
    try {
      const response = await axios.get(`https://api.pexels.com/videos/videos/${video}`, {
        headers: {
          Authorization: apiKey,
        },
      });
  
      const IDivideo = videoData.url;
  
      if (!user_session) {
        console.error('Utilisateur non connecté');
        console.log(user_session);
        router.push('/../account/login');
        return;
      }
  
      setIsLiked((prevIsLiked) => !prevIsLiked);
  
      const likeKey = `like_${user_session?.id}_${IDivideo}`;
      localStorage.setItem(likeKey, isLiked ? 'false' : 'true');
  
      const { data: existingFavorites, error: existingError } = await supabase
        .from('favoris_video')
        .select('url_video')
        .eq('id_user', user_session.id)
        .eq('url_video', IDivideo);
  
      if (existingError) {
        throw existingError;
      }
  
      if (isLiked) {
        if (existingFavorites.length > 0) {
          const { data, error } = await supabase
            .from('favoris_video')
            .delete()
            .eq('id_user', user_session.id)
            .eq('url_video', IDivideo);
  
          if (error) {
            throw error;
          }
  
          console.log('Vidéo n\'est plus aimée!', data);
        }
      } else {
        if (existingFavorites.length === 0) {
          const { data, error } = await supabase
            .from('favoris_video')
            .insert([
              { id_user: user_session.id, url_video: IDivideo, id_video: video },
            ]);
  
          if (error) {
            throw error;
          }
  
          console.log('Vidéo aimée!', data);
        } else {
          console.log('Cette combinaison user_session.id et IDivideo existe déjà dans la table favoris.');
        }
      }
    } catch (error) {
      console.error('Erreur lors du basculement like/dislike:', error.message);
    }
  };
  if (!videoData) {
    return <div>Loading...</div>;
  }

    //Gestion des commentaires

    const ajouter_commentaire = async (comment) => {
      try {
        const IDivideo= videoData.url;
    
        if (!user_session) {
          console.error('User not logged in');
          router.push('/../login');
          return;
        }
    
         const { data: userData, error: userError } = await supabase
          .from('user')
          .select('username')
          .eq('id', user_session.id)
          .single();
    
        if (userError) {
          throw userError;
        }
    
        const username = userData?.username;
    
        const { data, error } = await supabase
          .from('commentaire')
          .insert([
            { 
              commentaire: comment,
              id_user: user_session.id,
              url_image: IDivideo,
              api_image_id: video,
              username: username, 
              signaler: false,
            },
          ]);
    
        if (error) {
          throw error;
        }
    
        console.log('Comment added successfully:', data);
        window.location.reload();
      } catch (error) {
        console.error('Error adding comment:', error.message);
      }
    };
    
  
    const editer_commentaire = async (commentId, newComment) => {
      
      try {
          const { data: commentData, error: commentError } = await supabase
              .from('commentaire')
              .select()
              .eq('id', commentId)
              .single();
  
          if (commentError) {
              throw commentError;
          }
  
          const comment = commentData;
  
          if (user_session.id === comment.id_user) {
              const { data, error } = await supabase
                  .from('commentaire')
                  .update({ commentaire: newComment })
                  .eq('id', commentId);
  
              if (error) {
                  throw error;
              }
  
              console.log('Comment edited successfully:', data);
              window.location.reload();
          } else {
              console.error('User does not have permission to edit this comment');
          }
      } catch (error) {
          console.error('Error editing comment:', error.message);
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
                comment.id === commentId ? { ...comment, newComment: newText } : comment
            )
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
              console.error('User not logged in');
              return;
          }
  
          const { data: commentData, error: commentError } = await supabase
              .from('commentaire')
              .select()
              .eq('id', commentId)
              .single();
  
          if (commentError) {
              throw commentError;
          }
  
          const comment = commentData;
  
          if (user_session.id === comment.id_user) {
              const { data, error } = await supabase
                  .from('commentaire')
                  .delete()
                  .eq('id', commentId)
                  .eq('id_user', user_session.id);
  
              if (error) {
                  throw error;
              }
              console.log('Comment deleted successfully:', data);
              window.location.reload();
              setEditingCommentId(commentId);
          } else {
              console.error('User does not have permission to delete this comment');
          }
      } catch (error) {
          console.error('Error deleting comment:', error.message);
      }
  };
  
  
    const signalerCommentaire = async (commentaireId) => {
      try {
        const { data, error } = await supabase
          .from('commentaire')
          .update({ signaler: true })
          .eq('id', commentaireId);
    
        if (error) {
          throw error;
        }
    
        console.log('Commentaire signalé avec succès:', data);
          } catch (error) {
        console.error('Erreur lors du signalement du commentaire:', error.message);
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
          const imageId = video;
          const imageUrl = videoData.url;
  
          const { data, error } = await supabase
            .from('link_video_album')
            .insert([
              {
                id_album: selectedAlbum,
                id_video: imageId,
                url: imageUrl,
              },
            ]);
  
          if (!error) {
            console.log('Image added to existing album successfully:', data);
            fetchUserAlbums();
            setShowOptions2(false);
            fetchUserAlbums();
          } else {
            console.error('Error adding image to existing album:', error);
          }
        } else {
          console.warn('No album selected.');
        }
      } catch (error) {
        console.error('Error in handleAddToExistingAlbum:', error);
      }
    };
    
  
    const handleCreateAlbum = async () => {
      const { data: userData, error: userError } = await supabase
      .from('user')
      .select('username')
      .eq('id', user_session.id)
      .single();

      const username = userData?.username;
      try {
        if (user_session.id) {
          const { data, error } = await supabase
            .from('album')
            .insert([
              {
                id_user: user_session.id,
                name_liste: albumName,
                description_liste: albumDescription,
                username: username,
              },
            ]);
    
          if (!error) {
            console.log('Nouvel album créé avec succès:', data);
            setShowOptions(false);
            fetchUserAlbums();
          } else {
            console.error('Erreur lors de la création de l\'album:', error);
          }
        }
      } catch (error) {
        console.error('Erreur dans handleCreateAlbum:', error);
      }
    };
    
    

  return (
    <div>
      <p className="h1 dark:text-white text-center my-5"><strong>Video:</strong> </p>
        
        
      <video className="image-preview w-auto h-auto object-cover mx-auto max-h-screen m-4 cursor-pointer border-4 border-custom1" width="640" height="360" controls>
        <source src={videoData.video_files[0].link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="flex justify-between items-center" >
          <div className="flex justify-end space-x-1000 my-5">
            <button
              onClick={toggleLikeDislike}
              className={`bg-${isLiked ? 'gray' : 'gray'}-800 text-white px-4 py-2 rounded-md ml-2`}
            >
              {isLiked ? (
                <img src="/images/heart.svg" alt="Dislike" className="w-8 h-8" />
              ) : (
                <img src="/images/hearth.svg" alt="Like" className="w-8 h-8" />
              )}
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
                    <label htmlFor="albumName" className="block text-sm font-medium text-gray-700">
                      Vos albums
                    </label>
                    <div className="w-full border-b-2 border-black mb-2"></div>
                    <select
                      id="selectAlbum"
                      name="selectAlbum"
                      value={selectedAlbum || ''}
                      onChange={(e) => setSelectedAlbum(e.target.value)}
                      className="mt-1 p-2 border rounded"
                    >
                      <option value="" disabled>Sélectionnez un album</option>
                      {userAlbums.map((album) => (
                        <option key={album.id} value={album.id}>{album.name_liste}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full border-b-2 border-black mb-2"></div>
                  <button className="bg-gray-800 text-white px-1 py-1 rounded-md ml-2 " onClick={handleAddToExistingAlbum}>
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
                <div className={`absolute ${showOptions ? 'top-10' : 'hidden'} right-0 bg-white border border-gray-300 p-2 rounded mr-3`}>
                  <div className="mb-2">
                    <label htmlFor="albumName" className="block text-sm font-medium text-gray-700">
                      Création d'album
                    </label>
                    <div className="w-full border-b-2 border-black mb-2"></div>
                    <label htmlFor="albumName" className="block text-sm font-medium text-gray-700">
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
                    <label htmlFor="albumDescription" className="block text-sm font-medium text-gray-700">
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
                  <button className="bg-gray-800 text-white px-1 py-1 rounded-md ml-2 " onClick={handleCreateAlbum}>
                    Créer un nouvel album
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
      <h2 className="text-3xl  m-6 text-gray-800">Infomartions:</h2>
      <div className="dark:text-white space-y-2 text-center">
        <p>Photographer: {videoData.user.name}</p>
        <p>
          Photographer URL:{' '}
          <a href={videoData.user.url} target="_blank" rel="noreferrer">
            {videoData.user.url}
          </a>
        </p>
        <p>
          video URL:{' '}
          <a href={videoData.url} target="_blank" rel="noreferrer">
            {videoData.url}
          </a>
        </p>
        <p>
          Dimensions: {videoData.width} x {videoData.height}
        </p>
        <p>
          Duration: {videoData.duration} seconds
        </p>
      </div>

      <h2 className="text-3xl  m-6 text-gray-800">Commentaires:</h2>
      <div className="p-4">
        <textarea
          id="commentaireInput"
          className="w-full border p-2 mb-2"
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}> </textarea>
        <button
          onClick={() => ajouter_commentaire(newComment)}
          id="ajouterCommentaireBtn"
          className="bg-gray-800 text-white p-2 rounded hover:bg-blue-600">
          Ajouter Commentaire
        </button>
      </div>
      <div className="comments-container  p-6 rounded-md ">
          <ul className="space-y-6">
              {comments.map((comment) => (
                  <li key={comment.id} className="border p-6 rounded-md bg-white ">
                      <p className="text-xl font-semibold mb-2 text-blue-600">{comment.username}</p>
                      {editedComments[comment.id] ? (
                          <div className="mb-4">
                              <textarea
                                  value={comment.newComment || ''}
                                  onChange={(e) => handleCommentChange(comment.id, e.target.value)}
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
};

export default VideoPage;

