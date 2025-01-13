"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Library {
  id: string;
  name: string;
}

export default function NewWorkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [work, setWork] = useState({
    title: "",
    genre: "",
    description: "",
    prompt: "",
    original_text: "",
    is_public: false,
    status: "draft",
    library_id: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    // library_id가 빈 문자열이면 null로 설정
    const workData = {
      ...work,
      library_id: work.library_id || null,
    };

    const { data, error } = await supabase
      .from("ai_works")
      .insert([workData])
      .select()
      .single();

    if (data) {
      router.push("/admin/ai-works");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">새 작품 등록</h1>

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
          <input
            type="text"
            value={work.genre}
            onChange={(e) => setWork({ ...work, genre: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            설명
          </label>
          <textarea
            value={work.description}
            onChange={(e) => setWork({ ...work, description: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            프롬프트
          </label>
          <textarea
            value={work.prompt}
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
            value={work.original_text}
            onChange={(e) =>
              setWork({ ...work, original_text: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={10}
          />
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
            라이브러리
          </label>
          <select
            value={work.library_id}
            onChange={(e) => setWork({ ...work, library_id: e.target.value })}
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
  );
}
