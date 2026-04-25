import { createContext, useEffect, useState } from "react";

import supabase from "../../supabase"; //importing supabase client to use in auth context for real authentication in the future

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's already a session when app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(session?.user ?? null);
    });

    // Cleanup listener when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  const loginAdmin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setIsAdmin(null);
  };

  const admin = !!isAdmin;

  const value = {
    isAdmin,
    admin,
    loginAdmin,
    isLoading,
    logoutAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
