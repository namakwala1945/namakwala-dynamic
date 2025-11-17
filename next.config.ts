const { i18n } = require("./next-i18next.config");

module.exports = {
  experimental: {
    optimizeCss: true, // inline critical CSS
  },

  images: {
    unoptimized: false, // ❗ enable Next.js image optimization
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [320, 640, 768, 1024, 1200, 1600],

    // existing image domains
    domains: ["images.unsplash.com", "img.youtube.com"],

    // existing pattern + Strapi added here
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "apeda.gov.in" },

      // ✅ ADD STRAPI DOMAIN FOR OPTIMIZED IMAGES
      {
        protocol: "https",
        hostname: "admin.namakwala.in",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },

  i18n: {
    locales: ["en", "fr", "de", "ar", "ur", "af"],
    defaultLocale: "en",
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  future: {
    legacyBrowsers: false,
  },

  browserslist: [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Edge versions",
    "last 2 Safari versions",
  ],
};
