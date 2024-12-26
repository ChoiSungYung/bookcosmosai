import BookCard from "../components/BookCard";

const popularBooks = [
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

export default function PopularPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">인기 요약</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularBooks.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
}
