import Link from "next/link";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  summary: string;
  coverImage: string;
}

export default function BookCard({
  id,
  title,
  author,
  summary,
  coverImage,
}: BookCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={coverImage}
        alt={title}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="text-xl font-bold mt-2">{title}</h2>
      <p className="text-gray-600">{author}</p>
      <p className="mt-2 line-clamp-3">{summary}</p>
      <Link
        href={`/books/${id}`}
        className="mt-4 text-blue-600 hover:underline"
      >
        자세히 보기
      </Link>
    </div>
  );
}
