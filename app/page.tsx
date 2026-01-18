import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { HeroSection } from '@/components/HeroSection';
import { AudienceRouter } from '@/components/AudienceRouter';
import { OperationalVelocity } from '@/components/OperationalVelocity';
import { NeuralTopology } from '@/components/NeuralTopology';
import { SystemDiagnostics } from '@/components/SystemDiagnostics';
import { DeploymentTimeline } from '@/components/DeploymentTimeline';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Show full landing page for visitors
  return (
    <main className="min-h-screen bg-[#0a0a1e] text-white overflow-x-hidden">
      <HeroSection />
      <AudienceRouter />
      <OperationalVelocity />
      <NeuralTopology />
      <SystemDiagnostics />
      <DeploymentTimeline />
      <ContactForm />
      <Footer />
    </main>
  );
}
