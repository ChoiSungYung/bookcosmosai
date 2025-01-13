import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">관리자</h2>
        </div>
        <nav className="mt-4">
          <Link href="/admin" className="block px-4 py-2 hover:bg-gray-700">
            대시보드
          </Link>
          <Link
            href="/admin/ai-works"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            작품 관리
          </Link>
          <Link
            href="/admin/users"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            사용자 관리
          </Link>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
