import Link from 'next/link'

const Navigation = () => {
  return (
    <nav>
      <Link href="/">Accueil<br></br></Link>
      <Link href="/about">À propos<br></br></Link>
      <Link href="/contacts">Contacts<br></br></Link>
      <Link href="/articles">Articles<br></br></Link>
    </nav>
  );
};

export default Navigation;
