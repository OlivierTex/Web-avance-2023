import { supabase } from '../../supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa  } from '@supabase/auth-ui-shared';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
  
      if (session) {
        const { data, error } = await supabase
          .from('user')
          .select('type_compte')
          .eq('id', session.user.id);
  
        if (error) {
          console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
          return;
        }
  
        if (data.length > 0) {
          const user = data[0];
          if (user.type_compte === 'user') {
            setTimeout(() => {
              router.push(`/account`);
            }, 500);
          } else if (user.type_compte === 'admin') {
            setTimeout(() => {
              router.push(`/account/admin`);
            }, 500);
          }
        }
      }
    });
  
    return () => subscription.unsubscribe();
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
  else
  {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion réussie
          </h2>
          <p className="text-center text-gray-600">
            Vous allez être redirigé dans un instant...
          </p>
        </div>
      </div>
    );
  }

};
export default Login;
