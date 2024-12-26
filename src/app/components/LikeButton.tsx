"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LikeButton({
  workId,
  initialLikes,
}: {
  workId: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 좋아요 상태 확인
    const checkLikeStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("interactions")
          .select()
          .eq("work_id", workId)
          .eq("user_id", session.user.id)
          .eq("interaction_type", "like")
          .single();

        setIsLiked(!!data);
      }
      setLoading(false);
    };

    checkLikeStatus();

    // 실시간 업데이트 구독
    const channel = supabase
      .channel(`ai_work_${workId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ai_works",
          filter: `id=eq.${workId}`,
        },
        (payload) => {
          setLikes(payload.new.like_count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workId]);

  const handleLike = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      // 로그인이 필요하다는 알림 표시
      alert("좋아요를 하려면 로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        // 좋아요 취소
        await supabase
          .from("interactions")
          .delete()
          .eq("work_id", workId)
          .eq("user_id", session.user.id)
          .eq("interaction_type", "like");

        await supabase.rpc("decrement_like_count", { work_id: workId });
        setLikes((prev) => prev - 1);
      } else {
        // 좋아요 추가
        await supabase.from("interactions").insert({
          work_id: workId,
          user_id: session.user.id,
          interaction_type: "like",
        });

        await supabase.rpc("increment_like_count", { work_id: workId });
        setLikes((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
        isLiked
          ? "text-red-600 hover:text-red-700"
          : "text-gray-600 hover:text-gray-700"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likes}</span>
    </button>
  );
}
