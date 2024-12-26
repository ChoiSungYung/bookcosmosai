const categories = [
  {
    id: "novel",
    name: "소설",
    description: "문학적 상상력이 담긴 이야기",
    count: 42,
  },
  {
    id: "business",
    name: "경영/경제",
    description: "비즈니스와 경제에 대한 통찰",
    count: 38,
  },
  {
    id: "self-development",
    name: "자기계발",
    description: "더 나은 삶을 위한 지혜",
    count: 55,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">카테고리</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">{category.name}</h2>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {category.count}개의 도서
              </span>
              <a
                href={`/categories/${category.id}`}
                className="text-blue-600 hover:underline"
              >
                더보기 →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
