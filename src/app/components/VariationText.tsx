"use client";

import { useState } from "react";

interface VariationTextProps {
  prompt: string;
  originalText: string;
  variationPrompt?: string;
  variationText?: string;
}

export default function VariationText({
  prompt,
  originalText,
  variationPrompt,
  variationText,
}: VariationTextProps) {
  const [showVariation, setShowVariation] = useState(false);

  if (!variationText) {
    return (
      <div>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">원본 프롬프트:</h3>
          <p className="text-sm">{prompt}</p>
        </div>
        <div className="whitespace-pre-wrap">{originalText}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowVariation(!showVariation)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {showVariation ? "원본 보기" : "변주 버전 보기"}
        </button>
      </div>

      {showVariation ? (
        <div>
          <div className="bg-yellow-50 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">변주 프롬프트:</h3>
            <p className="text-sm">{variationPrompt}</p>
          </div>
          <div className="whitespace-pre-wrap">{variationText}</div>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">원본 프롬프트:</h3>
            <p className="text-sm">{prompt}</p>
          </div>
          <div className="whitespace-pre-wrap">{originalText}</div>
        </div>
      )}
    </div>
  );
}
