import { ImageResponse } from 'next/og';

export const alt = 'SoloStudy — Focus without the noise';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background:
          'radial-gradient(circle at 20% 10%, #344568, transparent 42%), linear-gradient(135deg, #080b12 20%, #141321)',
        color: 'white',
        display: 'flex',
        fontFamily: 'sans-serif',
        height: '100%',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          left: 86,
          position: 'absolute',
          top: 72,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5 }}>
          SoloStudy
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 600,
            letterSpacing: -4,
            lineHeight: 0.98,
            marginTop: 150,
            maxWidth: 700,
          }}
        >
          Focus without the noise.
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.58)',
            fontSize: 24,
            marginTop: 28,
          }}
        >
          A calm online focus room.
        </div>
      </div>
      <div
        style={{
          alignItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 999,
          display: 'flex',
          fontFamily: 'monospace',
          fontSize: 44,
          height: 190,
          justifyContent: 'center',
          position: 'absolute',
          right: 90,
          top: 220,
          width: 190,
        }}
      >
        25:00
      </div>
    </div>,
    size
  );
}
