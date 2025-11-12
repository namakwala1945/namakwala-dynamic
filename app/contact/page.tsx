import ContactClient from "./ContactClient";
import { Metadata } from "next";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

// ✅ Fetch Strapi data (server-side)
async function fetchContactData() {
  const res = await fetch(
    `${STRAPI_URL}/api/contact?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[Address][populate]=*`,
    { cache: "no-store" } // always fresh
  );
  if (!res.ok) throw new Error("Failed to fetch contact data");
  const json = await res.json();
  return json.data;
}

// ✅ Metadata for SEO (server-side)
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchContactData();
  if (!data) return {};

  const meta = data.Metadata || {};

  return {
    title: meta.metaTitle || "Contact Us | Namakwala",
    description:
      meta.metaDescription || "Get in touch with Namakwala for inquiries or support.",
    keywords: meta.metaKeywords || "contact, namakwala, salt, minerals",
    alternates: { canonical: meta.canonicalURL || "https://www.namakwala.in/contact" },
    openGraph: {
      title: meta.metaTitle || data.Title,
      description: meta.metaDescription,
      url: meta.canonicalURL || "https://www.namakwala.in/contact",
      images: meta.metaImage?.url
        ? [`${STRAPI_URL}${meta.metaImage.url}`]
        : ["/default-og-image.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.metaTitle || data.Title,
      description: meta.metaDescription,
      images: meta.metaImage?.url
        ? [`${STRAPI_URL}${meta.metaImage.url}`]
        : ["/default-og-image.jpg"],
    },
  };
}

// ✅ Render client UI
export default async function ContactPage() {
  const data = await fetchContactData();
  return <ContactClient pageData={data} />;
}
