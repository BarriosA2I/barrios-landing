// 📁 app/commercial-lab/page.tsx
// Route: /commercial-lab - AI Commercial Studio
import { redirect } from 'next/navigation';

export default function CommercialLabPage() {
  redirect('/#commercial-lab');
}

export const metadata = {
  title: 'Commercial Lab | AI Ad Studio | Barrios A2I',
  description: 'Token-based AI commercial generation. Full 64-second ads from text prompts.',
};
