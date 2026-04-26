import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@/types';

function mapUser(u: { id: string; email?: string; user_metadata?: Record<string, string> }): AuthUser {
  return {
    id: u.id,
    email: u.email ?? '',
    username:
      u.user_metadata?.username ??
      u.user_metadata?.full_name ??
      u.email?.split('@')[0] ??
      'user',
    avatar: u.user_metadata?.avatar_url ?? u.user_metadata?.picture,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ? mapUser(session.user) : null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(mapUser(session.user));
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(mapUser(session.user));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = () => supabase.auth.signOut();

  return { user, loading, logout };
}
