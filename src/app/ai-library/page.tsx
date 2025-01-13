import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import WorkImage from "../components/WorkImage";

export default async function AILibrary({
  searchParams,
}: {
  searchParams: { genre?: string; sort?: string };
}) {
  const { genre = "all", sort = "recent" } = searchParams;

  // 정렬 기준 결정
  // (조회수순: view_count DESC, 최신순: created_at DESC)
  let sortField: string;
  switch (sort) {
    case "views":
      sortField = "view_count";
      break;
    case "recent":
    default:
      sortField = "updated_at";
      break;
  }

  const supabase = await createClient();

  // 모든 작품 데이터를 가져오되, sortField 기준으로 내림차순 정렬
  const { data: works } = await supabase
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
    .eq("is_public", true)
    .order(sortField, { ascending: false }); // 내림차순 정렬

  // 고유한 장르 목록 추출
  const genres = [...new Set(works?.map((work) => work.genre).filter(Boolean))];

  // 장르별 작품 수 계산
  const genreCounts = works?.reduce((acc, work) => {
    const g = work.genre || "uncategorized";
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 전체 작품 수
  const totalCount = works?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 섹션 (타이틀, 장르 필터, 정렬 버튼 등) */}
      <section className="text-center py-12 bg-gray-50 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4">AI 문학관</h1>
        <p className="text-xl text-gray-600 mb-8">
          AI가 만들어낸 새로운 문학의 세계를 만나보세요
        </p>

        {/* 장르 필터 버튼 */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <Link
            href={{
              pathname: "/ai-library",
              query: { sort, genre: "all" },
            }}
            className={`px-4 py-2 rounded-full text-sm transition-colors
              ${
                genre === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {`전체 (${totalCount})`}
          </Link>
          {genres.map((g) => (
            <Link
              key={g}
              href={{
                pathname: "/ai-library",
                query: { sort, genre: g },
              }}
              className={`px-4 py-2 rounded-full text-sm transition-colors
                ${
                  genre === g
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {`${g} (${genreCounts[g] || 0})`}
            </Link>
          ))}
        </div>

        {/* 정렬 옵션 버튼 (최신순 / 조회수순) */}
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={{
              pathname: "/ai-library",
              query: { sort: "recent", genre },
            }}
            className={`px-4 py-2 rounded-full text-sm transition-colors
              ${
                sort === "recent"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            최신순
          </Link>
          <Link
            href={{
              pathname: "/ai-library",
              query: { sort: "views", genre },
            }}
            className={`px-4 py-2 rounded-full text-sm transition-colors
              ${
                sort === "views"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            조회수순
          </Link>
        </div>
      </section>

      {/* 작품 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
        {works
          ?.filter((work) => genre === "all" || work.genre === genre)
          .map((work) => (
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

      {/* 작품이 없을 때 */}
      {(!works || works.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          해당 카테고리의 작품이 없습니다.
        </div>
      )}
    </div>
  );
}
