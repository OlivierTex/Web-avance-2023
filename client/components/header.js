import Link from 'next/link';
import { useEffect } from 'react';

const Header = () => {
  useEffect(() => {
    const toggleTheme = () => {
      let toggle = 0;
      const switchTheme = document.querySelector('.bouton-sumbit');

      switchTheme.addEventListener('click', () => {
        if (toggle === 0) {
          document.documentElement.style.setProperty('--ecriture', '#f1f1f1');
          document.documentElement.style.setProperty('--background', '#262626');
          toggle++;
        } else {
          document.documentElement.style.setProperty('--ecriture', '#262626');
          document.documentElement.style.setProperty('--background', '#f1f1f1');
          toggle--;
        }
      });
    };

    toggleTheme();
  }, []);

  return (
    <header className="header">
      <nav className="flex items-center justify-center h-full">
        <Link href="/" className="nav-link">Accueil</Link>
        <Link href="/bank" className="nav-link">Banque d'image</Link>
        <Link href="/articles" className="nav-link">Articles</Link>
        <Link href="/about" className="nav-link">À propos</Link>
        <Link href="/contacts" className="nav-link">Contacts</Link>
        <button className="bouton-sumbit">Switch Theme</button>
      </nav>
    </header>
  );
};

export default Header;
