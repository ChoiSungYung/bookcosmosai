"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import WorkImage from "./WorkImage";
import Link from "next/link";

interface Work {
  id: number;
  title: string;
  description: string;
  cover_url: string | null;
  category: string;
  view_count: number;
  like_count: number;
  user_id: string;
  profiles: {
    full_name: string;
  } | null;
}

export default function WorksList({ initialWorks }: { initialWorks: Work[] }) {
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("works_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ai-works",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setWorks((currentWorks) =>
              currentWorks.map((work) =>
                work.id === payload.new.id ? { ...work, ...payload.new } : work
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {works.map((work) => (
        <div
          key={work.id}
          className="border rounded-lg overflow-hidden shadow-md"
        >
          <div className="aspect-w-3 aspect-h-2">
            <WorkImage src={work.cover_url} alt={work.title} />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{work.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {work.description}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>조회 {work.view_count}</span>
              <span>좋아요 {work.like_count}</span>
            </div>
            <Link
              href={`/works/${work.id}`}
              className="mt-4 block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              자세히 보기
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
