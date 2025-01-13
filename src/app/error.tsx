"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          문제가 발생했습니다
        </h2>
        <p className="text-gray-600 mb-8">
          죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
