"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface LibraryHeaderProps {
  library: {
    id: string;
    name: string;
    description: string;
    banner_url: string | null;
    followers_count: number;
    user_id: string;
  };
}

export default function LibraryHeader({ library }: LibraryHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const supabase = createClient();

  const handleFollow = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    if (!isFollowing) {
      await supabase.from("library_followers").insert({
        library_id: library.id,
        follower_id: session.user.id,
      });
      setIsFollowing(true);
    } else {
      await supabase
        .from("library_followers")
        .delete()
        .match({ library_id: library.id, follower_id: session.user.id });
      setIsFollowing(false);
    }
  };

  return (
    <div className="relative mb-8">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden">
        {library.banner_url && (
          <img
            src={library.banner_url}
            alt={library.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <div className="h-24 w-24 rounded-full ring-4 ring-white bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {library.name[0]}
              </span>
            </div>
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {library.name}
              </h1>
              <p className="text-gray-500">{library.description}</p>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link
                href="/my-library/upload"
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                작품 업로드
              </Link>
              <Link
                href="/my-library/settings"
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                설정
              </Link>
              <button
                onClick={handleFollow}
                className={`inline-flex justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                  isFollowing
                    ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    : "border-transparent text-white bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
