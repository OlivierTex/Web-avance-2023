import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-zinc-300 p-4 h-20">
      <nav className="flex items-center justify-center h-full">
        <Link href="/" className="nav-link">Accueil </Link>
        <Link href="/about" className="nav-link">À propos </Link>
        <Link href="/contacts" className="nav-link">Contacts </Link>
        <Link href="/articles" className="nav-link">Articles</Link>
      </nav>
    </header>
  );
};

export default Header;
