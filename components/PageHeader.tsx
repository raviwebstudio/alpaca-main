export default function PageHeader({
  label,
  title,
  description,
  stats,
}: {
  label: string;
  title: string;
  description: string;
  stats?: { label: string; value: string | React.ReactNode }[];
}) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #FAF8F5 0%, #F2EDE8 50%, #EDE5DC 100%)',
      padding: '80px 24px 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circle */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(200,149,108,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', textTransform: 'uppercase',
          letterSpacing: '0.2em', color: '#C8956C',
          fontWeight: 500, marginBottom: '16px',
        }}>
          {label}
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(36px, 5vw, 60px)',
          color: '#1C1917', lineHeight: 1.15,
          maxWidth: '640px', marginBottom: '20px',
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: '16px', color: '#78716C',
          maxWidth: '480px', lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          {description}
        </p>

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {stats.map((stat, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1C1917', fontWeight: 600 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '13px', color: '#78716C', marginTop: '2px' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
