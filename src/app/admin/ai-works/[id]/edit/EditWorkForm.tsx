"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function EditWorkForm({ initialWork, libraries }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [themeInput, setThemeInput] = useState("");
  const [work, setWork] = useState({
    ...initialWork,
    title: initialWork.title || "",
    genre: initialWork.genre || "",
    description: initialWork.description || "",
    prompt: initialWork.prompt || "",
    original_text: initialWork.original_text || "",
    variation_prompt: initialWork.variation_prompt || "",
    variation_text: initialWork.variation_text || "",
    is_public: initialWork.is_public || false,
    status: initialWork.status || "draft",
    library_id: initialWork.library_id || "",
    themes: initialWork.themes || [],
    cover_url: initialWork.cover_url || null,
  });
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
    { value: "아동", label: "아동" },
    { value: "청소년", label: "청소년" },
    { value: "전기", label: "전기" },
    { value: "기타", label: "기타" },
  ];

  const handleCoverSelection = (file: File | null) => {
    if (file) {
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setCoverFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      let cover_url = work.cover_url;

      if (coverFile) {
        try {
          // 파일 크기 체크
          if (coverFile.size > 5 * 1024 * 1024) {
            // 5MB
            throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
          }

          // 파일 타입 체크
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

      // 작품 정보 업데이트
      const { error: updateError } = await supabase
        .from("ai_works")
        .update({
          title: work.title,
          genre: work.genre || null,
          description: work.description || null,
          prompt: work.prompt || null,
          original_text: work.original_text || null,
          variation_prompt: work.variation_prompt || null,
          variation_text: work.variation_text || null,
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

  const handleThemeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (themeInput.trim()) {
        setWork({
          ...work,
          themes: [...(work.themes || []), themeInput.trim()],
        });
        setThemeInput("");
      }
    }
  };

  const removeTheme = (themeToRemove: string) => {
    setWork({
      ...work,
      themes: (work.themes || []).filter((theme) => theme !== themeToRemove),
    });
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
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                프롬프트
              </label>
              <textarea
                value={work.prompt || ""}
                onChange={(e) => setWork({ ...work, prompt: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                본문
              </label>
              <textarea
                value={work.original_text || ""}
                onChange={(e) =>
                  setWork({ ...work, original_text: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={10}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                변주 프롬프트
              </label>
              <textarea
                value={work.variation_prompt || ""}
                onChange={(e) =>
                  setWork({ ...work, variation_prompt: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                변주 텍스트
              </label>
              <textarea
                value={work.variation_text || ""}
                onChange={(e) =>
                  setWork({ ...work, variation_text: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={10}
              />
            </div>

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

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                테마
              </label>
              <div className="mb-2">
                <input
                  type="text"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  onKeyDown={handleThemeKeyDown}
                  placeholder="테마를 입력하세요. Enter를 누르세요"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex flex-wrap gap-2">
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
