"use client";
import Image from "next/image";

interface PageBannerProps {
  title: string;
  image: string;
  category?: string; // make optional
  priority?: boolean;
}

export default function PageBanner({ title, image, category }: PageBannerProps) {
  if (!image) return null; // avoid runtime error

  return (
    <div className="group relative w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        priority
        quality={65}
        sizes="100vw"
      />

      {/* Overlay Content */}
      <div className="relative w-11/12 md:w-4/5 mx-auto z-10 text-center text-white animate-fade-in">
        <h2 className="text-2xl md:text-4xl font-bold playfair">{title}</h2>
        {/* {category && <p className="mt-2 text-sm md:text-base">{category}</p>} */}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-80"></div>
    </div>
  );
}
