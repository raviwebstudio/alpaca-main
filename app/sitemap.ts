import type { MetadataRoute } from "next";
import { blogPosts, legalDocuments, products } from "@/lib/storefront";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://alpacaa.in";
  const staticRoutes = [
    "",
    "/shop",
    "/blog",
    "/about",
    "/contact",
    "/cart",
    "/checkout",
    "/checkout/address",
    "/checkout/payment",
    "/checkout/success",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...legalDocuments.map((document) => ({
      url: `${baseUrl}/${document.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
