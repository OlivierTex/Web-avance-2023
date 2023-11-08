import React from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const token = context.req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = getUserFromToken(token); 

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: { user } };
}

const MonCompte = ({ user }) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div>
      <h1>Bienvenue sur votre compte, {user.username}</h1>
      <p>Vous êtes connecté en tant que {user.email}</p>
      {}
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
};

export default MonCompte;

function getUserFromToken(token) {

  return { username: 'JohnDoe', email: 'john@example.com' };
}
