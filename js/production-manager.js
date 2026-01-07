/**
 * ProductionManager v1.0
 * RAGNAROK 8-Phase Production Pipeline Controller
 *
 * Handles SSE streaming from GENESIS production endpoints
 * Manages phase progress, timer, and delivery modal
 */

const ProductionManager = (() => {
    // Configuration
    const GENESIS_URL = 'https://barrios-genesis-flawless.onrender.com';

    // State
    let eventSource = null;
    let timerInterval = null;
    let startTime = null;
    let sessionId = null;
    let currentPhase = null;
    let completedPhases = [];
    let deliveryAssets = null;

    // Phase definitions
    const PHASES = [
        { id: 'intake', name: 'INTAKE', icon: '📋', duration: 5 },
        { id: 'intelligence', name: 'INTEL', icon: '🔍', duration: 15 },
        { id: 'story', name: 'STORY', icon: '📖', duration: 20 },
        { id: 'prompts', name: 'PROMPTS', icon: '🎨', duration: 25 },
        { id: 'video', name: 'VIDEO', icon: '🎥', duration: 120 },
        { id: 'voice', name: 'VOICE', icon: '🎙️', duration: 30 },
        { id: 'assembly', name: 'ASSEMBLY', icon: '🔧', duration: 20 },
        { id: 'qa', name: 'QA', icon: '✅', duration: 8 }
    ];

    /**
     * Start production pipeline
     * @param {string} sid - Session ID from chat
     * @param {Object} brief - Creative brief data
     */
    async function start(sid, brief = {}) {
        sessionId = sid;
        startTime = Date.now();
        completedPhases = [];
        currentPhase = null;

        // Show production status panel
        const statusPanel = document.getElementById('production-status');
        if (statusPanel) {
            statusPanel.classList.add('active');
        }

        // Reset phase indicators
        resetPhaseIndicators();

        // Start timer
        startTimer();

        // Update message
        updateMessage('Connecting to RAGNAROK pipeline...');

        try {
            // Start SSE connection
            const url = `${GENESIS_URL}/api/production/start/${sessionId}`;
            eventSource = new EventSource(url);

            eventSource.onopen = () => {
                console.log('[ProductionManager] SSE connected');
                updateMessage('Pipeline connected. Starting production...');
            };

            eventSource.onmessage = (event) => {
                handleSSEMessage(event);
            };

            eventSource.onerror = (error) => {
                console.error('[ProductionManager] SSE error:', error);
                if (eventSource.readyState === EventSource.CLOSED) {
                    updateMessage('Connection lost. Attempting to reconnect...');
                    // Attempt reconnection after 3 seconds
                    setTimeout(() => reconnect(), 3000);
                }
            };

            // Also send POST to trigger production
            // brief already contains {business_name, industry, style, goals, target_platforms, brief}
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(brief)
            });

        } catch (error) {
            console.error('[ProductionManager] Start error:', error);
            updateMessage(`Error: ${error.message}`);
        }
    }

    /**
     * Handle SSE message
     */
    function handleSSEMessage(event) {
        try {
            const data = JSON.parse(event.data);
            console.log('[ProductionManager] SSE:', data);

            switch (data.type) {
                case 'phase_start':
                    handlePhaseStart(data);
                    break;

                case 'phase_progress':
                    handlePhaseProgress(data);
                    break;

                case 'phase_complete':
                    handlePhaseComplete(data);
                    break;

                case 'production_complete':
                    handleProductionComplete(data);
                    break;

                case 'error':
                    handleError(data);
                    break;

                case 'agent_activity':
                    updateMessage(`🤖 ${data.agent}: ${data.activity}`);
                    break;

                default:
                    if (data.message) {
                        updateMessage(data.message);
                    }
            }
        } catch (error) {
            console.error('[ProductionManager] Parse error:', error);
        }
    }

    /**
     * Handle phase start event
     */
    function handlePhaseStart(data) {
        currentPhase = data.phase;

        // Update phase indicator
        const phaseEl = document.querySelector(`[data-phase="${data.phase}"]`);
        if (phaseEl) {
            phaseEl.classList.add('active');
            phaseEl.classList.remove('completed');
        }

        // Update message
        const phaseName = PHASES.find(p => p.id === data.phase)?.name || data.phase;
        updateMessage(`Phase ${data.phase_number}/8: ${phaseName} - ${data.description || 'Processing...'}`);

        // Update progress bar
        updateProgressBar(data.phase_number - 1, 8);
    }

    /**
     * Handle phase progress event
     */
    function handlePhaseProgress(data) {
        if (data.message) {
            updateMessage(data.message);
        }

        if (data.progress !== undefined) {
            // Interpolate progress within current phase
            const phaseIndex = PHASES.findIndex(p => p.id === currentPhase);
            const baseProgress = phaseIndex / 8;
            const phaseProgress = (data.progress / 100) / 8;
            updateProgressBar((baseProgress + phaseProgress) * 8, 8);
        }
    }

    /**
     * Handle phase complete event
     */
    function handlePhaseComplete(data) {
        completedPhases.push(data.phase);

        // Update phase indicator
        const phaseEl = document.querySelector(`[data-phase="${data.phase}"]`);
        if (phaseEl) {
            phaseEl.classList.remove('active');
            phaseEl.classList.add('completed');
        }

        // Update connector
        const connectors = document.querySelectorAll('.prod-phase-connector');
        const phaseIndex = PHASES.findIndex(p => p.id === data.phase);
        if (connectors[phaseIndex]) {
            connectors[phaseIndex].classList.add('completed');
        }

        // Update progress bar
        updateProgressBar(phaseIndex + 1, 8);

        updateMessage(`✅ ${data.phase.toUpperCase()} complete`);
    }

    /**
     * Handle production complete event
     */
    function handleProductionComplete(data) {
        // Stop timer
        stopTimer();

        // Close SSE
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }

        // Mark all phases complete
        PHASES.forEach(phase => {
            const phaseEl = document.querySelector(`[data-phase="${phase.id}"]`);
            if (phaseEl) {
                phaseEl.classList.remove('active');
                phaseEl.classList.add('completed');
            }
        });

        // Full progress
        updateProgressBar(8, 8);

        // Store delivery assets
        deliveryAssets = data.assets || {};

        // Show completion message
        updateMessage('🎉 Production complete! Preparing delivery...');

        // Show delivery modal after short delay
        setTimeout(() => {
            showDeliveryModal(data);
        }, 1500);
    }

    /**
     * Handle error event
     */
    function handleError(data) {
        console.error('[ProductionManager] Production error:', data);
        updateMessage(`❌ Error: ${data.message || 'Unknown error'}`);

        // Mark current phase as failed (red styling)
        if (currentPhase) {
            const phaseEl = document.querySelector(`[data-phase="${currentPhase}"]`);
            if (phaseEl) {
                phaseEl.classList.add('error');
            }
        }
    }

    /**
     * Show delivery modal with final assets
     */
    function showDeliveryModal(data) {
        const modal = document.getElementById('delivery-modal');
        if (!modal) return;

        // Set video source
        const video = document.getElementById('delivery-video');
        if (video && data.assets?.video_url) {
            video.querySelector('source').src = data.assets.video_url;
            video.poster = data.assets.thumbnail_url || '';
            video.load();
        }

        // Set stats
        setDeliveryStat('delivery-duration', data.assets?.duration || '--');
        setDeliveryStat('delivery-resolution', data.assets?.resolution || '1080p');
        setDeliveryStat('delivery-format', data.assets?.format || 'MP4');
        setDeliveryStat('delivery-size', formatFileSize(data.assets?.size_bytes));

        // Show modal
        modal.classList.add('active');

        // Hide production status
        const statusPanel = document.getElementById('production-status');
        if (statusPanel) {
            statusPanel.classList.remove('active');
        }
    }

    /**
     * Close delivery modal
     */
    function closeDelivery() {
        const modal = document.getElementById('delivery-modal');
        if (modal) {
            modal.classList.remove('active');
        }

        // Reset state
        reset();
    }

    /**
     * Download asset in specified format
     */
    function download(format) {
        if (!deliveryAssets) {
            console.error('[ProductionManager] No assets to download');
            return;
        }

        const url = deliveryAssets[`${format}_url`] || deliveryAssets.video_url;
        if (url) {
            window.open(url, '_blank');
        }
    }

    /**
     * Start new production
     */
    function newProduction() {
        closeDelivery();
        // Reset chat or trigger new brief
        // This will be handled by the chat interface
    }

    /**
     * Cancel production
     */
    function cancel() {
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }

        stopTimer();

        const statusPanel = document.getElementById('production-status');
        if (statusPanel) {
            statusPanel.classList.remove('active');
        }

        reset();

        // Notify backend
        if (sessionId) {
            fetch(`${GENESIS_URL}/api/production/cancel/${sessionId}`, {
                method: 'POST'
            }).catch(console.error);
        }
    }

    /**
     * Reset all state
     */
    function reset() {
        completedPhases = [];
        currentPhase = null;
        deliveryAssets = null;
        sessionId = null;
        startTime = null;

        resetPhaseIndicators();
        updateProgressBar(0, 8);
        updateMessage('Initializing RAGNAROK pipeline...');
    }

    /**
     * Reset phase indicators
     */
    function resetPhaseIndicators() {
        document.querySelectorAll('.prod-phase').forEach(el => {
            el.classList.remove('active', 'completed', 'error');
        });
        document.querySelectorAll('.prod-phase-connector').forEach(el => {
            el.classList.remove('completed');
        });
    }

    /**
     * Start production timer
     */
    function startTimer() {
        const timerEl = document.getElementById('production-timer');
        if (!timerEl) return;

        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            timerEl.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    /**
     * Stop production timer
     */
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    /**
     * Update progress bar
     */
    function updateProgressBar(completed, total) {
        const bar = document.getElementById('production-progress');
        if (bar) {
            const percent = (completed / total) * 100;
            bar.style.width = `${percent}%`;
        }
    }

    /**
     * Update status message
     */
    function updateMessage(text) {
        const msgEl = document.getElementById('production-message');
        if (msgEl) {
            msgEl.textContent = text;
        }
    }

    /**
     * Set delivery stat value
     */
    function setDeliveryStat(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }

    /**
     * Format file size
     */
    function formatFileSize(bytes) {
        if (!bytes) return '--';
        const units = ['B', 'KB', 'MB', 'GB'];
        let unitIndex = 0;
        let size = bytes;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    /**
     * Reconnect SSE
     */
    function reconnect() {
        if (sessionId && !eventSource) {
            const url = `${GENESIS_URL}/api/production/start/${sessionId}`;
            eventSource = new EventSource(url);
            eventSource.onmessage = handleSSEMessage;
            eventSource.onerror = (error) => {
                console.error('[ProductionManager] Reconnect error:', error);
            };
        }
    }

    /**
     * Get current status
     */
    async function getStatus() {
        if (!sessionId) return null;

        try {
            const response = await fetch(`${GENESIS_URL}/api/production/status/${sessionId}`);
            return await response.json();
        } catch (error) {
            console.error('[ProductionManager] Status error:', error);
            return null;
        }
    }

    // Public API
    return {
        start,
        cancel,
        reset,
        getStatus,
        closeDelivery,
        download,
        newProduction,
        PHASES
    };
})();

// Make globally available
if (typeof window !== 'undefined') {
    window.ProductionManager = ProductionManager;
}

console.log('[ProductionManager] v1.0 loaded - RAGNAROK 8-Phase Pipeline Controller');
