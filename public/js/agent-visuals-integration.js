/**
 * ================================================================================
 * AGENT VISUALS INTEGRATION v1.0
 * ================================================================================
 * Standalone React integration for Agent Micro-Visualizations
 * Uses esm.sh for React/framer-motion imports - no build step required
 *
 * Hooks into nexus_sse_client.js events to display:
 * - Agent-specific visualizations during production
 * - ExplainModeStrip privacy/trust messaging
 *
 * Author: Barrios A2I | NEXUS-RAGNAROK v4.0 | January 2026
 * ================================================================================
 */

(async function() {
    'use strict';

    // =============================================================================
    // DYNAMIC ESM IMPORTS
    // =============================================================================

    const React = await import('https://esm.sh/react@18.2.0');
    const ReactDOM = await import('https://esm.sh/react-dom@18.2.0/client');
    const { motion, AnimatePresence } = await import('https://esm.sh/framer-motion@11.0.0');

    const { createElement: h, useState, useEffect, useRef } = React;

    // =============================================================================
    // CONFIGURATION
    // =============================================================================

    const AGENT_CONFIG = {
        1: { name: 'Commercial Curator', color: '#00CED1', icon: '🎯' },
        2: { name: 'Scripter', color: '#10B981', icon: '📝' },
        3: { name: 'Prompt Engineer', color: '#8B5CF6', icon: '🔮' },
        4: { name: 'Sound Designer', color: '#F59E0B', icon: '🎵' },
        5: { name: 'Video Assembler', color: '#EC4899', icon: '🎬' },
        6: { name: 'QA Validator', color: '#06B6D4', icon: '✅' },
        7: { name: 'Delivery Agent', color: '#84CC16', icon: '📦' },
    };

    // Map NEXUS phases to agent IDs
    const PHASE_TO_AGENT = {
        'initialization': 1,
        'neural_rag': 1,
        'trinity': 2,
        'script': 3,
        'ragnarok': 5,
        'complete': 7,
    };

    // =============================================================================
    // AGENT VISUALIZATIONS (Simplified for vanilla JS)
    // =============================================================================

    // Scripter Visual - Typewriter Effect
    function ScripterVisual({ isActive }) {
        const [text, setText] = useState('');
        const fullText = 'Crafting narrative...';
        const indexRef = useRef(0);

        useEffect(() => {
            if (!isActive) {
                setText('');
                indexRef.current = 0;
                return;
            }
            const interval = setInterval(() => {
                indexRef.current = (indexRef.current + 1) % (fullText.length + 10);
                setText(fullText.slice(0, Math.min(indexRef.current, fullText.length)));
            }, 100);
            return () => clearInterval(interval);
        }, [isActive]);

        return h('div', {
            className: 'agent-visual scripter',
            style: {
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: AGENT_CONFIG[2].color,
                minHeight: '20px'
            }
        },
            h('span', null, text),
            isActive && h('span', {
                className: 'cursor-blink',
                style: {
                    animation: 'blink 1s step-end infinite',
                    marginLeft: '2px'
                }
            }, '|')
        );
    }

    // Visualizer Visual - Radar Grid
    function VisualizerVisual({ isActive }) {
        const [scanLine, setScanLine] = useState(0);

        useEffect(() => {
            if (!isActive) return;
            const interval = setInterval(() => {
                setScanLine(prev => (prev + 1) % 3);
            }, 400);
            return () => clearInterval(interval);
        }, [isActive]);

        const grid = Array(9).fill(null);

        return h('div', {
            className: 'agent-visual visualizer',
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '3px',
                width: '36px',
                height: '36px'
            }
        }, grid.map((_, i) =>
            h('div', {
                key: i,
                style: {
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    backgroundColor: Math.floor(i / 3) === scanLine
                        ? AGENT_CONFIG[3].color
                        : 'rgba(139, 92, 246, 0.2)',
                    transition: 'background-color 0.3s ease'
                }
            })
        ));
    }

    // Sound Designer Visual - Waveform
    function SoundDesignerVisual({ isActive }) {
        const [bars, setBars] = useState([0.3, 0.5, 0.7, 0.4, 0.6]);

        useEffect(() => {
            if (!isActive) return;
            const interval = setInterval(() => {
                setBars(prev => prev.map(() => 0.2 + Math.random() * 0.8));
            }, 150);
            return () => clearInterval(interval);
        }, [isActive]);

        return h('div', {
            className: 'agent-visual sound-designer',
            style: {
                display: 'flex',
                alignItems: 'flex-end',
                gap: '3px',
                height: '24px'
            }
        }, bars.map((height, i) =>
            h('div', {
                key: i,
                style: {
                    width: '4px',
                    height: `${height * 100}%`,
                    backgroundColor: AGENT_CONFIG[4].color,
                    borderRadius: '2px',
                    transition: 'height 0.15s ease'
                }
            })
        ));
    }

    // Assembler Visual - Timeline Progress
    function AssemblerVisual({ isActive, progress = 0 }) {
        return h('div', {
            className: 'agent-visual assembler',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }
        },
            h('div', {
                style: {
                    width: '48px',
                    height: '6px',
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }
            },
                h('div', {
                    style: {
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: AGENT_CONFIG[5].color,
                        transition: 'width 0.3s ease'
                    }
                })
            ),
            h('span', {
                style: {
                    fontSize: '10px',
                    color: AGENT_CONFIG[5].color,
                    fontFamily: 'JetBrains Mono, monospace'
                }
            }, `${Math.round(progress)}%`)
        );
    }

    // QA Visual - Checklist
    function QAVisual({ isActive }) {
        const [checks, setChecks] = useState([false, false, false]);

        useEffect(() => {
            if (!isActive) {
                setChecks([false, false, false]);
                return;
            }
            const timeouts = [
                setTimeout(() => setChecks(prev => [true, prev[1], prev[2]]), 500),
                setTimeout(() => setChecks(prev => [prev[0], true, prev[2]]), 1200),
                setTimeout(() => setChecks(prev => [prev[0], prev[1], true]), 2000),
            ];
            return () => timeouts.forEach(clearTimeout);
        }, [isActive]);

        return h('div', {
            className: 'agent-visual qa',
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
            }
        }, checks.map((checked, i) =>
            h('div', {
                key: i,
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    color: checked ? AGENT_CONFIG[6].color : 'rgba(255,255,255,0.3)'
                }
            },
                h('span', null, checked ? '✓' : '○'),
                h('span', null, ['Audio', 'Video', 'Format'][i])
            )
        ));
    }

    // Delivery Visual - Upload Progress
    function DeliveryVisual({ isActive, progress = 0 }) {
        return h('div', {
            className: 'agent-visual delivery',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }
        },
            h('span', { style: { fontSize: '16px' } }, '📤'),
            h('div', {
                style: {
                    flex: 1,
                    height: '4px',
                    backgroundColor: 'rgba(132, 204, 22, 0.2)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    minWidth: '40px'
                }
            },
                h('div', {
                    style: {
                        width: isActive ? `${progress}%` : '0%',
                        height: '100%',
                        backgroundColor: AGENT_CONFIG[7].color,
                        transition: 'width 0.3s ease'
                    }
                })
            )
        );
    }

    // Main AgentVisual Component
    function AgentVisual({ agentId, status, progress = 0 }) {
        const isActive = status === 'working' || status === 'active';
        const config = AGENT_CONFIG[agentId];

        if (!config) return null;

        const visualComponents = {
            2: () => h(ScripterVisual, { isActive }),
            3: () => h(VisualizerVisual, { isActive }),
            4: () => h(SoundDesignerVisual, { isActive }),
            5: () => h(AssemblerVisual, { isActive, progress }),
            6: () => h(QAVisual, { isActive }),
            7: () => h(DeliveryVisual, { isActive, progress }),
        };

        const VisualComponent = visualComponents[agentId];

        return h('div', {
            className: 'agent-visual-container',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: isActive ? 'rgba(0, 206, 209, 0.05)' : 'transparent',
                borderRadius: '8px',
                borderLeft: `3px solid ${isActive ? config.color : 'transparent'}`,
                transition: 'all 0.3s ease'
            }
        },
            h('span', {
                style: {
                    fontSize: '18px',
                    opacity: isActive ? 1 : 0.5
                }
            }, config.icon),
            h('div', { style: { flex: 1 } },
                h('div', {
                    style: {
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isActive ? config.color : 'rgba(255,255,255,0.5)',
                        marginBottom: '4px'
                    }
                }, config.name),
                VisualComponent ? VisualComponent() : null
            ),
            h('div', {
                style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: status === 'complete' ? '#10B981'
                        : isActive ? config.color
                        : 'rgba(255,255,255,0.2)',
                    boxShadow: isActive ? `0 0 8px ${config.color}` : 'none'
                }
            })
        );
    }

    // =============================================================================
    // EXPLAIN MODE STRIP
    // =============================================================================

    function ExplainModeStrip({ tasksThisMonth = 0, hoursSaved = 0 }) {
        const [isMinimized, setIsMinimized] = useState(false);
        const [isDismissed, setIsDismissed] = useState(
            localStorage.getItem('nexus-explain-dismissed') === 'true'
        );

        if (isDismissed) return null;

        const handleDismiss = () => {
            localStorage.setItem('nexus-explain-dismissed', 'true');
            setIsDismissed(true);
        };

        return h('div', {
            className: 'explain-mode-strip',
            style: {
                position: 'relative',
                padding: isMinimized ? '8px 16px' : '12px 16px',
                background: 'linear-gradient(90deg, rgba(0, 206, 209, 0.1), rgba(139, 92, 246, 0.1))',
                borderBottom: '1px solid rgba(0, 206, 209, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.3s ease'
            }
        },
            // Privacy Badge
            h('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }
            },
                h('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                    }
                },
                    h('span', { style: { fontSize: '12px' } }, '🔒'),
                    h('span', {
                        style: {
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#10B981',
                            letterSpacing: '0.05em'
                        }
                    }, 'PRIVATE MODE: ON')
                ),
                !isMinimized && h('span', {
                    style: {
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.6)'
                    }
                }, 'Your data stays on your device')
            ),

            // Value Props (when not minimized)
            !isMinimized && h('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px'
                }
            },
                h('div', {
                    style: {
                        textAlign: 'center'
                    }
                },
                    h('div', {
                        style: {
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#00CED1'
                        }
                    }, tasksThisMonth.toString()),
                    h('div', {
                        style: {
                            fontSize: '9px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            letterSpacing: '0.05em'
                        }
                    }, 'TASKS THIS MONTH')
                ),
                h('div', {
                    style: {
                        textAlign: 'center'
                    }
                },
                    h('div', {
                        style: {
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#8B5CF6'
                        }
                    }, `${hoursSaved.toFixed(1)}h`),
                    h('div', {
                        style: {
                            fontSize: '9px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            letterSpacing: '0.05em'
                        }
                    }, 'TIME SAVED')
                )
            ),

            // Controls
            h('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }
            },
                h('button', {
                    onClick: () => setIsMinimized(!isMinimized),
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        padding: '4px',
                        fontSize: '14px'
                    }
                }, isMinimized ? '▼' : '▲'),
                h('button', {
                    onClick: handleDismiss,
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        padding: '4px',
                        fontSize: '14px'
                    }
                }, '✕')
            )
        );
    }

    // =============================================================================
    // AGENT PANEL (Container for all agent visuals)
    // =============================================================================

    function AgentPanel({ agents }) {
        return h('div', {
            className: 'agent-panel',
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }
        },
            h('div', {
                style: {
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }
            }, 'RAGNAROK AGENTS'),
            ...Object.entries(agents).map(([id, state]) =>
                h(AgentVisual, {
                    key: id,
                    agentId: parseInt(id),
                    status: state.status,
                    progress: state.progress
                })
            )
        );
    }

    // =============================================================================
    // MAIN APP
    // =============================================================================

    function NexusVisualsApp() {
        const [agents, setAgents] = useState({
            2: { status: 'idle', progress: 0 },
            3: { status: 'idle', progress: 0 },
            4: { status: 'idle', progress: 0 },
            5: { status: 'idle', progress: 0 },
            6: { status: 'idle', progress: 0 },
            7: { status: 'idle', progress: 0 },
        });
        const [stats, setStats] = useState({
            tasksThisMonth: 128,
            hoursSaved: 4.3
        });

        // Listen for NEXUS events
        useEffect(() => {
            const handleAgentUpdate = (event) => {
                const { agentId, status, progress } = event.detail;
                setAgents(prev => ({
                    ...prev,
                    [agentId]: { status, progress: progress || 0 }
                }));
            };

            const handlePhaseChange = (event) => {
                const { phase, progress } = event.detail;
                const agentId = PHASE_TO_AGENT[phase];

                if (agentId) {
                    // Set previous agents to complete
                    setAgents(prev => {
                        const newAgents = { ...prev };
                        Object.keys(newAgents).forEach(id => {
                            if (parseInt(id) < agentId) {
                                newAgents[id] = { status: 'complete', progress: 100 };
                            } else if (parseInt(id) === agentId) {
                                newAgents[id] = { status: 'working', progress: progress || 0 };
                            }
                        });
                        return newAgents;
                    });
                }
            };

            const handleProductionComplete = () => {
                setAgents(prev => {
                    const newAgents = { ...prev };
                    Object.keys(newAgents).forEach(id => {
                        newAgents[id] = { status: 'complete', progress: 100 };
                    });
                    return newAgents;
                });
                // Update stats
                setStats(prev => ({
                    tasksThisMonth: prev.tasksThisMonth + 1,
                    hoursSaved: prev.hoursSaved + 0.5
                }));
            };

            window.addEventListener('nexus-agent-update', handleAgentUpdate);
            window.addEventListener('nexus-phase-change', handlePhaseChange);
            window.addEventListener('nexus-production-complete', handleProductionComplete);

            return () => {
                window.removeEventListener('nexus-agent-update', handleAgentUpdate);
                window.removeEventListener('nexus-phase-change', handlePhaseChange);
                window.removeEventListener('nexus-production-complete', handleProductionComplete);
            };
        }, []);

        return h(React.Fragment, null,
            h(ExplainModeStrip, {
                tasksThisMonth: stats.tasksThisMonth,
                hoursSaved: stats.hoursSaved
            }),
            h(AgentPanel, { agents })
        );
    }

    // =============================================================================
    // MOUNT & INITIALIZATION
    // =============================================================================

    // Inject CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        .cursor-blink {
            animation: blink 1s step-end infinite;
        }

        .agent-visual-container {
            font-family: 'JetBrains Mono', 'SF Mono', monospace;
        }
    `;
    document.head.appendChild(style);

    // Create mount point if it doesn't exist
    let explainMountPoint = document.getElementById('nexus-explain-strip');
    if (!explainMountPoint) {
        explainMountPoint = document.createElement('div');
        explainMountPoint.id = 'nexus-explain-strip';
        const productionContainer = document.getElementById('production-container')
            || document.querySelector('.nexus-production')
            || document.body.firstChild;
        if (productionContainer && productionContainer.parentNode) {
            productionContainer.parentNode.insertBefore(explainMountPoint, productionContainer);
        } else {
            document.body.prepend(explainMountPoint);
        }
    }

    let agentPanelMountPoint = document.getElementById('nexus-agent-panel');
    if (!agentPanelMountPoint) {
        agentPanelMountPoint = document.createElement('div');
        agentPanelMountPoint.id = 'nexus-agent-panel';
        // Insert after phases in production UI
        const phasesContainer = document.getElementById('nexus-phases');
        if (phasesContainer && phasesContainer.parentNode) {
            phasesContainer.parentNode.insertBefore(agentPanelMountPoint, phasesContainer.nextSibling);
        }
    }

    // Mount React app
    if (explainMountPoint || agentPanelMountPoint) {
        const root = ReactDOM.createRoot(explainMountPoint || agentPanelMountPoint);
        root.render(h(NexusVisualsApp));
        console.log('🎨 NEXUS Agent Visuals v1.0 initialized');
    }

    // =============================================================================
    // HOOK INTO EXISTING NEXUS SSE CLIENT
    // =============================================================================

    // Patch the global nexus client if it exists
    const patchNexusClient = () => {
        if (window.NexusProductionClient) {
            const originalHandleProgress = window.NexusProductionClient.prototype.handleProgress;
            window.NexusProductionClient.prototype.handleProgress = function(data) {
                // Call original
                originalHandleProgress.call(this, data);

                // Dispatch custom event for React
                window.dispatchEvent(new CustomEvent('nexus-phase-change', {
                    detail: {
                        phase: data.phase || this.currentPhase,
                        progress: data.progress || 0,
                        message: data.message
                    }
                }));
            };

            const originalHandleComplete = window.NexusProductionClient.prototype.handleComplete;
            window.NexusProductionClient.prototype.handleComplete = function(data) {
                // Call original
                originalHandleComplete.call(this, data);

                // Dispatch complete event
                window.dispatchEvent(new CustomEvent('nexus-production-complete', {
                    detail: data
                }));
            };

            console.log('🔗 NEXUS Production Client patched for agent visuals');
        }
    };

    // Try to patch immediately or wait for client to load
    if (window.NexusProductionClient) {
        patchNexusClient();
    } else {
        window.addEventListener('nexus-client-ready', patchNexusClient);
        // Also try after a delay as fallback
        setTimeout(patchNexusClient, 1000);
    }

    // Expose API for manual control
    window.NexusAgentVisuals = {
        updateAgent: (agentId, status, progress) => {
            window.dispatchEvent(new CustomEvent('nexus-agent-update', {
                detail: { agentId, status, progress }
            }));
        },
        setPhase: (phase, progress) => {
            window.dispatchEvent(new CustomEvent('nexus-phase-change', {
                detail: { phase, progress }
            }));
        },
        complete: () => {
            window.dispatchEvent(new CustomEvent('nexus-production-complete'));
        }
    };

    console.log('✅ Agent Visuals Integration loaded. API: window.NexusAgentVisuals');

})();
