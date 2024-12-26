"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import SocialLoginButton from "@/app/components/SocialLoginButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, error, signInWithProvider } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">로그인</h1>
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="비밀번호를 입력해주세요"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                로그인 상태 유지
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <p className="text-center text-sm text-gray-600">
            아직 회원이 아니신가요?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              회원가입하기
            </Link>
          </p>
        </form>
        <div className="relative mt-8 mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <SocialLoginButton
            provider="google"
            onClick={() => signInWithProvider("google")}
            disabled={loading}
          />
          <SocialLoginButton
            provider="github"
            onClick={() => signInWithProvider("github")}
            disabled={loading}
          />
          <SocialLoginButton
            provider="kakao"
            onClick={() => signInWithProvider("kakao")}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
