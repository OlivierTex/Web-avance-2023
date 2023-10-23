import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <nav>
        <Link href="/">Accueil </Link>
        <Link href="/about">À propos </Link>
        <Link href="/contacts">Contacts </Link>
        <Link href="/articles">Articles</Link>
      </nav>
    </header>
  );
};

export default Header;
