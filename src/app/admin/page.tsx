import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface Stats {
  totalWorks: number;
  totalUsers: number;
  totalComments: number;
  totalInteractions: number;
}

export default async function AdminPage() {
  const supabase = await createClient();

  // 기본 통계 데이터 조회
  const { count: worksCount } = await supabase
    .from("ai_works")
    .select("*", { count: "exact", head: true });

  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true });

  const { count: profilesCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: interactionsCount } = await supabase
    .from("interactions")
    .select("*", { count: "exact", head: true });

  // 최근 작품 목록
  const { data: recentWorks } = await supabase
    .from("ai_works")
    .select(
      `
      id,
      title,
      genre,
      created_at,
      view_count,
      like_count,
      profiles (
        full_name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">전체 작품 수</h3>
          <p className="text-2xl font-bold">{worksCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">전체 사용자 수</h3>
          <p className="text-2xl font-bold">{profilesCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">전체 댓글 수</h3>
          <p className="text-2xl font-bold">{commentsCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">전체 상호작용 수</h3>
          <p className="text-2xl font-bold">{interactionsCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
