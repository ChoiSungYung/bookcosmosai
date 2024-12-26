"use client";

import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // 또는 로딩 스피너
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md dark:bg-gray-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl">
            북서머리
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/books" className="hover:text-blue-600">
              전체 도서
            </Link>
            <Link href="/categories" className="hover:text-blue-600">
              카테고리
            </Link>
            <Link href="/popular" className="hover:text-blue-600">
              인기 요약
            </Link>
            <Link href="/recent" className="hover:text-blue-600">
              최신 요약
            </Link>
            <Link href="/ai-library" className="hover:text-blue-600">
              AI 문학관
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {!user ? (
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                로그인
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/mypage" className="hover:text-blue-600">
                  내 정보
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                  }}
                  className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
