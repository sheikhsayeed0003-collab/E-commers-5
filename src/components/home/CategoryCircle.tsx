"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";

export function CategoryCircle({ slug, name, image }: { slug: string; name: string; image: string | null }) {
  return (
    <Link
      href={`/category/${slug}`}
      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-surface transition-colors group"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-surface border border-border group-hover:border-primary transition-colors">
        {image && <SafeImage src={image} alt={name} fill className="object-cover" sizes="80px" />}
      </div>
      <span className="text-xs md:text-sm text-center font-medium line-clamp-2">{name}</span>
    </Link>
  );
}
