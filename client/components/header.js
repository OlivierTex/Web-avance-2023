import Link from 'next/link';
import DarkModeToggle from '../components/DarkModeToggle';

const Header = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <header className="header">
        <div className="flex justify-between items-center">
          <DarkModeToggle />
          <a  className="name-site">ImageHive</a>
          <div className="flex justify-end space-x-2">
            <Link href="/account/login" className="bg-gray-800 text-white px-4 py-2 rounded-md">Login</Link>
            <Link href="/account/login" className="bg-gray-800 text-white px-4 py-2 rounded-md">Compte</Link>
          </div>
        </div>
        <br></br>
        <nav className="flex items-center justify-center h-full">
          <Link href="/" className="nav-link">Accueil</Link>
          <Link href="/bank" className="nav-link">Image</Link>
          <Link href="/video" className="nav-link">Video</Link>
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

