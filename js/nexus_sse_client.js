/**
 * NEXUS BRIDGE SSE Client
 * Real-time production status streaming for Creative Director
 * 
 * Author: Principal Orchestrator Architect
 * Features: SSE streaming, auto-reconnect, progress visualization
 */

// =============================================================================
// SSE CLIENT CLASS
// =============================================================================
class NexusProductionClient {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.onStatus = options.onStatus || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onError = options.onError || (() => {});
        this.onPhaseChange = options.onPhaseChange || (() => {});
        
        this.eventSource = null;
        this.sessionId = null;
        this.currentPhase = null;
        this.retryCount = 0;
        this.maxRetries = 3;
    }
    
    /**
     * Start production and stream updates via SSE
     * @param {string} sessionId - Session ID from intake
     * @param {Object} options - Production options
     */
    async startProduction(sessionId, options = {}) {
        this.sessionId = sessionId;
        this.retryCount = 0;
        
        // Close existing connection
        this.disconnect();
        
        // Start SSE connection
        const url = `${this.baseUrl}/api/legendary/production/start/${sessionId}`;
        
        try {
            // POST to start, which returns SSE stream
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to start production');
            }
            
            // Handle SSE stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            this._processStream(reader, decoder);
            
        } catch (error) {
            this.onError({
                type: 'connection_error',
                message: error.message,
                sessionId: this.sessionId
            });
        }
    }
    
    /**
     * Process SSE stream
     */
    async _processStream(reader, decoder) {
        let buffer = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('Stream complete');
                    break;
                }
                
                buffer += decoder.decode(value, { stream: true });
                
                // Process complete SSE events
                const lines = buffer.split('\n\n');
                buffer = lines.pop(); // Keep incomplete event in buffer
                
                for (const event of lines) {
                    if (event.startsWith('data: ')) {
                        const data = event.slice(6);
                        try {
                            const status = JSON.parse(data);
                            this._handleStatus(status);
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e);
                        }
                    }
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.onError({
                    type: 'stream_error',
                    message: error.message,
                    sessionId: this.sessionId
                });
                
                // Attempt reconnect via polling
                this._fallbackToPolling();
            }
        }
    }
    
    /**
     * Handle status update
     */
    _handleStatus(status) {
        // Detect phase changes
        if (status.phase !== this.currentPhase) {
            const previousPhase = this.currentPhase;
            this.currentPhase = status.phase;
            this.onPhaseChange({
                previous: previousPhase,
                current: status.phase,
                status: status
            });
        }
        
        // Emit status update
        this.onStatus(status);
        
        // Check for completion
        if (status.phase === 'completed') {
            this.onComplete({
                sessionId: status.session_id,
                deliverables: status.metadata?.deliverables || {},
                qualityScore: status.metadata?.quality_score,
                totalCost: status.cost_so_far
            });
            this.disconnect();
        }
        
        // Check for failure
        if (status.phase === 'failed') {
            this.onError({
                type: 'production_failed',
                message: status.error || status.message,
                sessionId: status.session_id,
                costIncurred: status.cost_so_far
            });
            this.disconnect();
        }
    }
    
    /**
     * Fallback to polling when SSE fails
     */
    async _fallbackToPolling() {
        if (this.retryCount >= this.maxRetries) {
            this.onError({
                type: 'max_retries_exceeded',
                message: 'Unable to connect to production service',
                sessionId: this.sessionId
            });
            return;
        }
        
        this.retryCount++;
        console.log(`Falling back to polling (attempt ${this.retryCount})`);
        
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(
                    `${this.baseUrl}/api/legendary/production/status/${this.sessionId}`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to get status');
                }
                
                const status = await response.json();
                this._handleStatus(status);
                
                if (status.phase === 'completed' || status.phase === 'failed') {
                    clearInterval(pollInterval);
                }
                
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000); // Poll every 3 seconds
        
        this.pollInterval = pollInterval;
    }
    
    /**
     * Get current status (manual refresh)
     */
    async getStatus() {
        if (!this.sessionId) {
            throw new Error('No active production');
        }
        
        const response = await fetch(
            `${this.baseUrl}/api/legendary/production/status/${this.sessionId}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to get status');
        }
        
        return await response.json();
    }
    
    /**
     * Get final result
     */
    async getResult() {
        if (!this.sessionId) {
            throw new Error('No active production');
        }
        
        const response = await fetch(
            `${this.baseUrl}/api/legendary/production/result/${this.sessionId}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to get result');
        }
        
        return await response.json();
    }
    
    /**
     * Cancel production
     */
    async cancel(reason = 'User requested cancellation') {
        if (!this.sessionId) {
            throw new Error('No active production');
        }
        
        const response = await fetch(
            `${this.baseUrl}/api/legendary/production/cancel/${this.sessionId}?reason=${encodeURIComponent(reason)}`,
            { method: 'POST' }
        );
        
        if (!response.ok) {
            throw new Error('Failed to cancel production');
        }
        
        this.disconnect();
        return await response.json();
    }
    
    /**
     * Disconnect from stream
     */
    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

/**
 * Production Progress Bar Component
 */
class ProductionProgressBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.phases = [
            { id: 'research', label: 'Research', icon: '🔍' },
            { id: 'script', label: 'Script', icon: '📝' },
            { id: 'production', label: 'Video', icon: '🎬' },
            { id: 'post', label: 'Post', icon: '🎵' },
            { id: 'qa', label: 'QA', icon: '✅' },
            { id: 'delivery', label: 'Delivery', icon: '📦' }
        ];
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="nexus-progress-container" style="
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                border: 1px solid #00ced1;
                border-radius: 12px;
                padding: 24px;
                margin: 20px 0;
            ">
                <div class="nexus-progress-header" style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                ">
                    <h3 style="color: #00ced1; margin: 0; font-family: 'Orbitron', sans-serif;">
                        🚀 LEGENDARY PRODUCTION
                    </h3>
                    <span id="nexus-progress-percent" style="color: #ffd700; font-size: 1.2em;">0%</span>
                </div>
                
                <div class="nexus-progress-bar" style="
                    height: 8px;
                    background: #1a1a1a;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 20px;
                ">
                    <div id="nexus-progress-fill" style="
                        height: 100%;
                        width: 0%;
                        background: linear-gradient(90deg, #00ced1, #ffd700);
                        border-radius: 4px;
                        transition: width 0.5s ease;
                    "></div>
                </div>
                
                <div class="nexus-phases" style="
                    display: flex;
                    justify-content: space-between;
                ">
                    ${this.phases.map(phase => `
                        <div class="nexus-phase" id="phase-${phase.id}" style="
                            text-align: center;
                            opacity: 0.4;
                            transition: opacity 0.3s ease;
                        ">
                            <div style="font-size: 1.5em; margin-bottom: 4px;">${phase.icon}</div>
                            <div style="font-size: 0.8em; color: #888;">${phase.label}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div id="nexus-status-message" style="
                    margin-top: 20px;
                    padding: 12px;
                    background: rgba(0, 206, 209, 0.1);
                    border-radius: 8px;
                    color: #00ced1;
                    font-size: 0.9em;
                    text-align: center;
                ">
                    Initializing production pipeline...
                </div>
                
                <div class="nexus-metrics" style="
                    display: flex;
                    justify-content: space-around;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #333;
                ">
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.8em;">Cost</div>
                        <div id="nexus-cost" style="color: #ffd700; font-weight: bold;">$0.00</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.8em;">ETA</div>
                        <div id="nexus-eta" style="color: #00ced1; font-weight: bold;">~10 min</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.8em;">Agent</div>
                        <div id="nexus-agent" style="color: #fff; font-weight: bold;">-</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    update(status) {
        // Update progress bar
        const progressFill = document.getElementById('nexus-progress-fill');
        const progressPercent = document.getElementById('nexus-progress-percent');
        progressFill.style.width = `${status.progress * 100}%`;
        progressPercent.textContent = `${Math.round(status.progress * 100)}%`;
        
        // Update phase indicators
        const phaseOrder = ['research', 'script', 'production', 'post', 'qa', 'delivery'];
        const currentIndex = phaseOrder.indexOf(status.phase);
        
        phaseOrder.forEach((phase, index) => {
            const el = document.getElementById(`phase-${phase}`);
            if (el) {
                if (index < currentIndex) {
                    el.style.opacity = '1';
                    el.style.color = '#00ff00';
                } else if (index === currentIndex) {
                    el.style.opacity = '1';
                    el.style.color = '#00ced1';
                    el.style.transform = 'scale(1.1)';
                } else {
                    el.style.opacity = '0.4';
                    el.style.transform = 'scale(1)';
                }
            }
        });
        
        // Update status message
        document.getElementById('nexus-status-message').textContent = status.message;
        
        // Update metrics
        document.getElementById('nexus-cost').textContent = `$${status.cost_so_far.toFixed(2)}`;
        
        if (status.estimated_remaining) {
            const minutes = Math.ceil(status.estimated_remaining / 60);
            document.getElementById('nexus-eta').textContent = `~${minutes} min`;
        }
        
        if (status.agent) {
            document.getElementById('nexus-agent').textContent = status.agent;
        }
    }
    
    showComplete(result) {
        this.container.innerHTML = `
            <div class="nexus-complete" style="
                background: linear-gradient(135deg, #0a2a0a 0%, #1a3a1a 100%);
                border: 2px solid #00ff00;
                border-radius: 12px;
                padding: 32px;
                text-align: center;
            ">
                <div style="font-size: 4em; margin-bottom: 16px;">🎬✅</div>
                <h2 style="color: #00ff00; margin-bottom: 24px;">
                    LEGENDARY COMMERCIAL COMPLETE!
                </h2>
                
                <div class="deliverables" style="margin: 24px 0;">
                    ${Object.entries(result.deliverables || {}).map(([format, url]) => `
                        <a href="${url}" target="_blank" style="
                            display: inline-block;
                            padding: 12px 24px;
                            margin: 8px;
                            background: linear-gradient(135deg, #00ced1, #008b8b);
                            color: #fff;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                        ">
                            📥 ${format.toUpperCase()}
                        </a>
                    `).join('')}
                </div>
                
                <div style="color: #888; margin-top: 24px;">
                    Quality Score: <span style="color: #ffd700;">${(result.qualityScore * 100).toFixed(1)}%</span> |
                    Total Cost: <span style="color: #00ff00;">$${result.totalCost.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
    
    showError(error) {
        this.container.innerHTML = `
            <div class="nexus-error" style="
                background: linear-gradient(135deg, #2a0a0a 0%, #3a1a1a 100%);
                border: 2px solid #ff4444;
                border-radius: 12px;
                padding: 32px;
                text-align: center;
            ">
                <div style="font-size: 4em; margin-bottom: 16px;">⚠️</div>
                <h2 style="color: #ff4444; margin-bottom: 16px;">
                    Production Error
                </h2>
                <p style="color: #ff8888;">${error.message}</p>
                <button onclick="location.reload()" style="
                    padding: 12px 24px;
                    margin-top: 16px;
                    background: #ff4444;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">
                    Retry
                </button>
            </div>
        `;
    }
}

// =============================================================================
// INTEGRATION EXAMPLE
// =============================================================================

/**
 * Initialize production when brief is approved
 * Add this to your existing creative-director.html
 */
function initLegendaryProduction(sessionId) {
    // Create progress bar
    const progressBar = new ProductionProgressBar('production-container');
    
    // Create SSE client
    const client = new NexusProductionClient({
        baseUrl: '', // Same origin
        
        onStatus: (status) => {
            console.log('Production status:', status);
            progressBar.update(status);
        },
        
        onPhaseChange: ({ previous, current, status }) => {
            console.log(`Phase changed: ${previous} → ${current}`);
            
            // Play sound effect (optional)
            if (window.playPhaseSound) {
                window.playPhaseSound(current);
            }
        },
        
        onComplete: (result) => {
            console.log('Production complete!', result);
            progressBar.showComplete(result);
            
            // Show celebration animation (optional)
            if (window.confetti) {
                window.confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        },
        
        onError: (error) => {
            console.error('Production error:', error);
            progressBar.showError(error);
        }
    });
    
    // Start production
    client.startProduction(sessionId);
    
    // Return client for external control
    return client;
}

// =============================================================================
// EXPORT
// =============================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NexusProductionClient, ProductionProgressBar, initLegendaryProduction };
}

// Make available globally
window.NexusProductionClient = NexusProductionClient;
window.ProductionProgressBar = ProductionProgressBar;
window.initLegendaryProduction = initLegendaryProduction;
