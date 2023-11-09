import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const ComptePage = () => {
  const router = useRouter();

  useEffect(() => {
    const obtenirInformationsUtilisateur = () => {
      const cookieAuth = Cookies.get('mon_cookie_auth');

      if (cookieAuth) {
        const typeUtilisateurCookie = Cookies.get('userType');
        const userIdCookie = Cookies.get('userId');

        if (typeUtilisateurCookie && userIdCookie) {
          const typeUtilisateur = typeUtilisateurCookie;
          const userId = userIdCookie;

          if (typeUtilisateur === 'user' || typeUtilisateur === 'admin') {
            return { typeUtilisateur, userId };
          }
        }
      }
      return null;
    };

    try {
      const informationsUtilisateur = obtenirInformationsUtilisateur();

      if (informationsUtilisateur && informationsUtilisateur.typeUtilisateur) {
        const { typeUtilisateur, userId } = informationsUtilisateur;

        if (typeUtilisateur === 'user') {
          router.push(`/utilisateur/${userId}`);
        } else if (typeUtilisateur === 'admin') {
          router.push(`/admin/${userId}`);
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Erreur lors de la redirection:', error);
      router.push('/login');
    }
  }, [router]);

  return <div>Redirection...</div>;
};

export default ComptePage;
