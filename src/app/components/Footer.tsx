"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">북서머리</h3>
            <p className="text-gray-600 dark:text-gray-400">
              좋은 책의 핵심을 쉽게 만나보세요
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400"
                >
                  소개
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400"
                >
                  문의하기
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400"
                >
                  이용약관
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">구독하기</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="이메일 주소"
                className="px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700">
                구독
              </button>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          © 2024 북서머리. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
