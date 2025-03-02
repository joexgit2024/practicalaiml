
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkUserRole(session?.user?.id);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        checkUserRole(session?.user?.id);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function checkUserRole(userId: string | undefined) {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    // Query the user_roles table to check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    // If we find a record and there's no error, the user is an admin
    setIsAdmin(!!data && !error);
    
    // If no admin is found in the database yet, we'll use a fallback
    // This allows the first user to bootstrap the admin role
    if (!data && error) {
      // Fallback for first admin - check if user email is in adminEmails
      const adminEmails = ['admin@example.com']; // Add your admin emails here
      const { data: userData } = await supabase.auth.getUser();
      const isAdminByEmail = adminEmails.includes(userData.user?.email || '');
      
      // If user is admin by email, add them to the user_roles table
      if (isAdminByEmail) {
        // Try to insert the user as admin
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });
        
        // If insert was successful, set isAdmin to true
        if (!insertError) {
          setIsAdmin(true);
        }
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
