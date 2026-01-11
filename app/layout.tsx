import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Barrios A2I | Intelligence Architecture',
  description: 'Your Business. With a Nervous System. Barrios A2I installs autonomous intelligence that senses, decides, and acts across your entire operation.',
  keywords: ['AI', 'automation', 'enterprise intelligence', 'autonomous agents', 'Barrios A2I'],
  openGraph: {
    title: 'Barrios A2I | Intelligence Architecture',
    description: 'Your Business. With a Nervous System.',
    url: 'https://barriosa2i.com',
    siteName: 'Barrios A2I',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
