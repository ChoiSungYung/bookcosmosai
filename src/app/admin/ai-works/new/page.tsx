"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Library {
  id: string;
  name: string;
}

export default function NewWorkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [generating, setGenerating] = useState(false);
  const [themeInput, setThemeInput] = useState("");
  const [message, setMessage] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Quill 설정
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ lineHeight: ["1.0", "1.2", "1.5", "2.0"] }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["blockquote"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "lineHeight",
    "indent",
    "blockquote",
  ];

  const [work, setWork] = useState({
    title: "",
    genre: "",
    description: "",
    prompt: "",
    original_text: "",
    variation_prompt: "",
    variation_text: "",
    is_public: false,
    status: "draft",
    library_id: "",
    themes: [] as string[],
    cover_url: null as string | null,
  });

  // Quill 내용은 별도의 로컬 상태로 관리
  const [localOriginalText, setLocalOriginalText] = useState("");
  const [localVariationText, setLocalVariationText] = useState("");

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

  useEffect(() => {
    const fetchLibraries = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_libraries")
        .select("id, name")
        .order("name");

      if (data) {
        setLibraries(data);
      }
    };

    fetchLibraries();
  }, []);

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

  // 테마 입력
  const handleThemeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (themeInput.trim()) {
        setWork((prev) => ({
          ...prev,
          themes: [...(prev.themes || []), themeInput.trim()],
        }));
        setThemeInput("");
      }
    }
  };

  // 테마 제거
  const removeTheme = (themeToRemove: string) => {
    setWork((prev) => ({
      ...prev,
      themes: prev.themes.filter((theme) => theme !== themeToRemove),
    }));
  };

  const generateNovel = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-novel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: work.title,
          genre: work.genre,
          prompt: work.prompt || "",
          themes: work.themes || [],
        }),
      });

      if (!response.ok) {
        throw new Error("소설 생성에 실패했습니다");
      }

      const data = await response.json();
      const formattedContent = data.content
        .split("\n")
        .filter((line: string) => line.trim() !== "")
        .map((paragraph: string) => `<p>${paragraph}</p>`)
        .join("\n\n");

      setLocalOriginalText(formattedContent);
      setWork({
        ...work,
        original_text: formattedContent,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("소설 생성 중 오류가 발생했습니다");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      let cover_url = null;

      // 표지 이미지 업로드
      if (coverFile) {
        const fileExt = coverFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("covers")
          .upload(fileName, coverFile);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("covers").getPublicUrl(fileName);
          cover_url = publicUrl;
        }
      }

      const { error: insertError } = await supabase.from("ai_works").insert([
        {
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
          themes: work.themes,
          cover_url: cover_url,
        },
      ]);

      if (insertError) throw insertError;

      router.push("/admin/ai-works");
    } catch (error) {
      console.error("Error:", error);
      setMessage("작품 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">새 작품 등록</h1>

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
                value={work.genre}
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

            {/* 테마 */}
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

            {/* 설명 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                설명
              </label>
              <textarea
                value={work.description}
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
                value={work.prompt}
                onChange={(e) => setWork({ ...work, prompt: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={8}
              />
            </div>

            {/* AI 소설 생성 버튼 */}
            <div className="mb-4">
              <button
                type="button"
                onClick={generateNovel}
                disabled={generating || !work.title || !work.genre}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2 disabled:bg-gray-400"
              >
                {generating ? "생성 중..." : "AI 본문 생성"}
              </button>
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
                  height: "400px",
                  marginBottom: "50px",
                }}
                className="prose max-w-none"
              />
            </div>

            {/* 변주 프롬프트 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mt-2 mb-2">
                변주 프롬프트
              </label>
              <textarea
                value={work.variation_prompt}
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
                value={work.library_id}
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
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
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
                onClick={() => router.push("/admin/ai-works")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {loading ? "처리중..." : "등록"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
