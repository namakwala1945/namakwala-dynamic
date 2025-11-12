// app/export-terms/page.tsx

export const dynamic = "force-dynamic"; // ⛔ no caching, always fresh
export const revalidate = 0; // ensure dynamic rendering

import PageBanner from "@/components/PageBanner";
import Image from "next/image";

const API_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/export-terms-and-condition?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[CommonSection][populate]=*`;

// ----------------------
// Types
// ----------------------
interface StrapiImage {
  url: string;
}

interface StrapiDescription {
  type: string;
  children: { type: string; text: string }[];
}

interface Section {
  id: number;
  title: string;
  description: StrapiDescription[];
  image?: StrapiImage;
}

interface ExportTermsData {
  title: string;
  description: StrapiDescription[];
  Metadata: any;
  pagebanner: {
    title: string;
    heading: string;
    image: StrapiImage;
  };
  CommonSection: Section[];
}

// ----------------------
// Fetch Function
// ----------------------
async function getExportTermsData(): Promise<ExportTermsData> {
  const res = await fetch(API_URL, {
    cache: "no-store", // always fetch live data
  });

  if (!res.ok) {
    console.error("❌ Failed to fetch export terms:", res.statusText);
    throw new Error("Failed to fetch export terms data");
  }

  const json = await res.json();
  return json.data;
}

// ----------------------
// Page Component
// ----------------------
export default async function ExportTermsPage() {
  const data = await getExportTermsData();
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const banner = data.pagebanner;
  const sections = data.CommonSection;

  return (
    <section className="relative poppins">
      {/* ✅ Banner */}
      <PageBanner
        title={banner?.title}
        image={`${baseUrl}${banner?.image?.url}`}
        category={banner?.heading}
      />

      {/* ✅ Main Content */}
      <div className="container mx-auto px-6 py-20 space-y-32">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl playfair font-extrabold text-gradient mb-4">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-800">
            {data.description?.[0]?.children?.[0]?.text}
          </p>
        </div>

        {/* ✅ Sections */}
        {sections?.map((section, idx) => {
          const isEven = idx % 2 === 0;
          const text =
            section.description
              ?.map((p) => p.children.map((c) => c.text).join(" "))
              .join("\n\n") || "";

          return (
            <div
              key={section.id}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 poppins ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text Card */}
              <div className="md:w-1/2 bg-white/70 backdrop-blur-md p-8 shadow-2xl z-10 relative border border-white/30">
                <h2 className="text-4xl playfair font-extrabold text-gradient mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{text}</p>
              </div>

              {/* Image */}
              {section.image?.url && (
                <div
                  className={`md:w-1/2 mt-8 md:mt-0 relative md:-top-10 overflow-hidden shadow-2xl flex-shrink-0 ${
                    isEven ? "md:-ml-20" : "md:-mr-20"
                  }`}
                  style={{ minHeight: "300px" }}
                >
                  <Image
                    src={`${baseUrl}${section.image.url}`}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
