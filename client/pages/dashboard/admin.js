import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
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
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    } else {
      setUsers(users.filter(user => user.id !== userId));
      console.log('Utilisateur supprimé avec succès:', data);
    }
  };

  const filteredUsers = users.filter(user => filter === 'all' || user.type_compte === filter);

  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1">Compte Admin</h1>
      <div className="paragraphe">
        Cette application est écrite dans le cadre du cours de Tech Web de l'ECE Paris par Greg, Olivier et Marc
      </div>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Tous</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <div>
        {filteredUsers.map(user => (
          <div key={user.id}>
            <p>Nom d'utilisateur : {user.username}</p> <button onClick={() => deleteUser(user.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
