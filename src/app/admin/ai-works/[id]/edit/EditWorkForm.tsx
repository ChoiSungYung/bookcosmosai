"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, FormEvent, KeyboardEvent } from "react";
import dynamic from "next/dynamic";

// ReactQuill을 동적 import (SSR 비활성화)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // 기본 테마

interface Work {
  id: number;
  title: string;
  genre: string | null;
  description: string | null;
  prompt: string | null;
  original_text: string | null;
  variation_prompt: string | null;
  variation_text: string | null;
  is_public: boolean;
  status: string;
  library_id: string | null;
  themes: string[] | null;
  cover_url: string | null;
}

interface Library {
  id: string;
  name: string;
}

interface Props {
  initialWork: Work;
  libraries: Library[];
}

// ReactQuill 모듈/포맷 설정
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ lineHeight: ["1.0", "1.2", "1.5", "2.0"] }],
    ["blockquote"],
    ["clean"],
  ],
};
const quillFormats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "indent",
  "lineHeight",
  "blockquote",
];

export default function EditWorkForm({ initialWork, libraries }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [themeInput, setThemeInput] = useState("");

  // 원래 work 상태
  const [work, setWork] = useState({
    ...initialWork,
    title: initialWork.title || "",
    genre: initialWork.genre || "",
    description: initialWork.description || "",
    prompt: initialWork.prompt || "",
    is_public: initialWork.is_public || false,
    status: initialWork.status || "draft",
    library_id: initialWork.library_id || "",
    themes: initialWork.themes || [],
    cover_url: initialWork.cover_url || null,
  });

  // Quill 내용은 별도의 로컬 상태로 관리
  const [localOriginalText, setLocalOriginalText] = useState(
    initialWork.original_text || ""
  );
  const [localVariationText, setLocalVariationText] = useState(
    initialWork.variation_text || ""
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const genres = [
    { value: "소설", label: "소설" },
    { value: "시", label: "시" },
    { value: "에세이", label: "에세이" },
    { value: "단편", label: "단편" },
    { value: "판타지", label: "판타지" },
    { value: "추리", label: "추리" },
    { value: "로맨스", label: "로맨스" },
    { value: "SF", label: "SF" },
    { value: "호러", label: "호러" },
    { value: "역사", label: "역사" },
    { value: "문학", label: "문학" },
    { value: "인문사회", label: "인문사회" },
    { value: "자기계발", label: "자기계발" },
    { value: "경제경영", label: "경제경영" },
    { value: "실용교양", label: "실용교양" },
    { value: "자녀교육", label: "자녀교육" },
    { value: "아동", label: "아동" },
    { value: "청소년", label: "청소년" },
    { value: "전기", label: "전기" },
    { value: "기타", label: "기타" },
  ];

  // 표지 이미지 선택
  const handleCoverSelection = (file: File | null) => {
    if (file) {
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setCoverFile(null);
      setPreviewUrl(null);
    }
  };

  // "저장" 시점에만 Quill 내용을 work에 반영
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      let cover_url = work.cover_url;

      // 커버 이미지 업로드 로직 (기존 로직 복사)
      if (coverFile) {
        try {
          if (coverFile.size > 5 * 1024 * 1024) {
            throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
          }
          if (!coverFile.type.startsWith("image/")) {
            throw new Error("이미지 파일만 업로드 가능합니다.");
          }

          // 기존 파일 삭제
          if (work.cover_url) {
            const oldFileName = work.cover_url.split("/").pop();
            if (oldFileName) {
              await supabase.storage
                .from("covers")
                .remove([oldFileName])
                .then(({ error }) => {
                  if (error)
                    console.warn("기존 파일 삭제 실패:", error.message);
                });
            }
          }

          // 새 파일 업로드
          const fileExt = coverFile.name.split(".").pop();
          const fileName = `${work.id}_${Date.now()}.${fileExt}`;

          const { error: uploadError, data: uploadData } =
            await supabase.storage.from("covers").upload(fileName, coverFile, {
              cacheControl: "3600",
              contentType: coverFile.type,
              upsert: true,
            });

          if (uploadError) {
            console.error("Upload error details:", uploadError);
            throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
          }

          if (!uploadData) {
            throw new Error("업로드된 파일 정보를 받지 못했습니다.");
          }

          const { data: urlData } = supabase.storage
            .from("covers")
            .getPublicUrl(fileName);

          if (!urlData) {
            throw new Error("공개 URL을 가져오는데 실패했습니다.");
          }

          cover_url = urlData.publicUrl;
        } catch (uploadError) {
          console.error("Image upload error details:", uploadError);
          throw new Error(
            uploadError instanceof Error
              ? uploadError.message
              : "이미지 업로드 중 오류가 발생했습니다."
          );
        }
      }

      // DB 업데이트 시점: localOriginalText / localVariationText 반영
      const { error: updateError } = await supabase
        .from("ai_works")
        .update({
          title: work.title,
          genre: work.genre || null,
          description: work.description || null,
          prompt: work.prompt || null,
          original_text: localOriginalText || null,
          variation_prompt: work.variation_prompt || null,
          variation_text: localVariationText || null,
          is_public: work.is_public,
          status: work.status,
          library_id: work.library_id || null,
          themes: work.themes || [],
          cover_url: cover_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", work.id);

      if (updateError) {
        throw updateError;
      }

      setMessage("성공적으로 저장되었습니다.");
      router.refresh();
      router.push("/admin/ai-works");
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("작품 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  // 테마 입력 핸들러 수정
  const handleThemeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const themes = e.target.value
      .split("\n")
      .map((theme) => theme.trim())
      .filter((theme) => theme.length > 0);

    setWork((prev) => ({
      ...prev,
      themes: themes,
    }));
  };

  // 테마 제거
  const removeTheme = (themeToRemove: string) => {
    setWork((prev) => ({
      ...prev,
      themes: (prev.themes || []).filter((theme) => theme !== themeToRemove),
    }));
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">작품 수정</h1>

        {message && (
          <div
            className={`mb-4 p-4 rounded ${
              message.includes("성공")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="max-w-2xl">
            {/* 제목 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                제목
              </label>
              <input
                type="text"
                value={work.title}
                onChange={(e) => setWork({ ...work, title: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* 장르 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                장르
              </label>
              <select
                value={work.genre || ""}
                onChange={(e) => setWork({ ...work, genre: e.target.value })}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">장르 선택</option>
                {genres.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 설명 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                설명
              </label>
              <textarea
                value={work.description || ""}
                onChange={(e) =>
                  setWork({ ...work, description: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={8}
              />
            </div>

            {/* 프롬프트 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                프롬프트
              </label>
              <textarea
                value={work.prompt || ""}
                onChange={(e) => setWork({ ...work, prompt: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={8}
              />
            </div>

            {/* 본문 (ReactQuill) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mt-2 mb-2">
                본문
              </label>
              <ReactQuill
                value={localOriginalText}
                onChange={setLocalOriginalText}
                modules={quillModules}
                formats={quillFormats}
                theme="snow"
                style={{
                  height: 400,
                  marginBottom: 100,
                }}
                className="prose prose-lg max-w-none"
              />
            </div>

            {/* 변주 프롬프트 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mt-2 mb-2">
                변주 프롬프트
              </label>
              <textarea
                value={work.variation_prompt || ""}
                onChange={(e) =>
                  setWork({ ...work, variation_prompt: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={8}
              />
            </div>

            {/* 변주 텍스트 (ReactQuill) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                변주 텍스트
              </label>
              <ReactQuill
                value={localVariationText}
                onChange={setLocalVariationText}
                modules={quillModules}
                formats={quillFormats}
                theme="snow"
                style={{ height: 200, marginBottom: 100 }}
              />
            </div>

            {/* 라이브러리 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                라이브러리
              </label>
              <select
                value={work.library_id || ""}
                onChange={(e) =>
                  setWork({ ...work, library_id: e.target.value })
                }
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">라이브러리 선택</option>
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    {lib.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 공개 여부 */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={work.is_public}
                  onChange={(e) =>
                    setWork({ ...work, is_public: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-gray-700 text-sm font-bold">공개</span>
              </label>
            </div>

            {/* 상태 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                상태
              </label>
              <select
                value={work.status}
                onChange={(e) => setWork({ ...work, status: e.target.value })}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="draft">임시저장</option>
                <option value="published">발행</option>
              </select>
            </div>

            {/* 테마 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                테마
              </label>
              <textarea
                value={work.themes?.join("\n") || ""}
                onChange={handleThemeInput}
                placeholder="테마를 입력하세요. 각 줄에 하나의 테마를 입력하세요."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={5}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {work.themes?.map((theme, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {theme}
                    <button
                      type="button"
                      onClick={() => removeTheme(theme)}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 표지 이미지 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                표지 이미지
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleCoverSelection(e.target.files?.[0] || null)
                }
                className="mb-2"
              />
              {(previewUrl || work.cover_url) && (
                <div className="mt-2">
                  <img
                    src={previewUrl || work.cover_url || undefined}
                    alt="표지 미리보기"
                    className="max-h-48 object-contain"
                  />
                </div>
              )}
            </div>

            {/* 버튼들 */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/admin/works")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {saving ? "저장중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
