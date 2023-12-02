import Link from "next/link";
import DarkModeToggle from "../components/DarkModeToggle";
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../supabase";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const { user_session, isAdmin } = useAuth();
  const isAuthenticated = user_session !== null;

  const deconnecterUtilisateur = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else if (
      router.pathname === "/account" ||
      router.pathname === "/account/admin"
    ) {
      router.push("/account/login");
    } else {
      router.reload();
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      if (user_session) {
        const { data: users, error } = await supabase
          .from("user")
          .select("username")
          .eq("id", user_session.id);

        if (error) {
          console.error(error);
        } else if (users.length > 0) {
          setUsername(users[0].username);
        }
      }
    };

    fetchUsername();
  }, [user_session]);

  return (
    <div className={`bg-light dark:bg-dark`}>
      <header className="header">
        <div className="flex justify-between items-center mb-4">
          <DarkModeToggle />
          <a className="name-site">ImageHive</a>
          <div className="flex items-center justify-end space-x-2">
            {/* Méthode ci-dessous nécessaire pour afficher correctement les images de comptes après déconnexion ou connexion.*/}
            <Link
              href={isAuthenticated ? "/account" : "/account/login"}
              className="bg-gray-300 text-black px-4 py-2 rounded-md flex items-center"
            >
              {isAuthenticated && (
                <div className="bg-gray-300 p-2 rounded h-8 flex items-center">
                  <span className="mr-2">{username}</span>
                  <img
                    className="w-8 h-8"
                    src="/images/user-check-solid.svg"
                    alt="Compte"
                    style={{ display: isAuthenticated ? "block" : "none" }}
                  />
                </div>
              )}
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
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                <img
                  className="w-8 h-8"
                  src="/images/user-secret-solid.svg"
                  alt="Admin"
                />
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={deconnecterUtilisateur}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                <img
                  className="w-8 h-8"
                  src="/images/arrow-right-from-bracket-solid.svg"
                  alt="Logout"
                />
              </button>
            )}
          </div>
        </div>
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
