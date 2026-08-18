import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/ProductDetails";
import { getProducts } from "@/lib/productStorage";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product unavailable",
      description:
        "That ALPACA product is not available right now. Browse the shop to continue with an active product.",
    };
  }

  const primaryImage = typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any)?.url;

  return {
    title: product.title,
    description: product.summary ?? product.description,
    openGraph: {
      title: `${product.title} | ALPACA`,
      description: product.summary ?? product.description,
      images: primaryImage ? [primaryImage] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} allProducts={products} />;
}
