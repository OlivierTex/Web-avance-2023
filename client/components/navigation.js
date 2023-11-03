import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="navigation">
      <Link href="/" className="nav-link">Accueil</Link>
      <Link href="/articles" className="nav-link">Articles</Link>
      <Link href="/bank" className="nav-link">Banque d'image</Link>
      <Link href="/about" className="nav-link">À propos</Link>
      <Link href="/contacts" className="nav-link">Contacts</Link>
    </nav>
  );
};

export default Navigation;
