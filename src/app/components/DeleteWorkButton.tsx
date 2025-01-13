"use client";

import { createClient } from "@/utils/supabase/client";

export default function DeleteWorkButton({ workId }: { workId: number }) {
  const handleDelete = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const supabase = createClient();
      const { error } = await supabase
        .from("ai_works")
        .delete()
        .eq("id", workId);

      if (!error) {
        window.location.reload();
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-900">
      삭제
    </button>
  );
}
