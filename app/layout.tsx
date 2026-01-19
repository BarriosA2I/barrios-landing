import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Barrios A2I | Intelligence Architecture',
  description: 'World-class RAG agents running everything with zero human interaction.',
  keywords: ['AI', 'automation', 'video production', 'RAG', 'enterprise AI'],
  authors: [{ name: 'Gary Barrios' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      allowedRedirectOrigins={[
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'https://www.barriosa2i.com',
        'https://barriosa2i.com',
      ]}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#00CED1',
          colorBackground: '#141414',
          colorInputBackground: '#1a1a1a',
          colorInputText: '#fafafa',
          colorText: '#fafafa',
          colorTextSecondary: '#a1a1aa',
          borderRadius: '0.5rem',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
          <SiteHeader />
          <div className="pt-16">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
