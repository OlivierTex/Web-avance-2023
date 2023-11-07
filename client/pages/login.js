import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        console.log('Données récupérées depuis Supabase :', data);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données:', error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { user, session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Une erreur s\'est produite lors de la connexion:', error.message);
    } else {
      console.log('Utilisateur connecté:', user);
      console.log('Session:', session);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="h2" onClick={fetchData}>
            Bonjour 
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Veuillez vous connecter à votre compte
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <input
            type="email"
            id="email-address"
            name="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Se connecter
            </button><br></br>
            <Link href="/inscription" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Inscription</Link>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Login;
