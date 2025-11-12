import content from "@/locales/en/content.json";
import PageBanner from "@/components/PageBanner";
import AboutSection from "../components/AboutSection";
import { notFound } from "next/navigation";
import Image from "next/image";

interface AboutPageProps {
  params: { slug: string };
}

// ----------------------
// Static Params
// ----------------------
export async function generateStaticParams() {
  const aboutSections = content.about || {};
  return Object.keys(aboutSections).map((slug) => ({ slug }));
}

// ----------------------
// Server-side metadata for SEO
// ----------------------
export async function generateMetadata({ params }: AboutPageProps) {
  const page = content.about[params.slug as keyof typeof content.about];
  if (!page) return {};

  const imageUrl = page.banner?.image?.startsWith("http")
    ? page.banner.image
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${page.banner?.image}`;

  return {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_STRAPI_URL}`),
    title: page.title,
    description: page.content.substring(0, 160),
    openGraph: {
      title: page.title,
      description: page.content.substring(0, 160),
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.content.substring(0, 160),
      images: [imageUrl],
    },
  };
}

// ----------------------
// About Page Component
// ----------------------
export default function AboutPage({ params }: AboutPageProps) {
  const aboutSections = content.about;
  const page = aboutSections[params.slug as keyof typeof aboutSections];
  if (!page) return notFound();

  return (
    <section className="relative bg-[#fdf2df]">
      {/* Top Banner */}
      <PageBanner
        title={page.title}
        image={page.banner?.image || "/optimized/banners/about-main-large.webp"}
        category={page.banner?.heading || "Learn about our journey, milestones, and leadership"}
      />

      <div className="container mx-auto px-6 py-12 space-y-20">
        <AboutSection section={page} />
      </div>
    </section>
  );
}
