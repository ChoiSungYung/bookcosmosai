"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function UploadWork() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [themes, setThemes] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      let coverUrl = null;
      if (coverFile) {
        const { data, error } = await supabase.storage
          .from("covers")
          .upload(`${session.user.id}/${Date.now()}`, coverFile);

        if (data) {
          coverUrl = data.path;
        }
      }

      const { data: work, error } = await supabase
        .from("ai_works")
        .insert({
          title,
          description,
          content,
          genre,
          themes,
          cover_url: coverUrl,
          user_id: session.user.id,
          is_public: isPublic,
          status: "published",
        })
        .select()
        .single();

      if (work) {
        router.push(`/my-library/${work.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      {/* 폼 필드들 */}
    </form>
  );
}
