import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Utilisateur() {
  const router = useRouter();
  const [users, setUsers] = useState([]); // Ajout de la déclaration de l'état

  useEffect(() => {
    fetchUsers();
  }, []);

  const deconnecterUtilisateur = () => {
    Cookies.remove('mon_cookie_auth');  
    router.push('/login');
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
        
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1">Utilisateur</h1>
      <button onClick={deconnecterUtilisateur} className="text-blue-600 hover:text-blue-900 ml-4">Se déconnecter</button>
      <div className="p">
        Compte utilisateur
      </div>
    </div>
  );
}
