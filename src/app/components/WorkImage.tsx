"use client";

import Image from "next/image";

interface WorkImageProps {
  src: string | null;
  alt: string;
}

export default function WorkImage({ src, alt }: WorkImageProps) {
  return (
    <Image
      src={src || "https://placeholder.co/400x600"}
      alt={alt}
      fill
      className="object-cover bg-gray-100"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://placeholder.co/400x600";
      }}
    />
  );
}
