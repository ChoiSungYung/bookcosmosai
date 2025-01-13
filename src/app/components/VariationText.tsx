"use client";

import { useState } from "react";

interface VariationTextProps {
  prompt: string; // 원본 프롬프트
  originalText: string; // 원본 텍스트(HTML 형태)
  variationPrompt: string; // 변주 프롬프트
  variationText: string; // 변주 텍스트(HTML 형태)
}

function replaceNewlinesWithBr(text: string) {
  // \n (LF), \r\n (CRLF) 모두 처리
  return text.replace(/\r?\n/g, "<br>");
}

export default function VariationText({
  prompt,
  originalText,
  variationPrompt,
  variationText,
}: VariationTextProps) {
  const [showOriginalPrompt, setShowOriginalPrompt] = useState(false);
  const [showVariationPrompt, setShowVariationPrompt] = useState(false);

  // variationPrompt가 실제로 비어 있지 않은지 판별 (공백 제외)
  const hasVariationPrompt = variationPrompt?.trim().length > 0;

  return (
    <div>
      {/* 원본 프롬프트 토글 버튼 */}
      <button
        onClick={() => setShowOriginalPrompt(!showOriginalPrompt)}
        className="px-3 py-2 rounded bg-blue-100 text-blue-800 font-medium mb-6"
      >
        {showOriginalPrompt ? "원본 프롬프트 숨기기" : "원본 프롬프트 보기"}
      </button>
      {showOriginalPrompt && (
        <div className="bg-blue-50 p-4 rounded mt-2 whitespace-pre-wrap mb-2">
          {prompt}
        </div>
      )}

      {/* 원본 텍스트 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-6">작품 본문</h2>
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: replaceNewlinesWithBr(originalText),
          }}
        />
      </div>

      {/* 변주(재창작) 프롬프트/본문 섹션 */}
      {hasVariationPrompt && (
        <>
          <button
            onClick={() => setShowVariationPrompt(!showVariationPrompt)}
            className="px-3 py-2 rounded bg-blue-100 text-blue-800 font-medium"
          >
            {showVariationPrompt
              ? "재창작 프롬프트 숨기기"
              : "재창작 프롬프트 보기"}
          </button>

          {showVariationPrompt && (
            <div>
              <div className="bg-blue-50 p-4 rounded mt-2 whitespace-pre-wrap">
                {variationPrompt}
              </div>
              <div className="my-6">
                <h2 className="text-xl font-semibold mb-6">재창작 본문</h2>
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: replaceNewlinesWithBr(variationText),
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
