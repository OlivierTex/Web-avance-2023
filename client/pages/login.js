import Link from 'next/link';
import Cookies from 'js-cookie';
import { supabase } from '../supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa  } from '@supabase/auth-ui-shared';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          console.log("SIGNED_IN");
          router.push('/account');
        }
      }
    );
  }, []);
if (!session)
{
  return (
    <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
        <div className="mt-8">
        <Auth 
        supabaseClient={supabase} 
        providers={['github']}
        appearance={{
          theme: ThemeSupa ,
        }}
      />
        </div>
      </div>
    </div>
  );
}
else {
  return (
    <div>
      <div>Logged in!</div>
      <div>
        <p onClick={fetchData}>Utilisateur: {session.user.user_metadata.full_name}</p>
        <p>Email: {session.user.email}</p>
      </div>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}
};
export default Login;
