"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LibrarySettings() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [theme, setTheme] = useState("default");

  const supabase = createClient();

  useEffect(() => {
    loadLibrarySettings();
  }, []);

  const loadLibrarySettings = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { data: library } = await supabase
      .from("user_libraries")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (library) {
      setName(library.name);
      setDescription(library.description || "");
      setIsPublic(library.is_public);
      setTheme(library.theme);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 도서관 설정 저장 로직
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">도서관 설정</h1>
      <form onSubmit={handleSubmit}>{/* 설정 폼 필드들 */}</form>
    </div>
  );
}
