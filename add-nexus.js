const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// Nexus CSS styles
const nexusCSS = `
    /* ========================================
       NEXUS BRAIN - Chat Interface Styles
       ======================================== */

    /* --- Launcher Button --- */
    .nexus-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 56px;
      height: 56px;
      padding: 0;
      border: none;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(10, 10, 30, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
      box-shadow:
        0 0 0 1px rgba(0, 194, 255, 0.3),
        0 4px 24px rgba(0, 0, 0, 0.5),
        0 0 40px rgba(0, 194, 255, 0.15);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      overflow: visible;
    }

    .nexus-launcher:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow:
        0 0 0 1px rgba(0, 194, 255, 0.5),
        0 8px 32px rgba(0, 0, 0, 0.6),
        0 0 60px rgba(0, 194, 255, 0.25);
    }

    .nexus-launcher:focus-visible {
      outline: 2px solid #00C2FF;
      outline-offset: 3px;
    }

    .nexus-launcher--active {
      box-shadow:
        0 0 0 2px rgba(0, 194, 255, 0.6),
        0 4px 24px rgba(0, 0, 0, 0.5),
        0 0 50px rgba(0, 194, 255, 0.3);
    }

    .nexus-launcher-glow {
      position: absolute;
      inset: -8px;
      border-radius: 24px;
      background: radial-gradient(circle at 50% 50%, rgba(0, 194, 255, 0.25), transparent 70%);
      filter: blur(12px);
      opacity: 0.6;
      animation: nexus-breathe 3s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes nexus-breathe {
      0%, 100% { transform: scale(0.95); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .nexus-launcher-inner {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nexus-launcher-icon {
      width: 28px;
      height: 28px;
      color: #00C2FF;
      transition: color 0.2s ease;
    }

    .nexus-launcher:hover .nexus-launcher-icon {
      color: #22D3EE;
    }

    .nexus-launcher-pulse {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    }

    .nexus-launcher-pulse::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.4);
      animation: nexus-pulse-ring 2s ease-out infinite;
    }

    @keyframes nexus-pulse-ring {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }

    /* Tooltip */
    .nexus-launcher::before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 12px);
      right: 0;
      padding: 8px 12px;
      background: rgba(10, 10, 30, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.1em;
      color: #00C2FF;
      white-space: nowrap;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
    }

    .nexus-launcher:hover::before {
      opacity: 1;
      transform: translateY(0);
    }

    /* Mobile positioning - prevent cutoff on right edge */
    @media (max-width: 768px) {
      .nexus-launcher {
        bottom: 16px;
        right: 12px;
        width: 48px;
        height: 48px;
      }
    }

    /* Extra small screens - even more breathing room */
    @media (max-width: 380px) {
      .nexus-launcher {
        bottom: 12px;
        right: 8px;
        width: 44px;
        height: 44px;
      }
    }

    /* --- Backdrop --- */
    .nexus-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9998;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .nexus-backdrop--visible {
      opacity: 1;
      visibility: visible;
    }

    /* --- Panel --- */
    .nexus-panel {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 10000;
      width: 420px;
      max-width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(180deg, rgba(10, 10, 30, 0.98) 0%, rgba(11, 18, 32, 0.98) 100%);
      backdrop-filter: blur(24px);
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nexus-panel--open {
      transform: translateX(0);
    }

    /* Mobile: full screen */
    @media (max-width: 768px) {
      .nexus-panel {
        width: 100vw;
        border-left: none;
      }
    }

    /* --- Panel Header --- */
    .nexus-panel-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .nexus-panel-title-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nexus-panel-branding {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nexus-panel-logo {
      width: 32px;
      height: 32px;
      color: #00C2FF;
    }

    .nexus-panel-title-text {
      display: flex;
      flex-direction: column;
    }

    .nexus-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #fff;
      margin: 0;
    }

    .nexus-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
    }

    /* Status Pill */
    .nexus-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }

    .nexus-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #666;
    }

    .nexus-status-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.1em;
      color: #666;
    }

    .nexus-status--loading .nexus-status-dot {
      background: #F59E0B;
      animation: nexus-blink 1s ease-in-out infinite;
    }
    .nexus-status--loading .nexus-status-text { color: #F59E0B; }

    .nexus-status--online .nexus-status-dot {
      background: #22C55E;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
    }
    .nexus-status--online .nexus-status-text { color: #22C55E; }

    .nexus-status--degraded .nexus-status-dot {
      background: #F59E0B;
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
    }
    .nexus-status--degraded .nexus-status-text { color: #F59E0B; }

    .nexus-status--offline .nexus-status-dot { background: #EF4444; }
    .nexus-status--offline .nexus-status-text { color: #EF4444; }

    @keyframes nexus-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* Close Button */
    .nexus-close {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nexus-close:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    .nexus-close svg {
      width: 18px;
      height: 18px;
    }

    /* --- Messages Container --- */
    .nexus-panel-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Welcome Screen */
    .nexus-welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 20px;
      height: 100%;
    }

    .nexus-welcome-icon {
      width: 64px;
      height: 64px;
      margin-bottom: 24px;
      color: #00C2FF;
      opacity: 0.6;
    }

    .nexus-welcome-icon svg {
      width: 100%;
      height: 100%;
    }

    .nexus-welcome-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #fff;
      margin: 0 0 12px;
    }

    .nexus-welcome-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      max-width: 280px;
      line-height: 1.6;
      margin: 0 0 24px;
    }

    .nexus-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }

    .nexus-quick-btn {
      padding: 8px 16px;
      background: rgba(0, 194, 255, 0.1);
      border: 1px solid rgba(0, 194, 255, 0.2);
      border-radius: 20px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #00C2FF;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nexus-quick-btn:hover {
      background: rgba(0, 194, 255, 0.2);
      border-color: rgba(0, 194, 255, 0.4);
    }

    /* --- Messages --- */
    .nexus-message {
      max-width: 95%;
    }

    .nexus-message--user {
      align-self: flex-end;
    }

    .nexus-message--user .nexus-message-content {
      background: linear-gradient(135deg, rgba(0, 194, 255, 0.15) 0%, rgba(0, 194, 255, 0.08) 100%);
      border: 1px solid rgba(0, 194, 255, 0.2);
      border-radius: 16px 16px 4px 16px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      line-height: 1.5;
    }

    .nexus-message--assistant {
      align-self: flex-start;
    }

    .nexus-message-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .nexus-message-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #00C2FF;
    }

    .nexus-message-trace {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.3);
    }

    .nexus-message--assistant .nexus-message-content {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px 16px 16px 16px;
      padding: 14px 16px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      line-height: 1.6;
    }

    .nexus-message-content strong {
      color: #00C2FF;
      font-weight: 600;
    }

    .nexus-message-content em {
      color: rgba(255, 255, 255, 0.7);
    }

    .nexus-inline-code {
      background: rgba(0, 194, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #00C2FF;
    }

    /* Typing Indicator */
    .nexus-typing-indicator {
      display: flex;
      gap: 4px;
      padding: 4px 0;
    }

    .nexus-typing-indicator span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00C2FF;
      animation: nexus-typing 1.4s ease-in-out infinite;
    }

    .nexus-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .nexus-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes nexus-typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    /* Error */
    .nexus-error {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #EF4444;
      font-size: 13px;
    }

    .nexus-error svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    /* --- Citations --- */
    .nexus-citations {
      margin-top: 12px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      overflow: hidden;
    }

    .nexus-citations-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .nexus-citations-header svg {
      width: 14px;
      height: 14px;
      color: rgba(255, 255, 255, 0.4);
    }

    .nexus-citations-header span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.5);
    }

    .nexus-citations-count {
      margin-left: auto;
      padding: 2px 6px;
      background: rgba(0, 194, 255, 0.1);
      border-radius: 10px;
      font-size: 9px;
      color: #00C2FF;
    }

    .nexus-citations-list {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nexus-citation {
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 6px;
    }

    .nexus-citation-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .nexus-citation-index {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      color: #00C2FF;
    }

    .nexus-citation-title {
      flex: 1;
      font-size: 12px;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nexus-citation-relevance {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #22C55E;
    }

    .nexus-citation-excerpt {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.5;
      margin: 0 0 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .nexus-citation-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      color: #00C2FF;
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .nexus-citation-link:hover {
      opacity: 1;
    }

    .nexus-citation-link svg {
      width: 12px;
      height: 12px;
    }

    /* --- Input Area --- */
    .nexus-panel-input-container {
      flex-shrink: 0;
      padding: 16px 20px;
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .nexus-input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 4px 4px 4px 16px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .nexus-input-wrapper:focus-within {
      border-color: rgba(0, 194, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1);
    }

    .nexus-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #fff;
    }

    .nexus-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    .nexus-input:disabled {
      opacity: 0.5;
    }

    .nexus-send {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #00C2FF 0%, #0891B2 100%);
      border: none;
      border-radius: 8px;
      color: #0a0a1e;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nexus-send:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(0, 194, 255, 0.3);
    }

    .nexus-send:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .nexus-send svg {
      width: 18px;
      height: 18px;
    }

    .nexus-input-hint {
      margin-top: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.3);
      text-align: center;
    }

    .nexus-hint-key {
      display: inline-block;
      padding: 2px 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .nexus-launcher-glow,
      .nexus-launcher-pulse::before,
      .nexus-typing-indicator span {
        animation: none;
      }
      .nexus-panel {
        transition: none;
      }
    }
`;

// Check if Nexus CSS already exists
if (!html.includes('NEXUS BRAIN - Chat Interface Styles')) {
  // Insert CSS before closing </style> tag
  html = html.replace('</style>', nexusCSS + '\n    </style>');
  console.log('Added Nexus CSS styles');
} else {
  console.log('Nexus CSS already exists');
}

// Add script includes before </body>
const scriptIncludes = `
    <!-- Nexus Brain Chat System -->
    <script src="js/nexus-chat.js"></script>
    <script src="js/nexus-panel.js"></script>
    <script src="js/nexus-launcher.js"></script>
`;

if (!html.includes('nexus-launcher.js')) {
  html = html.replace('</body>', scriptIncludes + '\n</body>');
  console.log('Added Nexus script includes');
} else {
  console.log('Nexus scripts already included');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Nexus Brain chat system integrated.');
