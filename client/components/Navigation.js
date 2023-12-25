import Link from "next/link";

const Navigation = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <nav className="navigation">
        <Link href="/" className="nav-link">
          Accueil
        </Link>
        <Link href="/articles" className="nav-link">
          Articles
        </Link>
        <Link href="/bank" className="nav-link">
          Banque d'image
        </Link>
        <Link href="/about" className="nav-link">
          À propos
        </Link>
        <Link href="/contacts" className="nav-link">
          Contacts
        </Link>
      </nav>
    </div>
  );
};

export default Navigation;
