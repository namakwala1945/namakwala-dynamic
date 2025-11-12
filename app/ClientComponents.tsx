"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// Client-only components
const CustomCursor = dynamic(() => import("@/components/Cursor"));

// Lazy-load Google Translate script
export default function ClientComponents() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <CustomCursor />;
}
