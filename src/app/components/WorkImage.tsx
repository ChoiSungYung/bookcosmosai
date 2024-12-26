"use client";

interface WorkImageProps {
  src: string | null;
  alt: string;
}

export default function WorkImage({ src, alt }: WorkImageProps) {
  return (
    <img
      src={src || "https://placeholder.co/400x600"}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover bg-gray-100"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://placeholder.co/400x600";
      }}
    />
  );
}
