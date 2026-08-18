import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogPost } from "@/lib/storefront";
import { InteractiveSiteImage } from "@/components/storefront/interactive-site-image";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group surface-card overflow-hidden transition duration-500 hover:-translate-y-1 hover:shadow-premium"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <InteractiveSiteImage
          src={post.coverImage}
          alt={post.title}
          sizes="(min-width: 1024px) 33vw, 100vw"
          containerClassName="w-full h-full"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-text-secondary">
          <span>{post.category}</span>
          <span>{post.readingTime}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-balance text-3xl text-dark">{post.title}</h3>
          <p className="text-sm leading-6 text-text-secondary">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <ArrowUpRight className="h-5 w-5 text-text-secondary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-dark" />
        </div>
      </div>
    </Link>
  );
}
