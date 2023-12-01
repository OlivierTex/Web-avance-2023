import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase";

const AuthContext = createContext();

export function UserContext({ children }) {
  const [user_session, setUserSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUserSession(session?.user ?? null);
    updateIsAdmin(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUserSession(session?.user ?? null);
        updateIsAdmin(session?.user ?? null);
      },
    );

    return () => authListener.unsubscribe();
  }, []);

  const updateIsAdmin = async (user) => {
    if (user) {
      const { data, error } = await supabase
        .from("user")
        .select("type_compte")
        .eq("id", user.id)
        .single();

      if (data && data.type_compte === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user_session, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
