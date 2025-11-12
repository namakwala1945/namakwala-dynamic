"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function ScrollImageSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

  // ✅ Fetch image from Strapi
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/scoll-zoom-sections?populate=*`,
          { cache: "no-store" }
        );
        const json = await res.json();
        const item = json?.data?.[0];
        const image =
          item?.image?.[0] || item?.attributes?.image?.data?.[0] || null;

        if (image?.url || image?.attributes?.url) {
          const url = image.url || image.attributes.url;
          const fullUrl = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
          setImageUrl(fullUrl);
        }
      } catch (err) {
        console.error("❌ Error fetching image:", err);
      }
    };

    fetchImage();
  }, []);

  // ✅ Super smooth GSAP zoom effect
  useEffect(() => {
    if (!imageUrl) return;

    let gsap: any;
    let ScrollTrigger: any;

    async function init() {
      const gsapModule = await import("gsap");
      const mod = await import("gsap/dist/ScrollTrigger");
      gsap = gsapModule.gsap;
      ScrollTrigger = mod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !imageWrapperRef.current) return;

      ScrollTrigger.getAll().forEach((t: any) => t.kill());

      // ✅ Smooth scrolling + zoom effect
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            scrub: 0.5, // smaller = smoother
            pin: true,
            anticipatePin: 1,
            ease: "power3.inOut",
          },
        })
        .fromTo(
          imageWrapperRef.current,
          { width: "70%", height: "70%", scale: 1 },
          {
            width: "100%",
            height: "100%",
            scale: 1.1,
            ease: "power3.inOut",
          }
        );
    }

    init();

    return () => {
      if (ScrollTrigger) ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, [imageUrl]);

  if (!imageUrl) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading Scroll Section...
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden "
    >
      <div
        ref={imageWrapperRef}
        className="relative flex items-center justify-center will-change-transform transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] w-[70%] h-[70%]"
      >
        <Image
          src={imageUrl}
          alt="Scroll Zoom Image"
          fill
          priority
          unoptimized
          onLoadingComplete={() => setIsLoaded(true)}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
}
