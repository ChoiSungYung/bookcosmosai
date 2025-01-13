// 서버 컴포넌트
import EditWorkForm from "./EditWorkForm";
import { createClient } from "@/utils/supabase/server";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const supabase = await createClient();

  const { data: workData } = await supabase
    .from("ai_works")
    .select(
      `
      id,
      title,
      genre,
      description,
      prompt,
      original_text,
      variation_prompt,
      variation_text,
      is_public,
      status,
      library_id,
      created_at,
      updated_at,
      themes,
      cover_url
    `
    )
    .eq("id", resolvedParams.id)
    .single();

  const { data: libraryData } = await supabase
    .from("user_libraries")
    .select("id, name")
    .order("name");

  if (!workData) {
    return <div>작품을 찾을 수 없습니다.</div>;
  }

  console.log("Fetched work data:", workData); // 데이터 확인용

  return <EditWorkForm initialWork={workData} libraries={libraryData || []} />;
}
