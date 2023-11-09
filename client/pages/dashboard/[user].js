import { useRouter } from 'next/router';

const Users = () => {
  const router = useRouter();

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    router.push('/login');
    return null; 
  }

  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1">Compte</h1>
      {
        <div className="paragraphe">Cette application est écrite dans le cadre du cours de Tech Web de l'ECE Paris par Greg, Olivier et Marc</div>
      }
    </div>
  );
};

export default Users;
