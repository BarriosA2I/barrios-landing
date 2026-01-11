/**
 * BARRIOS A2I ANIMATION COMPONENTS
 * ================================
 *
 * Extracted from aura.build source and converted to proper Next.js 14 components.
 *
 * SETUP STEPS:
 * ------------
 *
 * 1. Copy all component files to your `components/animations/` directory
 *
 * 2. Add globals-additions.css contents to your app/globals.css
 *
 * 3. Make sure you have @/lib/utils.ts with the cn() function:
 *    ```ts
 *    import { clsx, type ClassValue } from 'clsx';
 *    import { twMerge } from 'tailwind-merge';
 *    export function cn(...inputs: ClassValue[]) {
 *      return twMerge(clsx(inputs));
 *    }
 *    ```
 *
 * 4. Install required dependencies:
 *    npm install clsx tailwind-merge
 *
 *
 * USAGE IN LAYOUT.TSX:
 * --------------------
 *
 * ```tsx
 * import { UnicornStudioBackground } from '@/components/animations/UnicornStudioBackground';
 * import { AnamorphicBeam } from '@/components/animations/AnamorphicBeam';
 * import { NexusBridge } from '@/components/animations/NexusBridge';
 * import { SystemLog } from '@/components/animations/SystemLog';
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         {/* Background layer (z-0) *\/}
 *         <UnicornStudioBackground projectId="YOUR_PROJECT_ID_HERE" />
 *
 *         {/* Anamorphic beam (z-1) *\/}
 *         <AnamorphicBeam />
 *
 *         {/* Progress connector (z-5) *\/}
 *         <NexusBridge
 *           startSelector="[data-nexus-start]"
 *           endSelector="[data-nexus-end]"
 *         />
 *
 *         {/* Main content (z-10) *\/}
 *         <main className="relative z-10">
 *           {children}
 *         </main>
 *
 *         {/* System log footer (z-40) *\/}
 *         <SystemLog />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 *
 * USAGE OF NEXUS BRIDGE MARKERS:
 * ------------------------------
 *
 * In your page content, mark the start and end sections:
 *
 * ```tsx
 * <section data-nexus-start id="origin-section">
 *   {/* Content where the progress tracking starts *\/}
 * </section>
 *
 * {/* ... more sections ... *\/}
 *
 * <section data-nexus-end id="cta-section">
 *   {/* Content where the progress tracking ends *\/}
 * </section>
 * ```
 *
 *
 * USAGE OF LIQUID CARDS:
 * ----------------------
 *
 * ```tsx
 * import { LiquidCard } from '@/components/animations/LiquidCard';
 *
 * <LiquidCard className="p-8">
 *   <h3>Card Title</h3>
 *   <p>Card content...</p>
 * </LiquidCard>
 * ```
 *
 *
 * UNICORN STUDIO SETUP:
 * ---------------------
 *
 * CRITICAL: The background animation is hosted on Unicorn Studio's servers.
 *
 * 1. Go to https://unicornstudio.com
 * 2. Create account or log in
 * 3. Create your effect (or use a template)
 * 4. Click "Export" -> "Embed"
 * 5. Copy the project ID from: data-us-project="YOUR_ID_HERE"
 * 6. IMPORTANT: Go to project settings and whitelist your domains:
 *    - localhost:3000 (for development)
 *    - your-domain.com (for production)
 *
 * If you don't whitelist domains, the effect will show as black/empty!
 *
 *
 * TROUBLESHOOTING:
 * ----------------
 *
 * Q: Background is black/empty
 * A: Your domain isn't whitelisted in Unicorn Studio, or the project ID is wrong
 *
 * Q: Liquid card borders don't glow
 * A: Make sure you're on desktop (hover states don't work on touch devices)
 *    Check browser console for JavaScript errors
 *
 * Q: Anamorphic beam doesn't move
 * A: Check if your page has overflow:hidden on html/body
 *    If using Lenis/Locomotive, the scroll event handling should still work
 *
 * Q: Animations are janky
 * A: The components check for prefers-reduced-motion and disable animations
 *    if the user has that preference set
 */

export { AnamorphicBeam } from './AnamorphicBeam';
export { LiquidCard } from './LiquidCard';
export { NexusBridge } from './NexusBridge';
export { SystemLog } from './SystemLog';
export { UnicornStudioBackground } from './UnicornStudioBackground';
