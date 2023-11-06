import Link from 'next/link';
import { useEffect } from 'react';
import DarkModeToggle from '../components/DarkModeToggle';

const Header = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <header className="header">
        <div className="flex justify-between items-center">
          <DarkModeToggle />
          <div className="flex justify-end">
            <Link href="/login" className="bg-gray-800 text-white px-4 py-2 rounded-md">Login</Link>
          </div>
        </div>
        <nav className="flex items-center justify-center h-full">
          <Link href="/" className="nav-link">Accueil</Link>
          <Link href="/bank" className="nav-link">Banque</Link>
          <Link href="/articles" className="nav-link">Articles</Link>
          <Link href="/about" className="nav-link">À propos</Link>
          <Link href="/contacts" className="nav-link">Contacts</Link>
        </nav>
        <br></br>
        <div className="w-full border-b-2 border-black"></div>
      </header>
    </div>
  );
};

export default Header;
