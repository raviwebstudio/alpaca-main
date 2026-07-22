import { Suspense } from 'react'
import { products, type Product } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: "New Arrivals T-Shirts | ALPACA",
  description:
    "Explore the latest t-shirts including oversized, minimal, and premium styles designed for everyday wear.",
};

function getNewArrivals(): Product[] {
  // Sort by id descending to get newest first, take 24
  return [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 24)
}

export default async function NewArrivalsPage() {
  const products = getNewArrivals()

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>

      <PageHeader
        label="New Arrivals"
        title="Fresh drops, straight to your wardrobe."
        description="The latest t-shirts designed for everyday wear, updated regularly with new styles and silhouettes."
        stats={[
          { label: "New Pieces", value: "7+" },
          { label: "Weekly Drops", value: "Weekly" },
          { label: "Free Returns", value: "Free" }
        ]}
      />

      {/* Accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #C8956C, #E8C4A0, #C8956C)' }} />

      {/* Products Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Sort + Count bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '36px',
          paddingBottom: '20px',
          borderBottom: '1px solid #E0D8D0',
        }}>
          <p style={{ fontSize: '14px', color: '#78716C' }}>
            Showing <strong style={{ color: '#1C1917' }}>{products.length}</strong> new pieces
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716C' }}>Sort by</span>
            <span style={{
              fontSize: '13px', color: '#1C1917', fontWeight: 500,
              border: '1px solid #E0D8D0', borderRadius: '999px',
              padding: '6px 16px', background: 'white',
            }}>
              Newest First
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1C1917', marginBottom: '12px' }}>
              New drops coming soon
            </p>
            <p style={{ fontSize: '14px', color: '#78716C', marginBottom: '28px' }}>
              Check back shortly — our sellers are preparing new collections.
            </p>
            <a href="/shop" style={{
              display: 'inline-block', background: '#1C1917', color: 'white',
              padding: '14px 32px', borderRadius: '999px', fontSize: '14px',
              fontWeight: 500, textDecoration: 'none',
            }}>
              Browse Current Collection
            </a>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section style={{
        background: '#1C1917',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(200,149,108,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <p style={{
          fontSize: '11px', textTransform: 'uppercase',
          letterSpacing: '0.2em', color: '#C8956C',
          fontWeight: 500, marginBottom: '16px',
        }}>
          STAY UPDATED
        </p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(28px, 4vw, 44px)',
          color: 'white', marginBottom: '12px',
        }}>
          Never miss a new drop.
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
          New collections land every week. Bookmark this page or follow us.
        </p>
        <a href="/shop" style={{
          display: 'inline-block', background: '#C8956C', color: 'white',
          padding: '14px 36px', borderRadius: '999px', fontSize: '14px',
          fontWeight: 500, textDecoration: 'none',
        }}>
          Shop All Products →
        </a>
      </section>
    </div>
  )
}