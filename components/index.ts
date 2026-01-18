/**
 * Barrios A2I Components - Central Switchboard Edition
 * =====================================================
 * Homepage components for the Intelligence Architecture
 *
 * Version: 6.0.0 (Central Switchboard)
 */

// ============================================================================
// CENTRAL SWITCHBOARD - HOMEPAGE SECTIONS
// ============================================================================

export { HeroSection } from './HeroSection';
export { AudienceRouter } from './AudienceRouter';
export { OperationalVelocity } from './OperationalVelocity';
export { NeuralTopology } from './NeuralTopology';
export { SystemDiagnostics } from './SystemDiagnostics';
export { DeploymentTimeline } from './DeploymentTimeline';
export { ContactForm } from './ContactForm';
export { Footer } from './Footer';

// ============================================================================
// LEGACY COMPONENTS (preserved for other pages)
// ============================================================================

export { default as AgentVisual, AGENT_VISUALS } from './AgentVisuals';
export { default as ExplainModeStrip } from './ExplainModeStrip';
export { default as ThinkingStream } from './ThinkingStream';
export { default as NeuralHive } from './NeuralHive';
export { default as Pricing } from './Pricing';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

export const AGENT_CONFIG = {
  1: { name: 'Strategist', color: '#00CED1', description: 'Market Intelligence Analysis' },
  2: { name: 'Scripter', color: '#00CED1', description: 'Narrative & Script Generation' },
  3: { name: 'Visualizer', color: '#00CED1', description: 'Visual Style & Prompt Engineering' },
  4: { name: 'Sound Designer', color: '#F59E0B', description: 'Audio & Voiceover Generation' },
  5: { name: 'Assembler', color: '#8B5CF6', description: 'Video Assembly & Post-Production' },
  6: { name: 'QA Checker', color: '#10B981', description: 'Quality Validation (195+ Checks)' },
  7: { name: 'Delivery', color: '#10B981', description: 'Multi-Format Export & CDN Upload' },
} as const;

export const THEME = {
  primary: '#00CED1',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#0a0a1e',
  surface: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.1)',
} as const;

// ============================================================================
// VERSION INFO
// ============================================================================

export const VERSION = {
  components: '6.0.0',
  codename: 'Central Switchboard',
} as const;
