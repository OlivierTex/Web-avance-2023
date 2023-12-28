import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../supabase";
import { useRouter } from "next/router";
import gravatar from "gravatar";

const Header = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [gravatarUrl, setGravatarUrl] = useState("");
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
          .select("username, email")
          .eq("id", user_session.id);

        if (error) {
          console.error(error);
        } else if (users.length > 0) {
          setUsername(users[0].username);
          setGravatarUrl(
            gravatar.url(users[0].email, { s: "32", r: "g", d: "retro" }, true),
          );
        }
      }
    };

    fetchUsername();
  }, [user_session]);

  return (
    <div className={`bg-light dark:bg-dark`}>
      <header className="header">
        <div className="flex flex-col items-center mb-4">
          <div className="flex justify-between items-center w-full">
            <DarkModeToggle />
            <div className="flex items-center justify-end space-x-2">
              {/* Méthode ci-dessous nécessaire pour afficher correctement les images de comptes après déconnexion ou connexion.*/}
              <Link
                href={isAuthenticated ? "/account" : "/account/login"}
                className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center"
              >
                {isAuthenticated && (
                  <div className="bg-gray-800 rounded h-8 flex items-center">
                    <img src={gravatarUrl} alt="Avatar" className="mr-3" />
                    <span className="mr-2">{username}</span>
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
                  className="bg-gray-800 text-black px-4 py-2 rounded-md"
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
                  className="bg-gray-800 text-black px-4 py-2 rounded-md"
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
          <a className="name-site">ImageHive</a>
        </div>
        <nav className="flex items-center justify-center h-full mb-4">
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
        <div className="w-full border-b-2 border-black"></div>
      </header>
    </div>
  );
};

export default Header;
