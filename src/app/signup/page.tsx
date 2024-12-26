"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const { signUp, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관에 동의해주세요.");
      return;
    }
    await signUp(email, password, name);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">회원가입</h1>
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
              placeholder="8자 이상 입력해주세요"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordConfirm"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="비밀번호를 다시 입력해주세요"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="이름을 입력해주세요"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="termsAgree"
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="termsAgree"
                className="ml-2 block text-sm text-gray-700"
              >
                <span className="mr-1">[필수]</span>
                <a href="/terms" className="text-blue-600 hover:underline">
                  이용약관
                </a>
                에 동의합니다
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacyAgree"
                required
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="privacyAgree"
                className="ml-2 block text-sm text-gray-700"
              >
                <span className="mr-1">[필수]</span>
                <a href="/privacy" className="text-blue-600 hover:underline">
                  개인정보 처리방침
                </a>
                에 동의합니다
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>

          <p className="text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              로그인하기
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
