import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

// Allowlisted admin emails. Add aliases here as needed.
export const ADMIN_EMAILS = [
  'agonz439@asu.edu',
  'augusto.gonzalez-bonorino@cgu.edu',
  'agbonorino21@gmail.com',
];

export type AdminAuthState = {
  status: 'loading' | 'unauthenticated' | 'unauthorized' | 'authenticated';
  user: User | null;
  session: Session | null;
};

export function useAdminAuth(): AdminAuthState & {
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AdminAuthState>({
    status: 'loading',
    user: null,
    session: null,
  });

  useEffect(() => {
    // Subscribe first to avoid races
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session);
    });

    // Initial fetch
    supabase.auth.getSession().then(({ data }) => resolve(data.session));

    function resolve(session: Session | null) {
      if (!session) {
        setState({ status: 'unauthenticated', user: null, session: null });
        return;
      }
      const email = session.user.email?.toLowerCase() ?? '';
      const ok = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email);
      setState({
        status: ok ? 'authenticated' : 'unauthorized',
        user: session.user,
        session,
      });
    }

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    const normalized = email.trim().toLowerCase();
    if (!ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(normalized)) {
      return { error: 'This email is not authorized for admin access.' };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...state, signInWithMagicLink, signOut };
}
