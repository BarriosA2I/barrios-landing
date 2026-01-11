// 📁 app/nexus/page.tsx
// Route: /nexus - NEXUS Personal product page
import { redirect } from 'next/navigation';

export default function NexusPage() {
  // Redirect to homepage NEXUS section until dedicated page is built
  redirect('/#nexus');
}

export const metadata = {
  title: 'NEXUS Personal | Barrios A2I',
  description: 'A private digital assistant for your home life. Your files never leave your computer.',
};
