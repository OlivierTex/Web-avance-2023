import Link from 'next/link';
import { useEffect } from 'react';
import DarkModeToggle from '../components/DarkModeToggle';

const Header = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <header className="header">
      <DarkModeToggle />
        <nav className="flex items-center justify-center h-full">
       
          <Link href="/" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Accueil</Link>
          <Link href="/bank" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Banque d'image</Link>
          <Link href="/articles" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Articles</Link>
          <Link href="/about" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">À propos</Link>
          <Link href="/contacts" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Contacts</Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
