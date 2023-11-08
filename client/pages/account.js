import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtectedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAuthenticated');

    if (!isLoggedIn) {
      router.push('/dashboard/admin');
    }
  }, [router]);

  return (
    <div>
      Contenu sécurisé visible uniquement par les utilisateurs authentifiés
    </div>
  );
};

export default ProtectedPage;
