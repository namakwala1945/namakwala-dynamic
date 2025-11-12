const { i18n } = require("./next-i18next.config");

module.exports = {
  experimental: {
    optimizeCss: true, // ✅ inline critical CSS
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [320, 640, 768, 1024, 1200, 1600],
    domains: ["images.unsplash.com", "img.youtube.com"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "apeda.gov.in" },
    ],
  },
  i18n: {
    locales: ["en", "fr", "de", "ar", "ur", "af"],
    defaultLocale: "en",
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Modern JS target
  future: {
    legacyBrowsers: false, // disable legacy JS builds
  },
  // ✅ Optional: tell Next.js to target only modern browsers
  browserslist: [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Edge versions",
    "last 2 Safari versions"
  ],
};
