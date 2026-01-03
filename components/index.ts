/**
 * Barrios A2I Components - Barrel Export
 * =======================================
 * Neural RAG Brain v3.0 + RAGNAROK v7.0 APEX
 * 
 * Version: 4.0.0 (Gemini Upgrade)
 * 
 * New in v4.0:
 * - Agent Micro-Visualizations (ScripterVisual, VisualizerVisual, etc.)
 * - ExplainModeStrip for privacy/trust messaging
 * - Cost-Aware Thompson Sampling integration hooks
 * 
 * @author Barrios A2I
 */

// ============================================================================
// MEDIA UPLOAD
// ============================================================================

export { 
  default as GlassMediaUploader, 
  GlassMediaUploader as MediaUploader 
} from './GlassMediaUploader';

export type { 
  UploadStatus, 
  GlassMediaUploaderProps 
} from './GlassMediaUploader';

// ============================================================================
// AGENT MICRO-VISUALIZATIONS (v4.0 Gemini Upgrade)
// ============================================================================

export { 
  default as AgentVisual,
  AGENT_VISUALS,
  StrategistVisual,
  ScripterVisual,
  VisualizerVisual,
  SoundDesignerVisual,
  AssemblerVisual,
  QAVisual,
  DeliveryVisual
} from './AgentVisuals';

export type { AgentVisualProps } from './AgentVisuals';

// ============================================================================
// EXPLAIN MODE & TRUST COMPONENTS (v4.0 Gemini Upgrade)
// ============================================================================

export { 
  default as ExplainModeStrip,
  PrivacyBadge,
  ValueProposition,
  ProcessingIndicator
} from './ExplainModeStrip';

// ============================================================================
// SIDEBAR & NAVIGATION
// ============================================================================

export { 
  default as NexusSidebar, 
  NexusSidebar as Sidebar 
} from './NexusSidebar';

// ============================================================================
// STATUS & METRICS WIDGETS
// ============================================================================

export { 
  StatusWidget, 
  TimeSavedWidget 
} from './StatusWidget';

// ============================================================================
// MODALS & OVERLAYS
// ============================================================================

export { default as DemoTaskModal } from './DemoTaskModal';

// ============================================================================
// PRODUCTION DASHBOARD COMPONENTS
// ============================================================================

// Agent status card with micro-visualization integration
export { default as AgentStatusCard } from './AgentStatusCard';

// Production timeline view
export { default as ProductionTimeline } from './ProductionTimeline';

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

// Glass morphism card wrapper
export { default as GlassCard } from './GlassCard';

// Animated number counter
export { default as AnimatedCounter } from './AnimatedCounter';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

export const AGENT_CONFIG = {
  1: { 
    name: 'Strategist', 
    color: '#00CED1', 
    description: 'Market Intelligence Analysis' 
  },
  2: { 
    name: 'Scripter', 
    color: '#00CED1', 
    description: 'Narrative & Script Generation' 
  },
  3: { 
    name: 'Visualizer', 
    color: '#00CED1', 
    description: 'Visual Style & Prompt Engineering' 
  },
  4: { 
    name: 'Sound Designer', 
    color: '#F59E0B', 
    description: 'Audio & Voiceover Generation' 
  },
  5: { 
    name: 'Assembler', 
    color: '#8B5CF6', 
    description: 'Video Assembly & Post-Production' 
  },
  6: { 
    name: 'QA Checker', 
    color: '#10B981', 
    description: 'Quality Validation (195+ Checks)' 
  },
  7: { 
    name: 'Delivery', 
    color: '#10B981', 
    description: 'Multi-Format Export & CDN Upload' 
  },
} as const;

export const THEME = {
  primary: '#00CED1',      // Crystalline teal
  secondary: '#8B5CF6',    // Purple accent
  success: '#10B981',      // Emerald
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
  background: '#0a0a1e',   // Deep space
  surface: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.1)',
} as const;

// ============================================================================
// VERSION INFO
// ============================================================================

export const VERSION = {
  components: '4.0.0',
  neuralRagBrain: '3.0',
  ragnarok: '7.0-APEX',
  codename: 'Gemini Upgrade',
  features: [
    'Agent Micro-Visualizations',
    'ExplainModeStrip',
    'Cost-Aware Thompson Sampling',
    'Resumable Multipart Uploads',
  ]
} as const;
