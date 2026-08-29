"use client";

import Image from "next/image";
import { useState } from "react";

export function SafeImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src || "/placeholder.svg");

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setImgSrc("/placeholder.svg")}
    />
  );
}
