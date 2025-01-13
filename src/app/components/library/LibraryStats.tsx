"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface LibraryStatsProps {
  library: {
    id: string;
    total_works: number;
    total_views: number;
    total_likes: number;
    followers_count: number;
  };
}

interface LibraryPayload {
  total_works: number;
  total_views: number;
  total_likes: number;
  followers_count: number;
}

export default function LibraryStats({ library }: LibraryStatsProps) {
  const [stats, setStats] = useState({
    total_works: library.total_works,
    total_views: library.total_views,
    total_likes: library.total_likes,
    followers_count: library.followers_count,
  });

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`library_${library.id}`)
      .on(
        "postgres_changes" as const,
        {
          event: "UPDATE",
          schema: "public",
          table: "user_libraries",
          filter: `id=eq.${library.id}`,
        },
        (payload: { new: LibraryPayload }) => {
          setStats({
            total_works: payload.new.total_works,
            total_views: payload.new.total_views,
            total_likes: payload.new.total_likes,
            followers_count: payload.new.followers_count,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [library.id]);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            총 작품
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats.total_works}
          </dd>
        </div>
        <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            총 조회수
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats.total_views}
          </dd>
        </div>
        <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            총 좋아요
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats.total_likes}
          </dd>
        </div>
        <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">팔로워</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats.followers_count}
          </dd>
        </div>
      </dl>
    </div>
  );
}
