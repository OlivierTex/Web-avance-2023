import Link from "next/link";
import DarkModeToggle from "../components/DarkModeToggle";
import { useAuth } from "./AuthContext";

const Header = () => {
  const { user_session, isAdmin } = useAuth();
  const isAuthenticated = user_session !== null;

  return (
    <div className={`bg-light dark:bg-dark`}>
      <header className="header">
        <div className="flex justify-between items-center">
          <DarkModeToggle />
          <a className="name-site">ImageHive</a>
          <div className="flex justify-end space-x-2">
            {/* Méthode ci-dessous nécessaire pour afficher correctement les images de comptes après déconnexion ou connexion.*/}
            <Link
              href={isAuthenticated ? "/account" : "/account/login"}
              className="bg-gray-300 text-white px-4 py-2 rounded-md"
            >
              <img
                className="w-8 h-8"
                src="/images/user-check-solid.svg"
                alt="Compte"
                style={{ display: isAuthenticated ? "block" : "none" }}
              />
              <img
                className="w-8 h-8"
                src="/images/user-solid.svg"
                alt="Compte"
                style={{ display: isAuthenticated ? "none" : "block" }}
              />
            </Link>
            {isAdmin && (
              <Link
                href="/account/admin"
                className="bg-gray-300 text-white px-4 py-2 rounded-md"
              >
                <img
                  className="w-8 h-8"
                  src="/images/user-secret-solid.svg"
                  alt="Admin"
                />
              </Link>
            )}
          </div>
        </div>
        <br></br>
        <nav className="flex items-center justify-center h-full">
          <Link href="/" className="nav-link">
            Accueil
          </Link>
          <Link href="/bank" className="nav-link">
            Image
          </Link>
          <Link href="/video" className="nav-link">
            Video
          </Link>
          <Link href="/album" className="nav-link">
            Album
          </Link>
          <Link href="/about" className="nav-link">
            À propos
          </Link>
          <Link href="/contacts" className="nav-link">
            Contacts
          </Link>
        </nav>
        <br></br>
        <div className="w-full border-b-2 border-black"></div>
      </header>
    </div>
  );
};

export default Header;
