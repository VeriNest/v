import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type PageSeoProps = {
  title: string;
  description: string;
  image?: string;
  canonicalPath?: string;
  noIndex?: boolean;
};

const DEFAULT_SITE_URL = import.meta.env.VITE_SITE_URL || "https://verinest.ng";
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/og-image.png`;
const TITLE_SUFFIX = " | Verinest";

function ensureMetaTag(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function ensureCanonicalLink(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function PageSeo({ title, description, image, canonicalPath, noIndex = false }: PageSeoProps) {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = canonicalPath
      ? `${DEFAULT_SITE_URL}${canonicalPath}`
      : `${DEFAULT_SITE_URL}${location.pathname}${location.search}`;
    const fullTitle = title.endsWith(TITLE_SUFFIX) ? title : `${title}${TITLE_SUFFIX}`;
    const resolvedImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;
    ensureCanonicalLink(canonicalUrl);
    ensureMetaTag("name", "description", description);
    ensureMetaTag("name", "robots", noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    ensureMetaTag("name", "googlebot", noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    ensureMetaTag("property", "og:title", fullTitle);
    ensureMetaTag("property", "og:description", description);
    ensureMetaTag("property", "og:url", canonicalUrl);
    ensureMetaTag("property", "og:image", resolvedImage);
    ensureMetaTag("name", "twitter:title", fullTitle);
    ensureMetaTag("name", "twitter:description", description);
    ensureMetaTag("name", "twitter:image", resolvedImage);
  }, [canonicalPath, description, image, location.pathname, location.search, noIndex, title]);

  return null;
}
