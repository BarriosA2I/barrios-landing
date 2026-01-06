// ============================================================================
// COMMERCIAL INTAKE FLOW - 40-Question Client Brief System
// ============================================================================
// Collects all information needed for the 23-agent RAGNAROK commercial pipeline.
// Replaces free-form chat with structured questions using buttons, text, files.
//
// Author: Barrios A2I | Version: 1.0.0 | January 2026
// ============================================================================

(function() {
    'use strict';

    // =========================================================================
    // CONFIGURATION
    // =========================================================================

    const CONFIG = {
        API_URL: 'https://barrios-api-gateway.onrender.com',
        ANIMATION_DURATION: 300,
        AUTO_ADVANCE_DELAY: 500,
        COLORS: {
            cyan: '#00CED1',
            cyanGlow: 'rgba(0, 206, 209, 0.15)',
            purple: '#8B5CF6',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            bgPrimary: '#0a0a0a',
            bgSecondary: '#141414',
            textPrimary: '#fafafa',
            textSecondary: '#a1a1aa'
        }
    };

    // =========================================================================
    // INTAKE SECTIONS & QUESTIONS (40 Total)
    // =========================================================================

    const INTAKE_SECTIONS = [
        {
            id: 'identity',
            title: 'Business Identity',
            subtitle: 'Tell us about your brand',
            icon: '🏢',
            priority: 'mandatory',
            questions: [
                {
                    id: 'businessName',
                    question: "What's the name of your business?",
                    type: 'text',
                    placeholder: 'Enter your business name',
                    required: true,
                    feedsAgents: ['THE MEMORY', 'NEXUS']
                },
                {
                    id: 'industry',
                    question: 'Which industry are you in?',
                    type: 'buttons',
                    options: [
                        { value: 'real_estate', label: 'Real Estate', icon: '🏠' },
                        { value: 'fitness', label: 'Fitness', icon: '💪' },
                        { value: 'saas', label: 'SaaS', icon: '💻' },
                        { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
                        { value: 'local_services', label: 'Local Services', icon: '🔧' },
                        { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
                        { value: 'finance', label: 'Finance', icon: '💰' },
                        { value: 'education', label: 'Education', icon: '📚' },
                        { value: 'food_beverage', label: 'Food & Beverage', icon: '🍽️' },
                        { value: 'other', label: 'Other', icon: '✨' }
                    ],
                    required: true,
                    feedsAgents: ['THE HUNTER', 'THE CURATOR', 'THE ORACLE']
                },
                {
                    id: 'location',
                    question: 'Where is your business based, and which locations do you serve?',
                    type: 'text',
                    placeholder: 'e.g., Based in Miami, serving all of Florida',
                    required: true,
                    feedsAgents: ['THE MEMORY', 'THE CHAMELEON']
                },
                {
                    id: 'businessDescription',
                    question: 'Share one or two sentences that describe what your business does.',
                    type: 'textarea',
                    placeholder: 'We help small businesses...',
                    helperText: 'This becomes the foundation of your commercial story',
                    required: true,
                    feedsAgents: ['THE MEMORY', 'THE STORYTELLER', 'NEXUS']
                }
            ]
        },
        {
            id: 'offer',
            title: 'Offer & USP',
            subtitle: 'What makes you special?',
            icon: '⭐',
            priority: 'mandatory',
            questions: [
                {
                    id: 'productService',
                    question: 'What specific product or service should this video promote?',
                    type: 'textarea',
                    placeholder: 'Describe the product or service...',
                    required: true,
                    feedsAgents: ['THE CURATOR', 'THE STORYTELLER']
                },
                {
                    id: 'uniqueDifferentiator',
                    question: 'What makes this offer different or better than competitors?',
                    type: 'textarea',
                    placeholder: 'Think pricing, quality, speed, results, convenience, guarantees...',
                    helperText: 'This is your unique selling proposition (USP)',
                    required: true,
                    feedsAgents: ['THE CURATOR', 'THE STORYTELLER', 'THE ORACLE']
                },
                {
                    id: 'keyBenefit',
                    question: 'What is the single most important benefit you want viewers to remember?',
                    type: 'text',
                    placeholder: 'e.g., Save 10 hours per week on accounting',
                    required: true,
                    feedsAgents: ['THE STORYTELLER', 'NEXUS']
                }
            ]
        },
        {
            id: 'audience',
            title: 'Target Audience',
            subtitle: 'Who are we speaking to?',
            icon: '🎯',
            priority: 'mandatory',
            questions: [
                {
                    id: 'idealCustomer',
                    question: 'Who is your ideal customer for this video?',
                    type: 'textarea',
                    placeholder: 'Age range, location, job/role, lifestyle, or niche segment...',
                    required: true,
                    feedsAgents: ['THE HUNTER', 'THE CURATOR', 'THE ORACLE']
                },
                {
                    id: 'audienceProblem',
                    question: 'What main problem, pain, or desire does this audience have that your offer solves?',
                    type: 'textarea',
                    placeholder: 'They struggle with...',
                    required: true,
                    feedsAgents: ['THE STORYTELLER', 'THE CURATOR']
                },
                {
                    id: 'brandAwareness',
                    question: 'How aware is this audience of your brand?',
                    type: 'buttons',
                    options: [
                        { value: 'never_heard', label: 'Never heard of us', icon: '🆕', description: 'Cold audience' },
                        { value: 'know_a_bit', label: 'Know us a bit', icon: '👋', description: 'Warm audience' },
                        { value: 'existing_customers', label: 'Existing customers', icon: '💎', description: 'Hot audience' }
                    ],
                    required: true,
                    feedsAgents: ['THE ORACLE', 'THE ACCOUNTANT']
                }
            ]
        },
        {
            id: 'goal',
            title: 'Campaign Goal',
            subtitle: 'What should viewers do?',
            icon: '🎬',
            priority: 'mandatory',
            questions: [
                {
                    id: 'primaryGoal',
                    question: 'What is the primary goal of this video?',
                    type: 'buttons',
                    options: [
                        { value: 'leads', label: 'Get Leads', icon: '📧' },
                        { value: 'calls', label: 'Book Calls', icon: '📞' },
                        { value: 'purchases', label: 'Drive Purchases', icon: '💳' },
                        { value: 'awareness', label: 'Brand Awareness', icon: '👁️' },
                        { value: 'app_installs', label: 'App Installs', icon: '📱' },
                        { value: 'event_signups', label: 'Event Signups', icon: '🎟️' }
                    ],
                    required: true,
                    feedsAgents: ['NEXUS', 'THE ORACLE', 'THE ACCOUNTANT']
                },
                {
                    id: 'callToAction',
                    question: 'What action do you want viewers to take right after watching?',
                    type: 'text',
                    placeholder: 'e.g., Click to book a call, Visit our website, Use promo code SAVE20',
                    required: true,
                    feedsAgents: ['NEXUS', 'THE STORYTELLER']
                },
                {
                    id: 'specificOffer',
                    question: 'Do you have a specific offer or CTA line you want included?',
                    type: 'text',
                    placeholder: 'e.g., Get 20% off this week only',
                    helperText: 'Leave blank if you want us to craft one',
                    required: false,
                    feedsAgents: ['THE STORYTELLER', 'NEXUS']
                }
            ]
        },
        {
            id: 'platform',
            title: 'Platform & Format',
            subtitle: 'Where will this run?',
            icon: '📱',
            priority: 'recommended',
            questions: [
                {
                    id: 'platforms',
                    question: 'Where will you primarily use this video?',
                    type: 'multi-select',
                    options: [
                        { value: 'tiktok', label: 'TikTok', icon: '🎵' },
                        { value: 'instagram', label: 'Instagram Reels', icon: '📸' },
                        { value: 'youtube', label: 'YouTube', icon: '▶️' },
                        { value: 'facebook', label: 'Facebook', icon: '👥' },
                        { value: 'website', label: 'Website', icon: '🌐' },
                        { value: 'other', label: 'Other', icon: '📺' }
                    ],
                    required: true,
                    feedsAgents: ['THE CHAMELEON', 'THE HUNTER', 'THE ORACLE']
                },
                {
                    id: 'aspectRatio',
                    question: 'Do you prefer vertical, square, or horizontal format?',
                    type: 'buttons',
                    options: [
                        { value: '9:16', label: 'Vertical (9:16)', icon: '📱', description: 'TikTok, Reels, Shorts' },
                        { value: '1:1', label: 'Square (1:1)', icon: '⬜', description: 'Feed posts' },
                        { value: '16:9', label: 'Horizontal (16:9)', icon: '🖥️', description: 'YouTube, Website' },
                        { value: 'auto', label: 'You decide', icon: '🤖', description: 'Best for your platforms' }
                    ],
                    required: true,
                    feedsAgents: ['THE CHAMELEON', 'VIDEO ASSEMBLER']
                },
                {
                    id: 'duration',
                    question: 'About how long should the video be?',
                    type: 'buttons',
                    options: [
                        { value: '15', label: '15 seconds', icon: '⚡', description: 'Quick hook' },
                        { value: '30', label: '30 seconds', icon: '⏱️', description: 'Standard' },
                        { value: '60', label: '60 seconds', icon: '🎬', description: 'Full story' },
                        { value: 'auto', label: 'Best practices', icon: '🤖', description: "We'll optimize" }
                    ],
                    required: true,
                    feedsAgents: ['THE ACCOUNTANT', 'THE CHAMELEON', 'VIDEO ASSEMBLER']
                }
            ]
        },
        {
            id: 'voice',
            title: 'Brand Voice',
            subtitle: 'How should it feel?',
            icon: '🎭',
            priority: 'recommended',
            questions: [
                {
                    id: 'videoTone',
                    question: 'How should this video feel?',
                    type: 'multi-select',
                    options: [
                        { value: 'high_energy', label: 'High-energy', icon: '⚡' },
                        { value: 'emotional', label: 'Emotional', icon: '💝' },
                        { value: 'professional', label: 'Professional', icon: '👔' },
                        { value: 'funny', label: 'Funny', icon: '😄' },
                        { value: 'luxury', label: 'Luxury / Premium', icon: '✨' },
                        { value: 'casual', label: 'Casual / Friendly', icon: '😊' }
                    ],
                    required: true,
                    feedsAgents: ['THE STORYTELLER', 'THE ORACLE', 'VOICE DIRECTOR']
                },
                {
                    id: 'brandVoice',
                    question: "Describe your brand's voice in a few words.",
                    type: 'text',
                    placeholder: 'e.g., Bold and confident, Warm and trustworthy, Playful and witty',
                    required: true,
                    feedsAgents: ['THE STORYTELLER', 'THE MEMORY']
                },
                {
                    id: 'styleReferences',
                    question: 'Are there any brands or ads whose style you like that we should loosely reference?',
                    type: 'textarea',
                    placeholder: "e.g., Apple's minimalism, Nike's inspiration, Dollar Shave Club's humor",
                    required: false,
                    feedsAgents: ['THE MEMORY', 'THE CURATOR', 'THE ORACLE']
                },
                {
                    id: 'avoidWords',
                    question: 'Are there any words, phrases, or topics we must avoid?',
                    type: 'textarea',
                    placeholder: "e.g., Don't say \"cheap\", avoid mentioning competitors by name",
                    required: false,
                    feedsAgents: ['THE STORYTELLER', 'NEXUS']
                }
            ]
        },
        {
            id: 'visuals',
            title: 'Visual Assets',
            subtitle: 'Brand elements & style',
            icon: '🎨',
            priority: 'recommended',
            questions: [
                {
                    id: 'hasLogo',
                    question: 'Do you have a logo or brand assets you want included?',
                    type: 'buttons',
                    options: [
                        { value: 'upload', label: "Yes, I'll upload", icon: '📤' },
                        { value: 'text_logo', label: 'Use text logo', icon: '✍️' },
                        { value: 'none', label: 'No logo needed', icon: '➖' }
                    ],
                    required: true,
                    feedsAgents: ['VIDEO ASSEMBLER', 'THE CHAMELEON']
                },
                {
                    id: 'brandColors',
                    question: 'Do you have specific brand colors or fonts?',
                    type: 'text',
                    placeholder: 'e.g., #FF5733 (orange), #333333 (dark gray), Montserrat font',
                    helperText: 'Share hex codes or describe colors',
                    required: false,
                    feedsAgents: ['VISUAL PROMPTER', 'VIDEO ASSEMBLER']
                },
                {
                    id: 'visualStyle',
                    question: 'Should the video feel more like real footage, animated, or a mix?',
                    type: 'buttons',
                    options: [
                        { value: 'realistic', label: 'Realistic / Live-action', icon: '📹' },
                        { value: 'animated', label: 'Animated / Illustrated', icon: '🎨' },
                        { value: 'mixed', label: 'Mix of both', icon: '🎭' },
                        { value: 'auto', label: 'You decide', icon: '🤖' }
                    ],
                    required: true,
                    feedsAgents: ['VISUAL PROMPTER', 'THE CURATOR']
                },
                {
                    id: 'specificVisuals',
                    question: 'Any specific visuals you definitely want to see?',
                    type: 'textarea',
                    placeholder: 'e.g., Busy professionals at desks, before/after transformation, product close-ups',
                    required: false,
                    feedsAgents: ['VISUAL PROMPTER', 'THE STORYTELLER']
                }
            ]
        },
        {
            id: 'audio',
            title: 'Voiceover & Music',
            subtitle: 'Sound design preferences',
            icon: '🎵',
            priority: 'recommended',
            questions: [
                {
                    id: 'wantsVoiceover',
                    question: 'Do you want a voiceover in this video?',
                    type: 'buttons',
                    options: [
                        { value: 'yes', label: 'Yes', icon: '🎙️' },
                        { value: 'no', label: 'No - text on screen only', icon: '📝' }
                    ],
                    required: true,
                    feedsAgents: ['VOICE DIRECTOR', 'THE ACCOUNTANT']
                },
                {
                    id: 'voiceStyle',
                    question: 'If yes, what style of voice fits best?',
                    type: 'buttons',
                    options: [
                        { value: 'male', label: 'Male', icon: '👨' },
                        { value: 'female', label: 'Female', icon: '👩' },
                        { value: 'either', label: 'Either', icon: '🧑' },
                        { value: 'ai_neutral', label: 'Brand-neutral AI', icon: '🤖' }
                    ],
                    required: false,
                    feedsAgents: ['VOICE DIRECTOR'],
                    showIf: { questionId: 'wantsVoiceover', value: 'yes' }
                },
                {
                    id: 'language',
                    question: 'What language (and accent, if important) should this video use?',
                    type: 'text',
                    placeholder: 'e.g., English (American), Spanish (Latin American), French',
                    required: true,
                    feedsAgents: ['VOICE DIRECTOR', 'THE CHAMELEON']
                },
                {
                    id: 'musicPreference',
                    question: 'Any music preferences?',
                    type: 'text',
                    placeholder: 'e.g., Upbeat electronic, corporate background, no music',
                    required: false,
                    feedsAgents: ['MUSIC SELECTOR', 'VIDEO ASSEMBLER']
                }
            ]
        },
        {
            id: 'constraints',
            title: 'Constraints & Budget',
            subtitle: 'Guardrails & compliance',
            icon: '⚠️',
            priority: 'optional',
            questions: [
                {
                    id: 'mustNotInclude',
                    question: 'Is there anything that absolutely must NOT appear in the video?',
                    type: 'textarea',
                    placeholder: 'Topics, imagery, claims, competitors, etc.',
                    required: false,
                    feedsAgents: ['ALL AGENTS']
                },
                {
                    id: 'disclaimers',
                    question: 'Are there compliance or disclaimer lines we must include?',
                    type: 'textarea',
                    placeholder: 'e.g., "Results may vary", "Not financial advice", FDA disclaimers',
                    required: false,
                    feedsAgents: ['THE STORYTELLER', 'QUALITY ASSURANCE']
                },
                {
                    id: 'budgetRange',
                    question: 'Do you have a rough budget range for promoting this video?',
                    type: 'buttons',
                    options: [
                        { value: 'testing', label: 'Testing: <$500', icon: '🧪', description: 'Low-key CTA' },
                        { value: 'growing', label: 'Growing: $500-$5K', icon: '📈', description: 'Standard CTA' },
                        { value: 'scaling', label: 'Scaling: $5K+', icon: '🚀', description: 'Aggressive CTA' },
                        { value: 'unsure', label: 'Not sure yet', icon: '🤔' }
                    ],
                    helperText: 'Helps us match aggression level of CTA',
                    required: true,
                    feedsAgents: ['THE ACCOUNTANT', 'THE ORACLE', 'THE STORYTELLER']
                }
            ]
        },
        {
            id: 'quality',
            title: 'Quality Preferences',
            subtitle: 'Speed vs. polish tradeoffs',
            icon: '✨',
            priority: 'optional',
            questions: [
                {
                    id: 'polishLevel',
                    question: 'On a scale of 1-10, how polished do you want this to feel?',
                    type: 'buttons',
                    options: [
                        { value: '6', label: '6 - Fast & Scrappy', icon: '⚡', description: 'Good enough, ship fast' },
                        { value: '8', label: '8 - Solid & Professional', icon: '👔', description: 'High quality standard' },
                        { value: '10', label: '10 - Premium', icon: '👑', description: 'As polished as possible' }
                    ],
                    required: true,
                    feedsAgents: ['THE ACCOUNTANT', 'QUALITY ASSURANCE', 'THE AUTEUR']
                },
                {
                    id: 'priorityPreference',
                    question: 'What matters more: speed or perfection?',
                    type: 'buttons',
                    options: [
                        { value: 'speed', label: 'Speed', icon: '🏃', description: 'Get a good draft fast' },
                        { value: 'balance', label: 'Balance both', icon: '⚖️' },
                        { value: 'quality', label: 'Quality', icon: '💎', description: "I'm okay waiting longer" }
                    ],
                    required: true,
                    feedsAgents: ['NEXUS', 'THE ACCOUNTANT']
                },
                {
                    id: 'revisionPriority',
                    question: "If you don't love the first version, how should we prioritize revisions?",
                    type: 'buttons',
                    options: [
                        { value: 'script', label: 'Script first', icon: '📝' },
                        { value: 'visuals', label: 'Visuals first', icon: '🎨' },
                        { value: 'audio', label: 'Music/voice first', icon: '🎵' }
                    ],
                    required: true,
                    feedsAgents: ['THE GENETICIST', 'FEEDBACK LOOP']
                }
            ]
        },
        {
            id: 'confirmation',
            title: 'Confirm Brief',
            subtitle: 'Review before we create',
            icon: '✅',
            priority: 'mandatory',
            questions: [
                {
                    id: 'briefConfirmation',
                    question: "Here's the brief I'll use for your commercial. Does everything look correct?",
                    type: 'confirmation',
                    options: [
                        { value: 'confirmed', label: 'Looks good - start generating!', icon: '🚀' },
                        { value: 'edit', label: 'I want to make changes', icon: '✏️' }
                    ],
                    required: true,
                    feedsAgents: ['NEXUS']
                }
            ]
        }
    ];

    // =========================================================================
    // INTAKE STATE
    // =========================================================================

    let intakeState = {
        currentSectionIndex: 0,
        currentQuestionIndex: 0,
        answers: {},
        sessionId: null,
        isActive: false,
        isSubmitting: false,
        startTime: null
    };

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    function generateSessionId() {
        return 'intake_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function getCurrentSection() {
        return INTAKE_SECTIONS[intakeState.currentSectionIndex];
    }

    function getCurrentQuestion() {
        const section = getCurrentSection();
        if (!section) return null;
        return section.questions[intakeState.currentQuestionIndex];
    }

    function getTotalQuestions() {
        return INTAKE_SECTIONS.reduce((sum, section) => sum + section.questions.length, 0);
    }

    function getAnsweredCount() {
        return Object.keys(intakeState.answers).filter(key => {
            const value = intakeState.answers[key];
            if (Array.isArray(value)) return value.length > 0;
            return value !== null && value !== undefined && value !== '';
        }).length;
    }

    function getProgress() {
        let total = 0;
        let answered = 0;

        INTAKE_SECTIONS.forEach(section => {
            section.questions.forEach(q => {
                if (shouldShowQuestion(q)) {
                    total++;
                    if (intakeState.answers[q.id]) {
                        answered++;
                    }
                }
            });
        });

        return total > 0 ? (answered / total) * 100 : 0;
    }

    function shouldShowQuestion(question) {
        if (!question.showIf) return true;
        const dependentAnswer = intakeState.answers[question.showIf.questionId];
        return dependentAnswer === question.showIf.value;
    }

    function getMissingRequiredFields() {
        const missing = [];
        INTAKE_SECTIONS.forEach(section => {
            section.questions.forEach(q => {
                if (q.required && shouldShowQuestion(q) && !intakeState.answers[q.id]) {
                    missing.push(q.id);
                }
            });
        });
        return missing;
    }

    // =========================================================================
    // UI RENDERING
    // =========================================================================

    function renderIntakeUI() {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;

        const question = getCurrentQuestion();
        const section = getCurrentSection();

        if (!question || !section) {
            // All questions answered, show summary
            renderBriefSummary();
            return;
        }

        // Skip question if condition not met
        if (!shouldShowQuestion(question)) {
            moveToNextQuestion();
            return;
        }

        const html = `
            <div class="intake-question-container" data-question-id="${question.id}" style="animation: fadeSlideIn 0.3s ease-out;">
                <!-- Progress Bar -->
                <div class="intake-progress-bar" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 11px; color: ${CONFIG.COLORS.textSecondary}; font-family: 'JetBrains Mono', monospace;">
                            ${section.icon} ${section.title}
                        </span>
                        <span style="font-size: 11px; color: ${CONFIG.COLORS.cyan}; font-family: 'JetBrains Mono', monospace;">
                            ${Math.round(getProgress())}% complete
                        </span>
                    </div>
                    <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                        <div style="height: 100%; width: ${getProgress()}%; background: linear-gradient(90deg, ${CONFIG.COLORS.cyan}, ${CONFIG.COLORS.purple}); transition: width 0.3s ease;"></div>
                    </div>
                </div>

                <!-- Question Card -->
                <div class="intake-question-card" style="
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 20px;
                    backdrop-filter: blur(10px);
                ">
                    <div style="font-size: 15px; color: ${CONFIG.COLORS.textPrimary}; margin-bottom: 16px; line-height: 1.5;">
                        ${question.question}
                        ${question.required ? '<span style="color: ' + CONFIG.COLORS.error + '; margin-left: 4px;">*</span>' : ''}
                    </div>

                    ${question.helperText ? `
                        <div style="font-size: 12px; color: ${CONFIG.COLORS.textSecondary}; margin-bottom: 16px; opacity: 0.7;">
                            ${question.helperText}
                        </div>
                    ` : ''}

                    ${renderQuestionInput(question)}
                </div>

                <!-- Navigation -->
                <div style="display: flex; justify-content: space-between; margin-top: 16px;">
                    <button onclick="window.CommercialIntake.goBack()" style="
                        padding: 10px 20px;
                        background: transparent;
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 8px;
                        color: ${CONFIG.COLORS.textSecondary};
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s;
                        ${intakeState.currentSectionIndex === 0 && intakeState.currentQuestionIndex === 0 ? 'opacity: 0.3; pointer-events: none;' : ''}
                    " onmouseover="this.style.borderColor='${CONFIG.COLORS.cyan}'; this.style.color='${CONFIG.COLORS.textPrimary}';" onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='${CONFIG.COLORS.textSecondary}';">
                        ← Back
                    </button>

                    ${question.type !== 'buttons' && question.type !== 'multi-select' && question.type !== 'confirmation' ? `
                        <button onclick="window.CommercialIntake.submitCurrentAnswer()" style="
                            padding: 10px 24px;
                            background: linear-gradient(135deg, ${CONFIG.COLORS.cyan}, ${CONFIG.COLORS.purple});
                            border: none;
                            border-radius: 8px;
                            color: #000;
                            font-size: 13px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                        " onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 0 20px ${CONFIG.COLORS.cyanGlow}';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
                            Continue →
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Append to chat container
        const existingIntake = chatContainer.querySelector('.intake-question-container');
        if (existingIntake) {
            existingIntake.remove();
        }
        chatContainer.insertAdjacentHTML('beforeend', html);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function renderQuestionInput(question) {
        switch (question.type) {
            case 'text':
                return `
                    <input type="text" id="intake-input-${question.id}"
                        placeholder="${question.placeholder || ''}"
                        value="${intakeState.answers[question.id] || ''}"
                        style="
                            width: 100%;
                            padding: 14px 16px;
                            background: rgba(0,0,0,0.4);
                            border: 1px solid rgba(255,255,255,0.1);
                            border-radius: 8px;
                            color: ${CONFIG.COLORS.textPrimary};
                            font-size: 14px;
                            outline: none;
                            transition: border-color 0.2s;
                        "
                        onfocus="this.style.borderColor='${CONFIG.COLORS.cyan}'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
                        onkeypress="if(event.key==='Enter') window.CommercialIntake.submitCurrentAnswer()"
                    />
                `;

            case 'textarea':
                return `
                    <textarea id="intake-input-${question.id}"
                        placeholder="${question.placeholder || ''}"
                        rows="3"
                        style="
                            width: 100%;
                            padding: 14px 16px;
                            background: rgba(0,0,0,0.4);
                            border: 1px solid rgba(255,255,255,0.1);
                            border-radius: 8px;
                            color: ${CONFIG.COLORS.textPrimary};
                            font-size: 14px;
                            outline: none;
                            resize: vertical;
                            transition: border-color 0.2s;
                            font-family: inherit;
                        "
                        onfocus="this.style.borderColor='${CONFIG.COLORS.cyan}'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
                    >${intakeState.answers[question.id] || ''}</textarea>
                `;

            case 'buttons':
                return `
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${question.options.map(opt => `
                            <button onclick="window.CommercialIntake.selectOption('${question.id}', '${opt.value}')"
                                class="intake-option-btn ${intakeState.answers[question.id] === opt.value ? 'selected' : ''}"
                                style="
                                    flex: 1 1 calc(33% - 10px);
                                    min-width: 120px;
                                    padding: 12px 16px;
                                    background: ${intakeState.answers[question.id] === opt.value ? 'rgba(0, 206, 209, 0.15)' : 'rgba(255,255,255,0.03)'};
                                    border: 1px solid ${intakeState.answers[question.id] === opt.value ? CONFIG.COLORS.cyan : 'rgba(255,255,255,0.1)'};
                                    border-radius: 8px;
                                    color: ${intakeState.answers[question.id] === opt.value ? CONFIG.COLORS.cyan : CONFIG.COLORS.textPrimary};
                                    font-size: 13px;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    text-align: center;
                                "
                                onmouseover="if(!this.classList.contains('selected')) { this.style.borderColor='${CONFIG.COLORS.cyan}'; this.style.background='rgba(0, 206, 209, 0.08)'; }"
                                onmouseout="if(!this.classList.contains('selected')) { this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.03)'; }"
                            >
                                <div style="font-size: 18px; margin-bottom: 4px;">${opt.icon || ''}</div>
                                <div style="font-weight: 500;">${opt.label}</div>
                                ${opt.description ? `<div style="font-size: 10px; opacity: 0.6; margin-top: 4px;">${opt.description}</div>` : ''}
                            </button>
                        `).join('')}
                    </div>
                `;

            case 'multi-select':
                const selectedValues = intakeState.answers[question.id] || [];
                return `
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
                        ${question.options.map(opt => `
                            <button onclick="window.CommercialIntake.toggleMultiSelect('${question.id}', '${opt.value}')"
                                class="intake-option-btn ${selectedValues.includes(opt.value) ? 'selected' : ''}"
                                style="
                                    flex: 1 1 calc(33% - 10px);
                                    min-width: 100px;
                                    padding: 12px 16px;
                                    background: ${selectedValues.includes(opt.value) ? 'rgba(0, 206, 209, 0.15)' : 'rgba(255,255,255,0.03)'};
                                    border: 1px solid ${selectedValues.includes(opt.value) ? CONFIG.COLORS.cyan : 'rgba(255,255,255,0.1)'};
                                    border-radius: 8px;
                                    color: ${selectedValues.includes(opt.value) ? CONFIG.COLORS.cyan : CONFIG.COLORS.textPrimary};
                                    font-size: 13px;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    text-align: center;
                                "
                            >
                                <div style="font-size: 18px; margin-bottom: 4px;">${opt.icon || ''}</div>
                                <div style="font-weight: 500;">${opt.label}</div>
                            </button>
                        `).join('')}
                    </div>
                    <button onclick="window.CommercialIntake.submitMultiSelect('${question.id}')" style="
                        width: 100%;
                        padding: 12px 24px;
                        background: linear-gradient(135deg, ${CONFIG.COLORS.cyan}, ${CONFIG.COLORS.purple});
                        border: none;
                        border-radius: 8px;
                        color: #000;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        Continue with ${selectedValues.length || 0} selected →
                    </button>
                `;

            case 'confirmation':
                return `
                    <div style="margin-bottom: 20px;">
                        ${renderBriefPreview()}
                    </div>
                    <div style="display: flex; gap: 12px;">
                        ${question.options.map(opt => `
                            <button onclick="window.CommercialIntake.handleConfirmation('${opt.value}')" style="
                                flex: 1;
                                padding: 14px 20px;
                                background: ${opt.value === 'confirmed' ? 'linear-gradient(135deg, ' + CONFIG.COLORS.cyan + ', ' + CONFIG.COLORS.purple + ')' : 'transparent'};
                                border: 1px solid ${opt.value === 'confirmed' ? 'transparent' : 'rgba(255,255,255,0.2)'};
                                border-radius: 8px;
                                color: ${opt.value === 'confirmed' ? '#000' : CONFIG.COLORS.textPrimary};
                                font-size: 14px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                ${opt.icon} ${opt.label}
                            </button>
                        `).join('')}
                    </div>
                `;

            default:
                return '';
        }
    }

    function renderBriefPreview() {
        const a = intakeState.answers;

        const getSectionSummary = (sectionId, fields) => {
            const items = fields.map(f => {
                const val = a[f.key];
                if (!val) return null;
                const displayVal = Array.isArray(val) ? val.join(', ') : val;
                return `<div style="margin-bottom: 4px;"><span style="color: ${CONFIG.COLORS.textSecondary};">${f.label}:</span> ${displayVal}</div>`;
            }).filter(Boolean).join('');

            return items || '<span style="opacity: 0.4;">Not provided</span>';
        };

        return `
            <div style="
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 16px;
                font-size: 12px;
                line-height: 1.6;
                max-height: 300px;
                overflow-y: auto;
            ">
                <div style="margin-bottom: 12px;">
                    <div style="color: ${CONFIG.COLORS.cyan}; font-weight: 600; margin-bottom: 6px;">🏢 Business</div>
                    ${getSectionSummary('identity', [
                        { key: 'businessName', label: 'Name' },
                        { key: 'industry', label: 'Industry' },
                        { key: 'location', label: 'Location' }
                    ])}
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="color: ${CONFIG.COLORS.cyan}; font-weight: 600; margin-bottom: 6px;">⭐ Offer</div>
                    ${getSectionSummary('offer', [
                        { key: 'productService', label: 'Product/Service' },
                        { key: 'keyBenefit', label: 'Key Benefit' }
                    ])}
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="color: ${CONFIG.COLORS.cyan}; font-weight: 600; margin-bottom: 6px;">🎯 Audience</div>
                    ${getSectionSummary('audience', [
                        { key: 'idealCustomer', label: 'Ideal Customer' },
                        { key: 'brandAwareness', label: 'Awareness Level' }
                    ])}
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="color: ${CONFIG.COLORS.cyan}; font-weight: 600; margin-bottom: 6px;">🎬 Campaign</div>
                    ${getSectionSummary('goal', [
                        { key: 'primaryGoal', label: 'Goal' },
                        { key: 'callToAction', label: 'CTA' },
                        { key: 'platforms', label: 'Platforms' }
                    ])}
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="color: ${CONFIG.COLORS.cyan}; font-weight: 600; margin-bottom: 6px;">🎭 Style</div>
                    ${getSectionSummary('voice', [
                        { key: 'videoTone', label: 'Tone' },
                        { key: 'visualStyle', label: 'Visual Style' },
                        { key: 'duration', label: 'Duration' }
                    ])}
                </div>
            </div>
        `;
    }

    function renderBriefSummary() {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;

        const html = `
            <div class="intake-summary" style="animation: fadeSlideIn 0.3s ease-out;">
                <div style="
                    background: linear-gradient(135deg, rgba(0, 206, 209, 0.1), rgba(139, 92, 246, 0.1));
                    border: 1px solid ${CONFIG.COLORS.cyan};
                    border-radius: 12px;
                    padding: 24px;
                    text-align: center;
                ">
                    <div style="font-size: 48px; margin-bottom: 16px;">🎬</div>
                    <div style="font-size: 20px; font-weight: 600; color: ${CONFIG.COLORS.textPrimary}; margin-bottom: 8px;">
                        Brief Complete!
                    </div>
                    <div style="font-size: 14px; color: ${CONFIG.COLORS.textSecondary}; margin-bottom: 20px;">
                        Your commercial brief has been captured. Ready to start production?
                    </div>

                    ${renderBriefPreview()}

                    <div style="margin-top: 20px; display: flex; gap: 12px; justify-content: center;">
                        <button onclick="window.CommercialIntake.editBrief()" style="
                            padding: 12px 24px;
                            background: transparent;
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 8px;
                            color: ${CONFIG.COLORS.textPrimary};
                            font-size: 14px;
                            cursor: pointer;
                        ">
                            ✏️ Edit Brief
                        </button>
                        <button onclick="window.CommercialIntake.submitBrief()" style="
                            padding: 12px 32px;
                            background: linear-gradient(135deg, ${CONFIG.COLORS.cyan}, ${CONFIG.COLORS.purple});
                            border: none;
                            border-radius: 8px;
                            color: #000;
                            font-size: 14px;
                            font-weight: 600;
                            cursor: pointer;
                        ">
                            🚀 Start Production
                        </button>
                    </div>
                </div>
            </div>
        `;

        const existingIntake = chatContainer.querySelector('.intake-question-container, .intake-summary');
        if (existingIntake) {
            existingIntake.remove();
        }
        chatContainer.insertAdjacentHTML('beforeend', html);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // =========================================================================
    // NAVIGATION & ACTIONS
    // =========================================================================

    function moveToNextQuestion() {
        const currentSection = getCurrentSection();

        if (intakeState.currentQuestionIndex < currentSection.questions.length - 1) {
            intakeState.currentQuestionIndex++;
        } else if (intakeState.currentSectionIndex < INTAKE_SECTIONS.length - 1) {
            intakeState.currentSectionIndex++;
            intakeState.currentQuestionIndex = 0;
        } else {
            // All done - will show summary
            intakeState.currentSectionIndex = INTAKE_SECTIONS.length;
        }

        renderIntakeUI();
    }

    function moveToPreviousQuestion() {
        if (intakeState.currentQuestionIndex > 0) {
            intakeState.currentQuestionIndex--;
        } else if (intakeState.currentSectionIndex > 0) {
            intakeState.currentSectionIndex--;
            const prevSection = INTAKE_SECTIONS[intakeState.currentSectionIndex];
            intakeState.currentQuestionIndex = prevSection.questions.length - 1;
        }

        renderIntakeUI();
    }

    function selectOption(questionId, value) {
        intakeState.answers[questionId] = value;

        // Auto-advance after selection
        setTimeout(() => {
            moveToNextQuestion();
        }, CONFIG.AUTO_ADVANCE_DELAY);
    }

    function toggleMultiSelect(questionId, value) {
        if (!intakeState.answers[questionId]) {
            intakeState.answers[questionId] = [];
        }

        const arr = intakeState.answers[questionId];
        const index = arr.indexOf(value);

        if (index === -1) {
            arr.push(value);
        } else {
            arr.splice(index, 1);
        }

        // Re-render to update button states
        renderIntakeUI();
    }

    function submitMultiSelect(questionId) {
        const values = intakeState.answers[questionId] || [];
        if (values.length === 0) {
            // Show error for required fields
            const question = getCurrentQuestion();
            if (question && question.required) {
                showIntakeError('Please select at least one option');
                return;
            }
        }
        moveToNextQuestion();
    }

    function submitCurrentAnswer() {
        const question = getCurrentQuestion();
        if (!question) return;

        const input = document.getElementById(`intake-input-${question.id}`);
        if (!input) return;

        const value = input.value.trim();

        if (question.required && !value) {
            showIntakeError('This field is required');
            return;
        }

        intakeState.answers[question.id] = value;
        moveToNextQuestion();
    }

    function handleConfirmation(value) {
        if (value === 'confirmed') {
            submitBrief();
        } else {
            // Go back to first section
            intakeState.currentSectionIndex = 0;
            intakeState.currentQuestionIndex = 0;
            renderIntakeUI();
        }
    }

    function editBrief() {
        intakeState.currentSectionIndex = 0;
        intakeState.currentQuestionIndex = 0;
        renderIntakeUI();
    }

    async function submitBrief() {
        if (intakeState.isSubmitting) return;

        intakeState.isSubmitting = true;

        // Show loading state
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            const loadingHtml = `
                <div class="intake-loading" style="
                    text-align: center;
                    padding: 40px;
                    animation: fadeSlideIn 0.3s ease-out;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border: 3px solid rgba(0, 206, 209, 0.2);
                        border-top-color: ${CONFIG.COLORS.cyan};
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        animation: spin 1s linear infinite;
                    "></div>
                    <div style="font-size: 16px; color: ${CONFIG.COLORS.textPrimary}; margin-bottom: 8px;">
                        Initializing 23-Agent Pipeline...
                    </div>
                    <div style="font-size: 12px; color: ${CONFIG.COLORS.textSecondary};">
                        Your commercial is being prepared
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            `;

            const existing = chatContainer.querySelector('.intake-summary, .intake-question-container');
            if (existing) existing.remove();
            chatContainer.insertAdjacentHTML('beforeend', loadingHtml);
        }

        try {
            // Prepare the brief data
            const briefData = {
                session_id: intakeState.sessionId,
                brief: intakeState.answers,
                completed_at: Date.now(),
                duration_seconds: Math.round((Date.now() - intakeState.startTime) / 1000)
            };

            // Submit to API
            const response = await fetch(`${CONFIG.API_URL}/api/legendary/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(briefData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit brief');
            }

            const result = await response.json();

            // Show success and transition to pipeline view
            showPipelineStarted(result);

        } catch (error) {
            console.error('Brief submission error:', error);
            showIntakeError('Failed to start production. Please try again.');
            intakeState.isSubmitting = false;
            renderBriefSummary();
        }
    }

    function showPipelineStarted(result) {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;

        const loading = chatContainer.querySelector('.intake-loading');
        if (loading) loading.remove();

        const html = `
            <div class="pipeline-started" style="
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 206, 209, 0.1));
                border: 1px solid ${CONFIG.COLORS.success};
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                animation: fadeSlideIn 0.3s ease-out;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                <div style="font-size: 20px; font-weight: 600; color: ${CONFIG.COLORS.success}; margin-bottom: 8px;">
                    Pipeline Activated!
                </div>
                <div style="font-size: 14px; color: ${CONFIG.COLORS.textSecondary}; margin-bottom: 16px;">
                    Your 23-agent commercial production has begun.
                </div>
                <div style="font-size: 12px; color: ${CONFIG.COLORS.textSecondary}; font-family: 'JetBrains Mono', monospace;">
                    Session: ${intakeState.sessionId}
                </div>
            </div>
        `;

        chatContainer.insertAdjacentHTML('beforeend', html);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Reset intake state
        intakeState.isActive = false;
        intakeState.isSubmitting = false;
    }

    function showIntakeError(message) {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'intake-error';
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid ${CONFIG.COLORS.error};
            border-radius: 8px;
            padding: 12px 16px;
            margin-top: 12px;
            font-size: 13px;
            color: ${CONFIG.COLORS.error};
            animation: fadeSlideIn 0.2s ease-out;
        `;
        errorDiv.textContent = message;

        // Remove existing error
        const existing = chatContainer.querySelector('.intake-error');
        if (existing) existing.remove();

        const questionCard = chatContainer.querySelector('.intake-question-card');
        if (questionCard) {
            questionCard.appendChild(errorDiv);
        }

        // Auto-remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    function startIntake() {
        intakeState = {
            currentSectionIndex: 0,
            currentQuestionIndex: 0,
            answers: {},
            sessionId: generateSessionId(),
            isActive: true,
            isSubmitting: false,
            startTime: Date.now()
        };

        // Add welcome message
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            // Clear existing messages
            chatContainer.innerHTML = '';

            const welcomeHtml = `
                <div class="ai-message" style="
                    background: rgba(0, 206, 209, 0.05);
                    border: 1px solid rgba(0, 206, 209, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 16px;
                    animation: fadeSlideIn 0.3s ease-out;
                ">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <div style="
                            width: 32px;
                            height: 32px;
                            background: linear-gradient(135deg, ${CONFIG.COLORS.cyan}, ${CONFIG.COLORS.purple});
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                        ">🎬</div>
                        <span style="font-weight: 600; color: ${CONFIG.COLORS.cyan};">A2I Creative Director</span>
                    </div>
                    <div style="font-size: 14px; color: ${CONFIG.COLORS.textPrimary}; line-height: 1.6;">
                        Welcome to the A2I Commercial Lab! I'll guide you through creating your commercial brief in about 5 minutes.
                        <br><br>
                        Let's build something amazing together. 🚀
                    </div>
                </div>
            `;
            chatContainer.insertAdjacentHTML('beforeend', welcomeHtml);
        }

        // Start with first question
        renderIntakeUI();
    }

    function isIntakeActive() {
        return intakeState.isActive;
    }

    function getIntakeState() {
        return { ...intakeState };
    }

    function getBrief() {
        return { ...intakeState.answers };
    }

    // =========================================================================
    // EXPOSE PUBLIC API
    // =========================================================================

    window.CommercialIntake = {
        start: startIntake,
        isActive: isIntakeActive,
        getState: getIntakeState,
        getBrief: getBrief,
        goBack: moveToPreviousQuestion,
        selectOption: selectOption,
        toggleMultiSelect: toggleMultiSelect,
        submitMultiSelect: submitMultiSelect,
        submitCurrentAnswer: submitCurrentAnswer,
        handleConfirmation: handleConfirmation,
        editBrief: editBrief,
        submitBrief: submitBrief,

        // Constants
        SECTIONS: INTAKE_SECTIONS,
        CONFIG: CONFIG
    };

    console.log('[CommercialIntake] Module loaded. 40 questions across 11 sections ready.');

})();
