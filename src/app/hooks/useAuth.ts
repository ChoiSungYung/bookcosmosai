import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user?.id, name }]);

      if (profileError) throw profileError;

      router.push('/login?message=회원가입이 완료되었습니다. 로그인해주세요.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.refresh();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.refresh();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github' | 'kakao') => {
    try {
      setLoading(true);
      setError(null);

      const options: { redirectTo: string; scopes?: string } = {
        redirectTo: `${window.location.origin}/auth/callback`,
      };

      if (provider === 'kakao') {
        options.scopes = 'profile_nickname profile_image account_email';
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : '소셜 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
  };
} 