"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

interface MediaFile {
  url: string;
  alternativeText?: string;
}

interface MediaItem {
  title: string;
  url?: string; // YouTube or video URL
  media?: MediaFile[]; // Uploaded images/videos
}

interface MediaType {
  id: number;
  title: string;
  Media: MediaItem[];
}

interface NewsMediaTabsProps {
  mediaTypes: MediaType[];
}

export default function NewsMediaTabs({ mediaTypes = [] }: NewsMediaTabsProps) {
  const [activeTab, setActiveTab] = useState(mediaTypes[0]?.id ?? 0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeMedia = useMemo(() => {
    const type = mediaTypes.find((t) => t.id === activeTab);
    if (!type) return [];

    return (
      type.Media?.flatMap((m) => {
        const items: any[] = [];

        // 🎥 1. If URL is provided → treat as video
        if (m.url) {
          items.push({
            type: "video",
            url: m.url,
            title: m.title || "Untitled Video",
          });
        }

        // 🖼️ 2. If media uploads exist → treat as image
        if (m.media?.length) {
          m.media.forEach((file) => {
            const isVideo = file.url.match(/\.(mp4|mov|webm)$/i);
            items.push({
              type: isVideo ? "video" : "image",
              url: file.url,
              title: file.alternativeText || m.title || "Untitled",
            });
          });
        }

        return items;
      }) || []
    );
  }, [mediaTypes, activeTab]);

  const openLightbox = (idx: number) => {
    setCurrentIndex(idx);
    setIsOpen(true);
  };

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % activeMedia.length);
  const prevMedia = () =>
    setCurrentIndex((prev) => (prev - 1 + activeMedia.length) % activeMedia.length);

  const getYouTubeID = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="w-full">
      {/* ✅ Tabs */}
      <div className="flex space-x-4 mb-8 justify-center flex-wrap">
        {mediaTypes.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsOpen(false);
              setCurrentIndex(0);
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#ab8c30] text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* ✅ Media Grid */}
      {activeMedia.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No media available right now.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeMedia.map((item, idx) => {
            const isVideo = item.type === "video";
            const youtubeId = isVideo ? getYouTubeID(item.url) : null;
            const thumb = isVideo
              ? youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : item.url.match(/\.(mp4|mov|webm)$/i)
                ? "/fallback-video-thumb.jpg"
                : "/fallback-image.jpg"
              : item.url || "/fallback-image.jpg";

            return (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="relative w-full aspect-video cursor-pointer overflow-hidden rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300"
              >
                <Image
                  src={thumb}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                  unoptimized
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 w-full bg-black/50 text-white text-sm p-2 text-center">
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Lightbox */}
      {isOpen && activeMedia[currentIndex] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          {/* Close */}
          <button
            className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>

          {/* Prev / Next */}
          <button
            className="absolute left-4 text-white text-3xl font-bold hover:text-gray-400"
            onClick={prevMedia}
          >
            &#8592;
          </button>
          <button
            className="absolute right-4 text-white text-3xl font-bold hover:text-gray-400"
            onClick={nextMedia}
          >
            &#8594;
          </button>

          {/* ✅ Lightbox content */}
          <div className="max-w-5xl w-full max-h-[80vh] flex items-center justify-center">
            {activeMedia[currentIndex].type === "image" ? (
              <Image
                src={activeMedia[currentIndex].url}
                alt={activeMedia[currentIndex].title}
                width={1200}
                height={800}
                className="object-contain"
                priority
                unoptimized
              />
            ) : getYouTubeID(activeMedia[currentIndex].url) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeID(
                  activeMedia[currentIndex].url
                )}`}
                title={activeMedia[currentIndex].title}
                className="w-full h-[70vh] rounded-lg"
                allowFullScreen
              />
            ) : (
              <video
                src={activeMedia[currentIndex].url}
                controls
                className="w-full h-[70vh] rounded-lg object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
