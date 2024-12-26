interface BookPageProps {
  params: {
    id: string;
  };
}

export default function BookPage({ params }: BookPageProps) {
  // 임시 데이터
  const book = {
    id: params.id,
    title: "아몬드",
    author: "손원평",
    summary:
      "감정을 느끼지 못하는 소년 선윤이가 세상과 마주하며 성장하는 이야기",
    coverImage: "https://placeholder.co/400x600",
    content: `
      여기에 실제 도서 요약 내용이 들어갑니다.
      여러 줄의 텍스트가 포함될 수 있습니다.
    `,
    publishedDate: "2024-01-01",
    category: "소설",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">{book.author}</p>
            <div className="flex gap-4 text-sm text-gray-500 mb-6">
              <span>{book.publishedDate}</span>
              <span>{book.category}</span>
            </div>
            <p className="text-lg mb-8">{book.summary}</p>
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">주요 내용</h2>
              <div className="whitespace-pre-line">{book.content}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
