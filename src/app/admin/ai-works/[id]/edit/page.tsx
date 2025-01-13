// 서버 컴포넌트
import EditWorkForm from "./EditWorkForm";
import { createClient } from "@/utils/supabase/server";

export default async function EditWorkPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; // 비동기가 아닌 동기 객체에서 id 추출
  const supabase = await createClient();

  // 작품 데이터 가져오기
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
    .eq("id", id)
    .single();

  // 라이브러리 목록 가져오기
  const { data: libraryData } = await supabase
    .from("user_libraries")
    .select("id, name")
    .order("name");

  // 작품 데이터가 없으면 에러 메시지
  if (!workData) {
    return <div>작품을 찾을 수 없습니다.</div>;
  }

  console.log("Fetched work data:", workData); // 데이터 확인용

  // 수정 폼 렌더링
  return <EditWorkForm initialWork={workData} libraries={libraryData || []} />;
}
