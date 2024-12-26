"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ViewCounter({
  workId,
  initialCount,
}: {
  workId: number;
  initialCount: number;
}) {
  const [viewCount, setViewCount] = useState(initialCount);
  const supabase = createClient();

  useEffect(() => {
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
          setViewCount(payload.new.view_count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workId]);

  return <span>조회 {viewCount}</span>;
}
