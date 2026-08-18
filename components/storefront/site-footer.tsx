"use client";
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.003;

      // Deep dark base
      ctx.fillStyle = '#0A0907';
      ctx.fillRect(0, 0, w, h);

      // Animated horizon glow — warm terracotta light
      const horizonY = h * 0.58;
      const glowGrad = ctx.createRadialGradient(
        w * (0.5 + Math.sin(t * 0.4) * 0.08), horizonY,
        0,
        w * (0.5 + Math.sin(t * 0.4) * 0.08), horizonY,
        w * 0.55
      );
      glowGrad.addColorStop(0, `rgba(200, 130, 80, ${0.22 + Math.sin(t) * 0.06})`);
      glowGrad.addColorStop(0.3, `rgba(160, 90, 50, ${0.12 + Math.sin(t * 0.7) * 0.04})`);
      glowGrad.addColorStop(0.6, `rgba(80, 40, 20, 0.06)`);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Secondary cool blue ambient light from top
      const topGrad = ctx.createRadialGradient(w * 0.5, 0, 0, w * 0.5, 0, h * 0.7);
      topGrad.addColorStop(0, `rgba(30, 40, 80, ${0.15 + Math.sin(t * 0.3 + 1) * 0.05})`);
      topGrad.addColorStop(0.5, 'rgba(10, 15, 30, 0.08)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, h);

      // Ground/landscape — dark silhouette at bottom
      const groundGrad = ctx.createLinearGradient(0, horizonY + 20, 0, h);
      groundGrad.addColorStop(0, 'rgba(8, 6, 4, 0.9)');
      groundGrad.addColorStop(1, 'rgba(4, 3, 2, 1)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY + 20, w, h - horizonY);

      // Subtle horizon line
      const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
      lineGrad.addColorStop(0, 'rgba(200,149,108,0)');
      lineGrad.addColorStop(0.3, `rgba(200,149,108,${0.3 + Math.sin(t * 0.5) * 0.1})`);
      lineGrad.addColorStop(0.5, `rgba(220,170,130,${0.5 + Math.sin(t) * 0.1})`);
      lineGrad.addColorStop(0.7, `rgba(200,149,108,${0.3 + Math.sin(t * 0.5) * 0.1})`);
      lineGrad.addColorStop(1, 'rgba(200,149,108,0)');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.stroke();

      // Floating light particles
      for (let i = 0; i < 6; i++) {
        const px = w * (0.15 + i * 0.13 + Math.sin(t * 0.4 + i) * 0.04);
        const py = horizonY - 20 + Math.sin(t * 0.6 + i * 1.2) * 15;
        const pr = 1 + Math.sin(t + i) * 0.5;
        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, pr * 8);
        pGrad.addColorStop(0, `rgba(220, 180, 140, ${0.6 + Math.sin(t + i) * 0.2})`);
        pGrad.addColorStop(1, 'rgba(220,180,140,0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, pr * 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Silhouette figure at horizon center (simple shape)
      const figX = w * (0.5 + Math.sin(t * 0.08) * 0.01);
      const figY = horizonY - 2;
      const figH = 44;
      const figW = 10;
      ctx.fillStyle = 'rgba(4, 3, 2, 0.95)';
      // Body
      ctx.beginPath();
      ctx.ellipse(figX, figY - figH * 0.3, figW * 0.4, figH * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Dress/skirt flowing
      ctx.beginPath();
      ctx.moveTo(figX - figW * 0.4, figY - figH * 0.1);
      ctx.quadraticCurveTo(figX - figW * 0.8, figY + figH * 0.3, figX - figW * 1.2, figY + figH * 0.6);
      ctx.lineTo(figX + figW * 1.2, figY + figH * 0.6);
      ctx.quadraticCurveTo(figX + figW * 0.8, figY + figH * 0.3, figX + figW * 0.4, figY - figH * 0.1);
      ctx.closePath();
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(figX, figY - figH * 0.72, figW * 0.3, 0, Math.PI * 2);
      ctx.fill();

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'block',
      }}
    />
  );
}

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const quickLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

const socialLinks = [
  { label: "IG", href: "https://www.instagram.com/alpacaa.clothing" },
  { label: "FB", href: "https://www.facebook.com/alpacaa.clothing/" },
  { label: "TW", href: "#" },
  { label: "PIN", href: "#" },
];

export function SiteFooter() {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', color: 'white' }}>

      {/* — CINEMATIC TOP SECTION — */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <AnimatedBackground />

        {/* Content over canvas */}
        <div style={{
          position: 'relative', zIndex: 10,
          height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
        }}>
          <p style={{
            fontSize: '11px', textTransform: 'uppercase',
            letterSpacing: '0.25em', color: '#C8956C',
            fontWeight: 500, marginBottom: '16px',
          }}>
            MADE FOR THE MOVE
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 4vw, 52px)',
            color: 'white', lineHeight: 1.2,
            marginBottom: '20px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            Wear what moves you.
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '400px', lineHeight: 1.7,
            marginBottom: '32px',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}>
            Premium essentials built for the pace of real life.
            Independent labels, curated for the modern wardrobe.
          </p>
          <Link href="/shop">
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(200,149,108,0.6)',
              color: '#C8956C',
              padding: '12px 32px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#C8956C';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#C8956C';
              }}
            >
              Explore Collection →
            </button>
          </Link>
        </div>

        {/* Fade bottom of canvas into footer links */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, #0F0E0D)',
          zIndex: 5,
        }} />
      </div>

      {/* — LINKS SECTION — */}
      <div style={{ background: '#0F0E0D', position: 'relative' }}>
        {/* Top accent line */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,149,108,0.4), transparent)',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '48px',
          }}>

            {/* Brand */}
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Image
                  src="/assets/logo-black.png"
                  alt="ALPACA"
                  width={2316}
                  height={590}
                  style={{ filter: 'invert(1) brightness(2.8)', objectFit: 'contain' }}
                  className="h-9 w-auto"
                />
              </div>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7, maxWidth: '280px',
                marginBottom: '24px',
              }}>
                Minimal layers, refined silhouettes, and a quieter way to build a wardrobe.
              </p>
              {/* Social */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {socialLinks.map(s => (
                  <a key={s.label} href={s.href} style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    border: '1px solid rgba(200,149,108,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none', letterSpacing: '0.03em',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#C8956C';
                      e.currentTarget.style.color = '#C8956C';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(200,149,108,0.25)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    }}
                  >{s.label}</a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <p style={{
                fontSize: '10px', textTransform: 'uppercase',
                letterSpacing: '0.2em', color: '#C8956C',
                fontWeight: 600, marginBottom: '20px',
              }}>EXPLORE</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exploreLinks.map(link => (
                  <Link key={link.label} href={link.href} style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C8956C'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                  >{link.label}</Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p style={{
                fontSize: '10px', textTransform: 'uppercase',
                letterSpacing: '0.2em', color: '#C8956C',
                fontWeight: 600, marginBottom: '20px',
              }}>QUICK LINKS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quickLinks.map(link => (
                  <Link key={link.label} href={link.href} style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C8956C'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                  >{link.label}</Link>
                ))}
                <div style={{
                  marginTop: '8px', paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <a href="mailto:contact@alpacaa.in" style={{
                    fontSize: '13px', color: '#C8956C',
                    textDecoration: 'none', display: 'block', marginBottom: '6px',
                  }}>contact@alpacaa.in</a>
                  <a href="mailto:support@alpacaa.in" style={{
                    fontSize: '13px', color: 'rgba(255,255,255,0.3)',
                    textDecoration: 'none', display: 'block',
                  }}>support@alpacaa.in</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            marginTop: '40px', paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
              © 2026 ALPACA — MADE FOR THE MOVE. All Rights Reserved.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
                Design and Development by
              </span>
              <span style={{
                fontSize: '11px', color: '#C8956C',
                border: '1px solid rgba(200,149,108,0.3)',
                padding: '2px 10px', borderRadius: '4px',
                letterSpacing: '0.08em', fontWeight: 500,
              }}>
                <a href="https://www.crowcent.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#C8956C' }}>
                  CROWCENT
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
