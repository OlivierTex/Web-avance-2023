import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabase'; 

const Inscription = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const router = useRouter();

  const userExists = async (field, value) => {
    const { data, error } = await supabase
      .from('users')
      .select(field)
      .eq(field, value);

    if (error && error.message !== "The query returned no results") {
      console.error('Une erreur s\'est produite lors de la vérification:', error.message);
      throw error;
    }
    
    return data.length > 0; 
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      console.error("Les mots de passe ne correspondent pas.");
      return;
    }

    const emailExists = await userExists('email', email);
    if (emailExists) {
      setMessage('Cette adresse e-mail est déjà utilisée.'); 
      console.error("Cette adresse e-mail est déjà utilisée.");
      return;
    }

    const usernameExists = await userExists('username', username);
    if (usernameExists) {
      console.error("Ce nom d'utilisateur est déjà pris.");
      return;
    }

    try {
      const passwordHash = password; 

      const { data, error } = await supabase
        .from('users')
        .insert([
          { email: email, username: username, password_hash: passwordHash, type_compte: 'user' },
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
    <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inscription
        </h2>
        <form className="space-y-6" onSubmit={handleSignUp}>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            id="password-confirm"
            name="password-confirm"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Confirmer le mot de passe"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscription;
