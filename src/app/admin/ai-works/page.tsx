"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

interface Work {
  id: number;
  title: string;
  genre: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

type SortField = "title" | "updated_at" | "created_at";
type SortOrder = "asc" | "desc";

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const supabase = createClient();

  const genres = [
    { value: "all", label: "전체" },
    { value: "소설", label: "소설" },
    { value: "시", label: "시" },
    { value: "에세이", label: "에세이" },
    // ... 기존 장르 목록
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchWorks();
  }, [currentPage, sortField, sortOrder, selectedGenre]);

  const fetchWorks = async () => {
    try {
      let query = supabase.from("ai_works").select("*", { count: "exact" });

      // 장르 필터링
      if (selectedGenre !== "all") {
        query = query.eq("genre", selectedGenre);
      }

      // 정렬
      query = query.order(sortField, { ascending: sortOrder === "asc" });

      // 페이지네이션
      const { data, error, count } = await query.range(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE - 1
      );

      if (error) throw error;
      setWorks(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching works:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("ai_works").delete().eq("id", id);

      if (error) throw error;

      // 현재 페이지의 마지막 항을 삭제했고, 다른 페이지가 있다면 이전 페이지로 이동
      if (works.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchWorks(); // 현재 페이지 새로고침
      }
    } catch (error) {
      console.error("Error deleting work:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">작품 관리</h1>
        <Link
          href="/admin/ai-works/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          새 작품 등록
        </Link>
      </div>

      {/* 필터 및 정렬 컨트롤 */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.label}
            </option>
          ))}
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="px-3 py-2 border rounded"
        >
          <option value="updated_at">수정일</option>
          <option value="created_at">등록일</option>
          <option value="title">제목</option>
        </select>

        <button
          onClick={() =>
            setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
          }
          className="px-3 py-2 border rounded"
        >
          {sortOrder === "asc" ? "오름차순" : "내림차순"}
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                장르
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                공개여부
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수정일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {works.map((work) => (
              <tr key={work.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{work.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{work.genre}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {work.is_public ? "공개" : "비공개"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(work.updated_at).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Link
                    href={`/admin/ai-works/${work.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-3 py-1">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
