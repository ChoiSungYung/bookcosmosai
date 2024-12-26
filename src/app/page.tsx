import Link from "next/link";
import BookCard from "./components/BookCard";

// 임시 데이터
const featuredBooks = [
  {
    id: "1",
    title: "아몬드",
    author: "손원평",
    summary:
      "감정을 느끼지 못하는 소년 선윤이가 세상과 마주하며 성장하는 이야기",
    coverImage: "https://placeholder.co/400x600",
  },
  {
    id: "2",
    title: "사피엔스",
    author: "유발 하라리",
    summary:
      "인류의 역사를 관통하는 세 가지 혁명을 통해 현재를 이해하고 미래를 전망한다",
    coverImage: "https://placeholder.co/400x600",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 히어로 섹션 */}
      <section className="text-center py-20 bg-gray-50 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4">
          좋은 책의 핵심을 쉽게 만나보세요
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          바쁜 현대인을 위한 도서 요약 서비스
        </p>
        <Link
          href="/books"
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700"
        >
          도서 둘러보기
        </Link>
      </section>

      {/* 추천 도서 섹션 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">이번 주 추천 도서</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </section>
    </div>
  );
}
