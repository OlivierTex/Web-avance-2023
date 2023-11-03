import Link from 'next/link';

const Navigation = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <nav className="navigation">
        <Link href="/" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Accueil</Link>
        <Link href="/articles" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Articles</Link>
        <Link href="/bank" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Banque d'image</Link>
        <Link href="/about" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">À propos</Link>
        <Link href="/contacts" className="w-32 text-center text-lg text-custom5 font-medium px-3 py-2 rounded-md">Contacts</Link>
      </nav>
    </div>
  );
};

export default Navigation;
