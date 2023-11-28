import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../supabase';

const AuthContext = createContext();

export function UserContext({ children }) {
  const [user_session, setUserSession] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUserSession(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUserSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();

  }, []);

  return <AuthContext.Provider value={{ user_session }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
