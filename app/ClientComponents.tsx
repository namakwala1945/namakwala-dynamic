"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader/Loader";
import ContentProtector from "./ContentProtector"; // <-- Added

// Load CustomCursor only on client
const CustomCursor = dynamic(() => import("@/components/Cursor"), { ssr: false });

export default function ClientComponents() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Google Translate callback
    // @ts-ignore
    window.googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    // Load the Google Translate script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Hide loader only when full page loads
    const onPageLoaded = () => setLoading(false);
    window.addEventListener("load", onPageLoaded);

    return () => {
      window.removeEventListener("load", onPageLoaded);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Loader show={loading} />

      {/* 🔒 Content Protection Active on Entire Website */}
      <ContentProtector />

      {/* ✨ Custom cursor appears only after loading */}
      {!loading && <CustomCursor />}
    </>
  );
}
