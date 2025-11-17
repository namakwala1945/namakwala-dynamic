"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader/Loader";

// Client-only components
const CustomCursor = dynamic(() => import("@/components/Cursor"));

// Lazy-load Google Translate script
export default function ClientComponents() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Simulate API/data load completion
    const timer = setTimeout(() => {
      setLoading(false); // hide loader after data is ready
    }, 2000); // You can adjust time or check API completion

    return () => {
      clearTimeout(timer);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Loader show={loading} />
      {!loading && <CustomCursor />}
    </>
  );
}
