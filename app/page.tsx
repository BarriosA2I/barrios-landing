// app/page.tsx
// Purpose: Main landing page with Central Switchboard architecture
// Zones: Hook (Hero) → Router (Segmentation) → Proof (Metrics) → Ecosystem (Topology)

import { HeroSection } from '@/components/HeroSection';
import { AudienceRouter } from '@/components/AudienceRouter';
import { OperationalVelocity } from '@/components/OperationalVelocity';
import { NeuralTopology } from '@/components/NeuralTopology';
import { SystemDiagnostics } from '@/components/SystemDiagnostics';
import { DeploymentTimeline } from '@/components/DeploymentTimeline';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a1e] text-white overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          ZONE 1: THE HOOK (Identity)
          Goal: Establish Barrios A2I as "Intelligence Architecture"
          ═══════════════════════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ═══════════════════════════════════════════════════════════════════
          ZONE 2: THE ROUTER (Segmentation)
          Goal: Immediate audience segmentation - "Who am I?"
          REPLACES: The confusing "Three Engines" model selector
          ═══════════════════════════════════════════════════════════════════ */}
      <AudienceRouter />

      {/* ═══════════════════════════════════════════════════════════════════
          ZONE 3: THE PROOF (Live Metrics)
          Goal: Prove the nervous system is alive and operational
          ═══════════════════════════════════════════════════════════════════ */}
      <OperationalVelocity />

      {/* ═══════════════════════════════════════════════════════════════════
          ZONE 4: THE ECOSYSTEM (Topology)
          Goal: Show interconnected product architecture
          ═══════════════════════════════════════════════════════════════════ */}
      <NeuralTopology />

      {/* ═══════════════════════════════════════════════════════════════════
          SUPPORTING SECTIONS
          ═══════════════════════════════════════════════════════════════════ */}
      <SystemDiagnostics />
      <DeploymentTimeline />
      <ContactForm />
      <Footer />
    </main>
  );
}
