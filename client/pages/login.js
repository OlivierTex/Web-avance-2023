import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password); 

      if (error) {
        setErrorMessage('Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
        return;
      }

      if (data.length > 0) {
        const user = data[0];
        const userType = user.type_compte;

        if (userType === 'admin') {
          router.push('/dashboard/admin');
        } else if (userType === 'user') {
          router.push('/dashboard/user');
        } else {
          setErrorMessage('Type de compte non reconnu.');
        }
      } else {
        setErrorMessage('Adresse e-mail ou mot de passe incorrect.');
      }
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bonjour
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Se connecter
            </button>
          </div>
        </form>
        {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>} {}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
          <div className="mt-6">
          <Link href="/inscription" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Inscription</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
