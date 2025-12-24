/**
 * ================================================================================
 * CREATIVE DIRECTOR - LEGENDARY FRONTEND
 * ================================================================================
 * 6-Agent Pipeline Interface | Generative UI Components
 * ================================================================================
 */

// Configuration
const CONFIG = {
    API_BASE: 'https://barrios-creative-director.onrender.com',
    POLL_INTERVAL: 3000,
    STRIPE_PAYMENT_LINK: 'https://buy.stripe.com/00w4gA84Ve498yF27H',
};

// State
let state = {
    sessionId: null,
    phase: 'initializing',
    brief: null,
    concepts: [],
    selectedConceptId: null,
    script: null,
    qualityReport: null,
    productionJobId: null,
    videoUrl: null,
    isLoading: false,
    pollTimer: null,
};

// DOM Elements
const elements = {
    statusIndicator: document.getElementById('statusIndicator'),
    sessionInfo: document.getElementById('sessionInfo'),
    pipelineProgress: document.getElementById('pipelineProgress'),
    messagesContainer: document.getElementById('messagesContainer'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    generativeUI: document.getElementById('generativeUI'),
    messageForm: document.getElementById('messageForm'),
    messageInput: document.getElementById('messageInput'),
    sendButton: document.getElementById('sendButton'),
    inputHint: document.getElementById('inputHint'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    sidebar: document.getElementById('sidebar'),
    briefSummary: document.getElementById('briefSummary'),
    briefContent: document.getElementById('briefContent'),
    researchInsights: document.getElementById('researchInsights'),
    insightsContent: document.getElementById('insightsContent'),
    qualityScore: document.getElementById('qualityScore'),
    scoreContent: document.getElementById('scoreContent'),
    paymentModal: document.getElementById('paymentModal'),
    deliveryModal: document.getElementById('deliveryModal'),
};

// ================================================================================
// INITIALIZATION
// ================================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Creative Director LEGENDARY initializing...');

    // Set up event listeners
    setupEventListeners();

    // Check if LEGENDARY backend is available, fallback to standard if not
    const legendaryAvailable = await checkLegendaryHealth();

    if (legendaryAvailable) {
        console.log('LEGENDARY backend available, using 6-agent pipeline');
        await initLegendarySession();
    } else {
        console.log('LEGENDARY backend not available, using standard intake');
        await initStandardSession();
    }
});

function setupEventListeners() {
    // Message form submission
    elements.messageForm.addEventListener('submit', handleMessageSubmit);

    // Modal close buttons
    document.getElementById('closePaymentModal')?.addEventListener('click', () => {
        elements.paymentModal.style.display = 'none';
    });

    document.getElementById('closeDeliveryModal')?.addEventListener('click', () => {
        elements.deliveryModal.style.display = 'none';
    });

    // New project button
    document.getElementById('newProjectBtn')?.addEventListener('click', () => {
        location.reload();
    });
}

async function checkLegendaryHealth() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/legendary/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        return data.status === 'healthy' && data.legendary_enabled;
    } catch (error) {
        console.log('LEGENDARY health check failed:', error);
        return false;
    }
}

// ================================================================================
// SESSION MANAGEMENT
// ================================================================================

async function initLegendarySession() {
    try {
        updateStatus('connecting', 'Connecting...');

        const response = await fetch(`${CONFIG.API_BASE}/api/legendary/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: null }),
        });

        if (!response.ok) throw new Error('Failed to create LEGENDARY session');

        const data = await response.json();
        state.sessionId = data.session_id;
        state.phase = data.phase;

        // Update UI
        document.querySelector('.session-id').textContent = state.sessionId.slice(0, 8);
        updateStatus('active', state.phase);
        updatePipelineProgress(state.phase);

        // Show welcome message
        if (data.message) {
            hideWelcome();
            addMessage('assistant', data.message);
        }

        console.log('LEGENDARY session initialized:', state.sessionId);

    } catch (error) {
        console.error('LEGENDARY session init error:', error);
        // Fallback to standard
        await initStandardSession();
    }
}

async function initStandardSession() {
    try {
        updateStatus('connecting', 'Connecting...');

        const response = await fetch(`${CONFIG.API_BASE}/api/session/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error('Failed to create session');

        const data = await response.json();
        state.sessionId = data.session_id;
        state.phase = 'intake';

        // Update UI
        document.querySelector('.session-id').textContent = state.sessionId.slice(0, 8);
        updateStatus('active', 'intake');
        updatePipelineProgress('intake');

        // Show greeting
        if (data.greeting) {
            hideWelcome();
            addMessage('assistant', data.greeting);
        }

        console.log('Standard session initialized:', state.sessionId);

    } catch (error) {
        console.error('Session init error:', error);
        updateStatus('error', 'Connection failed');
        addSystemMessage('Failed to connect. Please refresh the page.');
    }
}

// ================================================================================
// MESSAGE HANDLING
// ================================================================================

async function handleMessageSubmit(e) {
    e.preventDefault();

    const message = elements.messageInput.value.trim();
    if (!message) return;

    await sendMessage(message);
}

async function sendMessage(message) {
    if (state.isLoading) return;

    state.isLoading = true;
    elements.sendButton.disabled = true;
    hideWelcome();

    // Add user message to chat
    addMessage('user', message);
    elements.messageInput.value = '';

    // Show typing indicator
    const typingId = addTypingIndicator();

    try {
        // Try LEGENDARY endpoint first
        let response = await fetch(`${CONFIG.API_BASE}/api/legendary/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: state.sessionId,
                message: message,
            }),
        });

        // Fallback to standard if LEGENDARY fails
        if (!response.ok) {
            response = await fetch(`${CONFIG.API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: state.sessionId,
                    message: message,
                }),
            });
        }

        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator(typingId);

        // Add assistant response
        addMessage('assistant', data.response);

        // Update state
        state.phase = data.phase;
        state.brief = data.brief || state.brief;

        // Update UI
        updateStatus('active', state.phase);
        updatePipelineProgress(state.phase);

        // Handle phase transitions
        if (data.is_complete) {
            if (state.phase === 'research' || data.phase === 'research') {
                // Brief complete, start LEGENDARY pipeline
                await runAutomatedPipeline();
            } else if (data.ragnarok_ready) {
                // Standard flow complete, show pricing
                showPricingOptions();
            }
        }

        // Update sidebar if brief available
        if (state.brief) {
            updateBriefSummary();
        }

    } catch (error) {
        console.error('Message error:', error);
        removeTypingIndicator(typingId);
        addSystemMessage('Error sending message. Please try again.');
    } finally {
        state.isLoading = false;
        elements.sendButton.disabled = false;
        elements.messageInput.focus();
    }
}

// ================================================================================
// AUTOMATED PIPELINE
// ================================================================================

async function runAutomatedPipeline() {
    showLoading('Running market research...');

    try {
        // 1. Research Phase
        updateStatus('processing', 'Researching...');
        updatePipelineProgress('research');
        addSystemMessage('Analyzing your market with Trinity AI...');

        const researchRes = await fetch(
            `${CONFIG.API_BASE}/api/legendary/research/${state.sessionId}`,
            { method: 'POST' }
        );
        const researchData = await researchRes.json();

        if (researchData.enriched_brief) {
            state.brief = researchData.enriched_brief;
            updateBriefSummary();
            showResearchInsights(researchData.enriched_brief);
        }

        // 2. Ideation Phase
        updateStatus('processing', 'Generating concepts...');
        updatePipelineProgress('ideation');
        addSystemMessage('Generating creative concepts with Graph-of-Thoughts...');
        setLoadingText('Generating creative concepts...');

        const ideationRes = await fetch(
            `${CONFIG.API_BASE}/api/legendary/ideation/${state.sessionId}?num_concepts=5`,
            { method: 'POST' }
        );
        const ideationData = await ideationRes.json();

        state.concepts = ideationData.concepts || [];
        state.phase = 'concept_selection';

        hideLoading();
        updateStatus('active', 'concept_selection');
        updatePipelineProgress('ideation');

        // Show concept cards
        addSystemMessage('Here are your creative concepts! Select one to continue:');
        renderConceptCards(state.concepts);

    } catch (error) {
        console.error('Pipeline error:', error);
        hideLoading();
        addSystemMessage('Error in pipeline. Showing pricing options...');
        showPricingOptions();
    }
}

async function continueAfterConceptSelection(conceptId) {
    state.selectedConceptId = conceptId;
    showLoading('Generating your script...');

    try {
        // Select concept
        await fetch(`${CONFIG.API_BASE}/api/legendary/select-concept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: state.sessionId,
                concept_id: conceptId,
            }),
        });

        // 3. Script Generation
        updateStatus('processing', 'Writing script...');
        updatePipelineProgress('script');
        addSystemMessage('Writing your script with Self-RAG grounding...');

        const scriptRes = await fetch(
            `${CONFIG.API_BASE}/api/legendary/script/${state.sessionId}`,
            { method: 'POST' }
        );
        const scriptData = await scriptRes.json();
        state.script = scriptData.script;

        // 4. Review Phase
        updateStatus('processing', 'Quality review...');
        updatePipelineProgress('review');
        setLoadingText('Running quality review...');

        const reviewRes = await fetch(
            `${CONFIG.API_BASE}/api/legendary/review/${state.sessionId}`,
            { method: 'POST' }
        );
        const reviewData = await reviewRes.json();
        state.qualityReport = reviewData.quality_report;

        hideLoading();

        // Show script preview
        addSystemMessage('Your script is ready for review:');
        renderScriptPreview(state.script, state.qualityReport);
        showQualityScore(state.qualityReport);

        state.phase = reviewData.approved ? 'payment' : 'revision';
        updatePipelineProgress('review');

    } catch (error) {
        console.error('Script generation error:', error);
        hideLoading();
        addSystemMessage('Error generating script. Showing pricing options...');
        showPricingOptions();
    }
}

// ================================================================================
// CONCEPT CARDS
// ================================================================================

function renderConceptCards(concepts) {
    const container = elements.generativeUI;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'concepts-grid';

    if (!concepts || concepts.length === 0) {
        // Generate mock concepts if none returned
        concepts = [
            {
                concept_id: 'concept_1',
                title: 'Problem-Solution Story',
                description: 'Open with the pain point, then reveal your product as the hero solution.',
                creative_angle: 'Storytelling',
                estimated_impact: 0.85,
                hook_suggestions: ['Show frustration first', 'Dramatic reveal', 'Happy ending']
            },
            {
                concept_id: 'concept_2',
                title: 'Social Proof Power',
                description: 'Lead with testimonials and real results to build instant credibility.',
                creative_angle: 'Trust Building',
                estimated_impact: 0.78,
                hook_suggestions: ['Real customer quote', 'Statistics highlight', 'Before/after']
            },
            {
                concept_id: 'concept_3',
                title: 'Direct Response Hook',
                description: 'Attention-grabbing opening with clear value proposition and urgent CTA.',
                creative_angle: 'Conversion Focus',
                estimated_impact: 0.82,
                hook_suggestions: ['Bold question', 'Surprising stat', 'Limited offer']
            }
        ];
    }

    concepts.forEach(concept => {
        const card = createConceptCard(concept);
        grid.appendChild(card);
    });

    container.appendChild(grid);
    container.scrollIntoView({ behavior: 'smooth' });
}

function createConceptCard(concept) {
    const card = document.createElement('div');
    card.className = 'concept-card';
    card.dataset.conceptId = concept.concept_id;

    const impactPercent = Math.round((concept.estimated_impact || 0.8) * 100);
    const hooks = concept.hook_suggestions || ['Attention-grabbing opening', 'Emotional connection'];

    card.innerHTML = `
        <div class="concept-header">
            <span class="concept-angle">${concept.creative_angle || 'Creative'}</span>
            <span class="concept-impact">Impact: ${impactPercent}%</span>
        </div>
        <h3 class="concept-title">${concept.title || 'Untitled Concept'}</h3>
        <p class="concept-description">${concept.description || 'A compelling creative approach for your video.'}</p>
        <div class="concept-hooks">
            <span class="hooks-label">Hook Ideas:</span>
            <ul class="hooks-list">
                ${hooks.slice(0, 3).map(hook => `<li>${hook}</li>`).join('')}
            </ul>
        </div>
        <button class="concept-select-btn">Select This Concept</button>
    `;

    // Select button click handler
    card.querySelector('.concept-select-btn').addEventListener('click', () => {
        // Mark as selected
        document.querySelectorAll('.concept-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Continue pipeline
        continueAfterConceptSelection(concept.concept_id);
    });

    return card;
}

// ================================================================================
// SCRIPT PREVIEW
// ================================================================================

function renderScriptPreview(script, qualityReport) {
    const container = elements.generativeUI;
    container.innerHTML = '';

    // Create mock script if none provided
    if (!script) {
        script = {
            total_duration: 30,
            scenes: [
                { type: 'hook', start_time: 0, end_time: 5, content: 'Attention-grabbing opening scene', visual_direction: 'Bold visuals, quick cuts' },
                { type: 'problem', start_time: 5, end_time: 12, content: 'Present the problem your audience faces', visual_direction: 'Relatable situation' },
                { type: 'solution', start_time: 12, end_time: 22, content: 'Show how your product/service solves the problem', visual_direction: 'Product showcase' },
                { type: 'cta', start_time: 22, end_time: 30, content: 'Clear call-to-action with urgency', visual_direction: 'Logo, contact info' }
            ],
            voiceover_text: 'Your custom voiceover script will appear here, tailored to your business and audience.'
        };
    }

    const approved = qualityReport?.approved !== false;

    const preview = document.createElement('div');
    preview.className = 'script-preview';
    preview.innerHTML = `
        <div class="script-header">
            <h3>Your Script</h3>
            <span class="script-duration">${script.total_duration || 30}s</span>
        </div>
        <div class="script-timeline">
            ${(script.scenes || []).map(scene => `
                <div class="scene-card" data-scene-type="${scene.type || 'scene'}">
                    <div class="scene-badge">${(scene.type || 'SCENE').toUpperCase()}</div>
                    <div class="scene-timing">${scene.start_time || 0}s - ${scene.end_time || 5}s</div>
                    <p class="scene-content">${scene.content || scene.description || 'Scene content'}</p>
                    ${scene.visual_direction ? `<div class="scene-visual-hint">Visual: ${scene.visual_direction}</div>` : ''}
                </div>
            `).join('')}
        </div>
        <div class="script-voiceover">
            <h4>Voiceover</h4>
            <p class="voiceover-text">${script.voiceover_text || 'Voiceover text will appear here.'}</p>
        </div>
        <div class="script-actions">
            <button class="script-btn approve" id="approveScriptBtn">${approved ? 'Approve & Continue' : 'Needs Revision'}</button>
            <button class="script-btn revise" id="reviseScriptBtn" style="${approved ? '' : 'display:none;'}">Request Revision</button>
        </div>
    `;

    container.appendChild(preview);

    // Action button handlers
    document.getElementById('approveScriptBtn').addEventListener('click', () => {
        if (approved) {
            showPricingOptions();
        }
    });

    document.getElementById('reviseScriptBtn')?.addEventListener('click', requestRevision);

    container.scrollIntoView({ behavior: 'smooth' });
}

async function requestRevision() {
    showLoading('Revising script...');
    addSystemMessage('Generating revised script...');

    try {
        // Re-run script generation
        const scriptRes = await fetch(
            `${CONFIG.API_BASE}/api/legendary/script/${state.sessionId}`,
            { method: 'POST' }
        );
        const scriptData = await scriptRes.json();
        state.script = scriptData.script;

        // Re-run review
        const reviewRes = await fetch(
            `${CONFIG.API_BASE}/api/legendary/review/${state.sessionId}`,
            { method: 'POST' }
        );
        const reviewData = await reviewRes.json();
        state.qualityReport = reviewData.quality_report;

        hideLoading();
        renderScriptPreview(state.script, state.qualityReport);
        showQualityScore(state.qualityReport);

    } catch (error) {
        console.error('Revision error:', error);
        hideLoading();
        addSystemMessage('Error revising script.');
    }
}

// ================================================================================
// PRICING OPTIONS
// ================================================================================

function showPricingOptions() {
    const container = elements.generativeUI;
    container.innerHTML = '';

    const pricingCard = document.createElement('div');
    pricingCard.className = 'script-preview';
    pricingCard.innerHTML = `
        <div class="script-header">
            <h3>Your AI Commercial Awaits</h3>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Choose your package to begin production</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div style="background: var(--bg-card); padding: 20px; border-radius: 12px; border: 2px solid var(--primary);">
                <h4 style="color: var(--primary); margin-bottom: 8px;">Standard Package</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">30-second AI commercial</p>
                <div style="font-size: 2rem; font-weight: 700; margin-bottom: 12px;">$499</div>
                <ul style="list-style: none; font-size: 0.85rem; color: var(--text-secondary);">
                    <li style="margin-bottom: 4px;">AI-generated video from your brief</li>
                    <li style="margin-bottom: 4px;">1 revision included</li>
                    <li>Delivered in 48-72 hours</li>
                </ul>
                <button class="concept-select-btn" style="margin-top: 16px;" onclick="redirectToPayment()">PURCHASE NOW</button>
            </div>

            <div style="background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--text-muted);">
                <h4 style="color: var(--accent); margin-bottom: 8px;">Premium Package</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Full campaign production</p>
                <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 12px;">Custom Quote</div>
                <ul style="list-style: none; font-size: 0.85rem; color: var(--text-secondary);">
                    <li style="margin-bottom: 4px;">Multiple video lengths & formats</li>
                    <li style="margin-bottom: 4px;">Unlimited revisions</li>
                    <li>Dedicated creative director</li>
                </ul>
                <button class="script-btn revise" style="margin-top: 16px; width: 100%;" onclick="window.open('mailto:alienation2innovation@gmail.com?subject=Premium%20Package%20Inquiry')">BOOK CONSULTATION</button>
            </div>
        </div>

        <button class="script-btn revise" style="width: 100%;" onclick="downloadBrief()">DOWNLOAD BRIEF AS PDF</button>
    `;

    container.appendChild(pricingCard);
    container.scrollIntoView({ behavior: 'smooth' });
}

function redirectToPayment() {
    // Redirect to Stripe payment link with session ID
    window.location.href = `${CONFIG.STRIPE_PAYMENT_LINK}?client_reference_id=${state.sessionId}`;
}

async function downloadBrief() {
    try {
        const res = await fetch(`${CONFIG.API_BASE}/api/ragnarok/brief/${state.sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch brief');

        const data = await res.json();
        if (!data.ready || !data.brief) {
            addSystemMessage('Brief not ready yet. Please complete all phases.');
            return;
        }

        // Generate text brief
        const brief = data.brief;
        const briefText = `
NEURAL AD FORGE - COMMERCIAL BRIEF
====================================
Generated: ${new Date().toLocaleDateString()}
Session ID: ${state.sessionId}

BUSINESS INFORMATION
--------------------
Business Name: ${brief.business?.name || 'N/A'}
Industry: ${brief.business?.industry || 'N/A'}
Offering: ${brief.business?.offering || 'N/A'}
USPs: ${(brief.business?.usps || []).join(', ') || 'N/A'}

TARGET AUDIENCE
---------------
Demographic: ${brief.audience?.demographic || 'N/A'}
Pain Points: ${(brief.audience?.pain_points || []).join(', ') || 'N/A'}
Desires: ${(brief.audience?.desires || []).join(', ') || 'N/A'}

VIDEO SPECIFICATIONS
--------------------
Goal: ${brief.video?.goal || 'N/A'}
Call-to-Action: ${brief.video?.cta || 'N/A'}
Platform: ${brief.video?.platform || 'N/A'}
Duration: ${brief.video?.duration_seconds || 30} seconds

CREATIVE DIRECTION
------------------
Mood: ${brief.creative?.mood || 'N/A'}
Tempo: ${brief.creative?.tempo || 'N/A'}
Pacing: ${brief.creative?.pacing || 'N/A'}
Music Genre: ${brief.creative?.music_genre || 'N/A'}
Voice Style: ${brief.creative?.voice_style || 'N/A'}

CONSTRAINTS
-----------
Must Include: ${(brief.constraints?.must_include || []).join(', ') || 'None'}
Must Avoid: ${(brief.constraints?.must_avoid || []).join(', ') || 'None'}

====================================
Generated by Barrios A2I - Neural Ad Forge
https://barrios-landing.vercel.app/creative-director
`;

        // Create and download file
        const blob = new Blob([briefText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `commercial-brief-${state.sessionId.slice(0, 8)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (e) {
        console.error('Download error:', e);
        addSystemMessage('Failed to download brief. Please try again.');
    }
}

// ================================================================================
// UI HELPERS
// ================================================================================

function hideWelcome() {
    if (elements.welcomeScreen) {
        elements.welcomeScreen.style.display = 'none';
    }
}

function addMessage(role, content) {
    const container = elements.messagesContainer;

    const message = document.createElement('div');
    message.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'assistant' ? '\uD83D\uDD31' : '\uD83D\uDC64';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    message.appendChild(avatar);
    message.appendChild(messageContent);
    container.appendChild(message);

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(content) {
    addMessage('assistant', content);
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const container = elements.messagesContainer;

    const indicator = document.createElement('div');
    indicator.id = id;
    indicator.className = 'message assistant';
    indicator.innerHTML = `
        <div class="message-avatar">\uD83D\uDD31</div>
        <div class="message-content" style="display: flex; gap: 4px; padding: 12px 16px;">
            <span style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: pulse 1s infinite;"></span>
            <span style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: pulse 1s infinite 0.2s;"></span>
            <span style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: pulse 1s infinite 0.4s;"></span>
        </div>
    `;

    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;

    return id;
}

function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) {
        indicator.remove();
    }
}

function updateStatus(type, text) {
    const dot = elements.statusIndicator.querySelector('.status-dot');
    const textEl = elements.statusIndicator.querySelector('.status-text');

    dot.className = 'status-dot';
    if (type === 'active') dot.classList.add('active');
    if (type === 'processing') dot.classList.add('processing');

    textEl.textContent = text.replace('_', ' ');
}

function updatePipelineProgress(currentPhase) {
    const phases = [
        'intake', 'research', 'ideation', 'script',
        'review', 'production', 'delivery'
    ];

    const currentIndex = phases.indexOf(currentPhase);

    document.querySelectorAll('.pipeline-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');

        if (index < currentIndex) {
            step.classList.add('completed');
        } else if (index === currentIndex) {
            step.classList.add('active');
        }
    });

    // Update connectors
    document.querySelectorAll('.pipeline-connector').forEach((connector, index) => {
        connector.classList.remove('completed');
        if (index < currentIndex) {
            connector.classList.add('completed');
        }
    });
}

function showLoading(text = 'Processing...') {
    elements.loadingText.textContent = text;
    elements.loadingOverlay.style.display = 'flex';
}

function setLoadingText(text) {
    elements.loadingText.textContent = text;
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

function updateBriefSummary() {
    if (!state.brief) return;

    elements.briefSummary.style.display = 'block';
    elements.briefContent.innerHTML = `
        <div><strong>Business:</strong> ${state.brief.business_name || state.brief.business?.name || '-'}</div>
        <div><strong>Industry:</strong> ${state.brief.industry || state.brief.business?.industry || '-'}</div>
        <div><strong>Platform:</strong> ${state.brief.target_platform || state.brief.video?.platform || '-'}</div>
        <div><strong>Duration:</strong> ${state.brief.video_duration || state.brief.video?.duration_seconds || 30}s</div>
        <div><strong>Tone:</strong> ${state.brief.brand_tone || state.brief.creative?.mood || '-'}</div>
    `;
}

function showResearchInsights(enrichedBrief) {
    if (!enrichedBrief || !enrichedBrief.market_intel) return;

    elements.researchInsights.style.display = 'block';
    const intel = enrichedBrief.market_intel;

    elements.insightsContent.innerHTML = `
        <div><strong>Competitors Analyzed:</strong> ${intel.competitor_ads?.length || 0}</div>
        <div><strong>Top Trend:</strong> ${intel.platform_trends?.[0] || 'N/A'}</div>
        <div><strong>Confidence:</strong> ${Math.round((enrichedBrief.confidence_score || 0.85) * 100)}%</div>
    `;
}

function showQualityScore(report) {
    if (!report) return;

    elements.qualityScore.style.display = 'block';

    const score = report.overall_score || 0.85;
    const approved = report.approved !== false;

    elements.scoreContent.innerHTML = `
        <div style="font-size: 2rem; font-weight: 700; color: ${approved ? 'var(--success)' : 'var(--warning)'};">
            ${Math.round(score * 100)}%
        </div>
        <div style="margin-top: 8px; color: ${approved ? 'var(--success)' : 'var(--warning)'};">
            ${approved ? 'Approved' : 'Needs Revision'}
        </div>
    `;
}

// ================================================================================
// EXPORTS FOR DEBUGGING
// ================================================================================

window.CreativeDirector = {
    state,
    CONFIG,
    sendMessage,
    runAutomatedPipeline,
    showPricingOptions,
    downloadBrief,
    redirectToPayment,
};

console.log('Creative Director LEGENDARY loaded');
