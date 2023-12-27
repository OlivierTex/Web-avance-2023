import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import supabase from "../supabase";

export default function DarkModeToggle() {
  const { user_session } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserDarkMode = async () => {
      if (user_session) {
        const { data, error } = await supabase
          .from("user")
          .select("darkMode")
          .eq("id", user_session.id)
          .single();

        if (error) {
          console.error(error);
        } else if (data) {
          setIsDarkMode(data.darkMode);
          if (data.darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      }
    };

    fetchUserDarkMode();
  }, [user_session]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (user_session) {
      const { error } = await supabase
        .from("user")
        .update({
          darkMode: newDarkMode,
        })
        .eq("id", user_session.id);

      if (error) {
        console.error(error);
        let errorMessage = "";

        switch (error.message) {
          default:
            errorMessage = "Une erreur s'est produite.";
        }

        alert(errorMessage);
      } else {
        console.log("User dark mode preference updated successfully");
      }
    }
  };

  return (
    <button
      className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center justify-center"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <img
          src="/images/sun-regular.svg"
          alt="Activer le Mode Clair"
          className="w-8 h-8"
        />
      ) : (
        <img
          src="/images/moon-regular.svg"
          alt="Activer le Mode Sombre"
          className="w-8 h-8"
        />
      )}
    </button>
  );
}
