import { ImageResponse } from 'next/og';
import { siteConfig } from '@/data/siteConfig';

export const alt = siteConfig.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#090A0C',
          color: '#F5F5F2',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: '#A6A9B2', textTransform: 'uppercase' }}>
          {siteConfig.role} — {siteConfig.location}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 104, lineHeight: 1, letterSpacing: -4 }}>
          <span>I build websites</span>
          <span style={{ color: '#7CF7D4' }}>that feel alive.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 30, color: '#A6A9B2' }}>
          <span>{siteConfig.name}</span>
          <span>{siteConfig.brand}</span>
        </div>
      </div>
    ),
    size,
  );
}
