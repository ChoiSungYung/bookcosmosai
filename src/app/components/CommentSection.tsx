"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export default function CommentSection({ workId }: { workId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadComments();
  }, [workId]);

  const loadComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles (
          full_name
        )
      `
      )
      .eq("work_id", workId)
      .order("created_at", { ascending: false });

    if (data) {
      setComments(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("comments").insert({
      work_id: workId,
      user_id: session.user.id,
      content: newComment,
    });

    if (!error) {
      setNewComment("");
      loadComments();
    }

    setIsLoading(false);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">댓글</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-4 border rounded-lg mb-4"
          placeholder="댓글을 작성해주세요"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !newComment.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          댓글 작성
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment: any) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                {comment.profiles?.full_name || "익명"}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
