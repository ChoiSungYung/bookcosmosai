"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  full_name: string | null;
  bio: string | null;
  updated_at: string;
}

const ITEMS_PER_PAGE = 10;

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<"created_at" | "full_name">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const supabase = createClient();
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortField, sortOrder]);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users count...");
      const { count, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Count error:", countError);
        throw countError;
      }

      console.log("Total count:", count);
      setTotalCount(count || 0);

      console.log("Fetching users data...");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, bio, updated_at")
        .order(sortField, { ascending: sortOrder === "asc" })
        .range(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE - 1
        );

      if (error) {
        console.error("Data error:", error);
        throw error;
      }

      console.log("Fetched users:", data);
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
      </div>

      {/* 정렬 컨트롤 */}
      <div className="mb-6 flex gap-4">
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as typeof sortField)}
          className="px-3 py-2 border rounded"
        >
          <option value="created_at">가입일</option>
          <option value="full_name">이름</option>
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

      {/* 사용자 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소개
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수정일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.full_name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.bio || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.updated_at).toLocaleString("ko-KR")}
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
};

export default AdminUsersPage;
