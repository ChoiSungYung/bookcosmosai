import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import LikeButton from "@/app/components/LikeButton";
import CommentSection from "@/app/components/CommentSection";
import ViewCounter from "@/app/components/ViewCounter";
import VariationText from "@/app/components/VariationText";

interface Work {
  id: number;
  title: string;
  description: string;
  content: string;
  cover_url: string | null;
  genre: string | null;
  themes: string[];
  view_count: number;
  like_count: number;
  prompt: string;
  original_text: string;
  variation_prompt: string;
  variation_text: string;
  profiles?: {
    full_name: string;
    bio: string;
  };
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: work } = await supabase
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
    .eq("id", id)
    .single();

  if (!work) {
    notFound();
  }

  const { data: existingView } = await supabase
    .from("interactions")
    .select("id")
    .eq("work_id", work.id)
    .eq("interaction_type", "view")
    .eq("created_at", "now()")
    .single();

  if (!existingView) {
    await supabase.rpc("increment_view_count", { work_id: work.id });
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{work.title}</h1>
          <div className="flex items-center justify-between text-gray-600">
            <div>
              <p>작성자: {work.profiles?.full_name || "익명"}</p>
              <p>장르: {work.genre || "미분류"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <ViewCounter workId={work.id} initialCount={work.view_count} />
              <LikeButton workId={work.id} initialLikes={work.like_count} />
            </div>
          </div>
        </header>

        <div className="prose max-w-none mb-12">
          {work.cover_url && (
            <img
              src={work.cover_url}
              alt={work.title}
              className="w-full max-h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">작품 소개</h2>
            <p>{work.description}</p>
          </div>

          <VariationText
            prompt={work.prompt}
            originalText={work.original_text}
            variationPrompt={work.variation_prompt}
            variationText={work.variation_text}
          />
        </div>

        {work.themes && work.themes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">주요 테마</h2>
            <div className="flex flex-wrap gap-2">
              {work.themes.map((theme: string) => (
                <span
                  key={theme}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        <CommentSection workId={work.id} />
      </article>
    </div>
  );
}
