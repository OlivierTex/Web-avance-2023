import Link from 'next/link'

const Navigation = () => {
  return (
    <nav className="bg-custom2 p-4 flex flex-col items-center">
        <Link href="/" className="nav-link">Accueil<br></br></Link>
        <Link href="/about" className="nav-link">À propos<br></br></Link>
        <Link href="/contacts" className="nav-link">Contacts<br></br></Link>
        <Link href="/articles" className="nav-link">Articles<br></br></Link>
    </nav>
  );
};

export default Navigation;
