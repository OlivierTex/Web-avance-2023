import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabase';

const ComptePage = () => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log(session.user.id);
        
        const fetchUser = async () => {
          const { data, error } = await supabase
          .from('user')
          .select('type_compte')
          .eq('id', session.user.id)
  
          if (error) {
            console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
            return;
          }

          console.log(data);

          if (data.length > 0) {
            const user = data[0];
            console.log(user);
            if (user.type_compte === 'user') {
              router.push(`/utilisateur/${session.user.id}`);
              console.log('user');
            } else if (user.type_compte === 'admin') {
              router.push(`/admin/${session.user.id}`);
              console.log('admin');
            } else {
              console.log('Role non reconnu');
              router.push('/login');
            }
          } else {
            router.push('/login');
          }
        };
        
        fetchUser();

      }
    });
  }, [router]);

  return (
    <div>
      <h1>Gestion du compte</h1>
      
    </div>
  );
}

export default ComptePage;