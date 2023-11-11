import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('user');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  const deleteUser = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .match({ id: userId });

    if (error) {
      console.error('Error deleting user:', error);
    } else {
      setUsers(users.filter(user => user.id !== userId));
      console.log('User deleted successfully:', data);
    }
  };

  const filteredUsers = users.filter(user => filter === 'all' || user.account_type === filter);
  
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const passwordHash = password; 

      const { data, error } = await supabase
        .from('users')
        .insert([
          { email: email, username: username, password_hash: passwordHash, type_compte: accountType },
        ]);

      if (error) {
        throw error;
      }

      console.log('Inscription réussie:', data);
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'inscription:', error.message);
    }
  };

  const deconnecterUtilisateur = () => {
    Cookies.remove('mon_cookie_auth');  
    router.push('/login');
  };

  const retirerSignalement = async (commentId) => {
    try {
      const { data, error } = await supabase
        .from('commentaire')
        .update({ signaler: false })
        .eq('id', commentId);
  
      if (error) {
        throw error;
      }
  
      console.log('Signalement retiré avec succès:', data);
      window.location.reload();
        } catch (error) {
      console.error('Erreur lors du retrait du signalement:', error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
       const userIdCookie = Cookies.get('userId');
      if (!userIdCookie) {
        console.error('User not logged in');
          return;
      }
  
      const { data, error } = await supabase
        .from('commentaire')
        .delete()
        .eq('id', commentId)
        .eq('id_user', userIdCookie);

      window.location.reload();
  
      if (error) {
        throw error;
      }
      setEditingCommentId(commentId);
      setIsEditingComment(true);
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

const [comments, setComments] = useState([]);

useEffect(() => {
  fetchUsers();
  fetchComments();  
}, []);

const fetchComments = async () => {
  try {
    const { data, error } = await supabase
      .from('commentaire')
      .select('*')
      .filter('signaler', 'eq', true);

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
  } catch (error) {
    console.error('An error occurred while fetching comments:', error.message);
  }
};

  
  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1">Compte Admin</h1>
      <div>
      <button onClick={deconnecterUtilisateur} className="text-blue-600 hover:text-blue-900 ml-4">Se déconnecter</button>
    </div>
      <div className="p">
       Ajout utilisateur
      </div>
      <div className="mt-4 overflow-hidden  sm:rounded-lg">
        <form className="" onSubmit={handleSignUp}>
          <select onChange={(e) => setAccountType(e.target.value)} value={accountType }>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            type="text"
            className="ml-4"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="ml-4"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            type="password" 
            className="ml-4"
          />
          <button onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir ajouter cet utilisateur ?')) deleteUser(user.id) }}type="submit" className="text-blue-600 hover:text-blue-900 ml-4">
            Ajouter utilisateur
          </button>
        </form>
      </div>
      <br></br>
      <div className="p">
       Gestion utilisateur 
      </div>
      <br></br>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Tous</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <div className="mt-4 overflow-hidden shadow-md sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {filteredUsers.map(user => (
            <tr key={user.id} className="bg-white">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.type_compte}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) deleteUser(user.id) }} className="text-red-600 hover:text-red-900">
                Supprimer
              </button>
              </td>
            </tr>
          ))}
        </table>
      </div>

      <div>
      <p>Commentaire</p>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.commentaire}</p>
          <p>{comment.username}</p>
          <button onClick={() => handleDeleteComment(comment.id)}>Supprimer</button>
          <button onClick={() => retirerSignalement(comment.id)}>Signaler</button>
        </div>
      ))}
      </div>        
    </div>
  );
}

