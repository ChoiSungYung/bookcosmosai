import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import WorkImage from "../components/WorkImage";

interface Work {
  id: number;
  title: string;
  genre: string | null;
  themes: string[] | null;
  description: string | null;
  content: string | null;
  model_version: string | null;
  cover_url: string | null;
  prompt: string | null;
  original_text: string | null;
  variation_prompt: string | null;
  variation_text: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  is_public: boolean;
  status: string;
  view_count: number;
  like_count: number;
  dislike_count: number;
  category: string | null;
  library_id: string | null;
  profiles: {
    full_name: string | null;
    bio: string | null;
  } | null;
}

// 카테고리 정의
const CATEGORIES = [
  { id: "all", name: "전체" },
  { id: "novel", name: "소설" },
  { id: "poetry", name: "시" },
  { id: "essay", name: "에세이" },
  { id: "fantasy", name: "판타지" },
  { id: "sf", name: "SF" },
  { id: "mystery", name: "미스터리" },
] as const;

export default async function AILibrary({
  searchParams,
}: {
  searchParams: { genre?: string };
}) {
  const supabase = await createClient();
  const selectedGenre = searchParams.genre || "all";

  // 먼저 사용 가능한 모든 장르를 가져옵니다
  const { data: genres } = await supabase
    .from("ai_works")
    .select("genre")
    .not("genre", "is", null)
    .eq("is_public", true);

  // 중복 제거하고 정렬된 장르 목록 생성
  const uniqueGenres = ["all", ...new Set(genres?.map((w) => w.genre))].sort();

  // 작품 쿼리
  let query = supabase
    .from("ai_works")
    .select(
      `
      *,
      profiles (
        full_name,
        bio
      )
    `
    )
    .eq("is_public", true);

  if (selectedGenre !== "all") {
    query = query.eq("genre", selectedGenre);
  }

  const { data: works, error } = await query.order("created_at", {
    ascending: false,
  });

  // 장르별 작품 수를 계산하는 함수 추가
  const getGenreCount = (works: Work[] | null, genre: string) => {
    if (!works) return 0;
    if (genre === "all") return works.length;
    return works.filter((work) => work.genre === genre).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-12 bg-gray-50 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4">AI 문학관</h1>
        <p className="text-xl text-gray-600 mb-8">
          AI가 만들어낸 새로운 문학의 세계를 만나보세요
        </p>

        {/* 장르 필터 */}
        <div className="flex flex-wrap justify-center gap-2">
          {uniqueGenres.map((genre) => (
            <Link
              key={genre}
              href={`/ai-library${genre === "all" ? "" : `?genre=${genre}`}`}
              className={`px-4 py-2 rounded-full text-sm transition-colors
                ${
                  selectedGenre === genre
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {genre === "all" ? "전체" : genre}
              <span className="ml-1 text-xs">
                ({getGenreCount(works, genre)})
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
        {works?.map((work: Work) => (
          <div
            key={work.id}
            className="flex flex-col border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white h-full"
          >
            <div className="relative pt-[150%]">
              <WorkImage src={work.cover_url} alt={work.title} />
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-base font-bold mb-2 line-clamp-1">
                {work.title}
              </h3>
              <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-1">
                {work.description}
              </p>
              <div className="mt-auto">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <div className="flex items-center space-x-2">
                    <span>조회 {work.view_count}</span>
                    <span>좋아요 {work.like_count}</span>
                  </div>
                  <span className="text-gray-500">
                    {work.profiles?.full_name || "익명"}
                  </span>
                </div>
                <Link
                  href={`/ai-works/${work.id}`}
                  className="group relative block text-center text-xs px-3 py-1.5 overflow-hidden"
                >
                  <span className="relative z-10 text-gray-800 font-medium group-hover:text-blue-700 transition-colors flex items-center justify-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    읽어보기
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!works || works.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          해당 카테고리의 작품이 없습니다.
        </div>
      )}
    </div>
  );
}
