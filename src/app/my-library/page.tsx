import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LibraryHeader from "@/app/components/library/LibraryHeader";
import WorksList from "@/app/components/library/WorksList";
import LibraryStats from "@/app/components/library/LibraryStats";

interface Work {
  id: number;
  title: string;
  description: string;
  cover_url: string | null;
  view_count: number;
  like_count: number;
  profiles?: {
    full_name: string;
  };
}

export default async function MyLibrary() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }

  // 사용자의 도서관 정보 조회
  let { data: library, error: libraryError } = await supabase
    .from("user_libraries")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (!library) {
    // 도서관이 없으면 생성
    const { data: newLibrary } = await supabase
      .from("user_libraries")
      .insert({
        user_id: session.user.id,
        name: "나의 도서관",
        description: "내 작품들을 모아두는 공간입니다.",
      })
      .select()
      .single();

    library = newLibrary;
  }

  // 도서관의 작품들 조회
  const { data: works } = await supabase
    .from("ai_works")
    .select(
      `
      *,
      profiles (
        full_name
      )
    `
    )
    .eq("library_id", library.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <LibraryHeader library={library} />
      <LibraryStats library={library} />
      <WorksList works={works || []} isOwner={true} />
    </div>
  );
}
