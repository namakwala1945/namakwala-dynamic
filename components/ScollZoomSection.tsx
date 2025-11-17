"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

export default function ScrollImageSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

  /** ---------------------------------------------
   * ✅ Fetch image from Strapi with optimization
   * ----------------------------------------------*/
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/scoll-zoom-sections?populate=*`,
          {
            cache: "force-cache", // ⚡ Faster response
            next: { revalidate: 60 }, // refresh every 60 sec
          }
        );

        const json = await res.json();
        const item = json?.data?.[0];

        // Try all possible Strapi formats
        const image =
          item?.image?.[0] ||
          item?.attributes?.image?.data?.[0] ||
          item?.attributes?.image?.data ||
          null;

        const rawUrl =
          image?.url ||
          image?.attributes?.url ||
          image?.formats?.large?.url ||
          image?.formats?.medium?.url ||
          image?.formats?.small?.url ||
          image?.formats?.thumbnail?.url ||
          null;

        const optimizedUrl = getStrapiMedia(rawUrl);

        setImageUrl(optimizedUrl);
      } catch (err) {
        console.error("❌ Error fetching scroll image:", err);
        setImageUrl("/optimized/placeholder-large.webp");
      }
    };

    fetchImage();
  }, []);

  /** ---------------------------------------------
   * ✅ Smooth GSAP Scroll Zoom Animation
   * ----------------------------------------------*/
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

      // Smooth zoom effect
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            ease: "power3.inOut",
          },
        })
        .fromTo(
          imageWrapperRef.current,
          { width: "70%", height: "70%", scale: 1 },
          { width: "100%", height: "100%", scale: 1.1 }
        );
    }

    init();

    return () => {
      if (ScrollTrigger) ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, [imageUrl]);

  /** ---------------------------------------------
   * ⏳ Loading State
   * ----------------------------------------------*/
  if (!imageUrl) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading Scroll Section...
      </div>
    );
  }

  /** ---------------------------------------------
   * ✅ OUTPUT
   * ----------------------------------------------*/
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
          quality={75}
          placeholder="blur"
          blurDataURL="/optimized/placeholder-large.webp"
          onLoadingComplete={() => setIsLoaded(true)}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
}
