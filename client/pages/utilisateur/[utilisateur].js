import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

export default function Utilisateur() {
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
  
  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1">Utilisateur</h1>
      <div className="p">
       compte utilisateur
      </div>
    </div>
  );
}

