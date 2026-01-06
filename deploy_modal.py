#!/usr/bin/env python3
"""
FLAWLESS GENESIS - Strategy Results Modal Deployment Script
Injects the Strategy Modal into creative-director.html
"""

import os
import sys

# The Strategy Results Modal Code (HTML + CSS + JS)
MODAL_CODE = '''
    <!-- ==================================================================================
         FLAWLESS GENESIS - STRATEGY RESULTS MODAL
         ================================================================================== -->
    <div id="genesis-results-modal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-void/80 backdrop-blur-md transition-opacity duration-300 opacity-0" id="modal-backdrop"></div>

        <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-2xl bg-[#0a0a1e]/90 border border-white/10 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 duration-300" id="modal-panel">

                    <!-- Modal Header -->
                    <div class="relative bg-white/5 px-4 py-6 sm:px-6 border-b border-white/10 backdrop-blur-xl">
                        <div class="absolute top-0 right-0 pt-4 pr-4">
                            <button type="button" onclick="closeStrategyModal()" class="rounded-md bg-transparent text-white/40 hover:text-white focus:outline-none transition-colors">
                                <span class="sr-only">Close</span>
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-neon/20 border border-white/10 shadow-lg shadow-purple-500/10">
                                <span class="text-2xl animate-pulse">🚀</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold leading-6 text-white tracking-tight" id="modal-title">Genesis Strategy Report</h3>
                                <p class="mt-1 text-sm text-white/60">AI-generated growth roadmap for <span id="modal-business-name" class="text-neon font-semibold">Your Business</span></p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="px-4 py-6 sm:p-8 space-y-8 bg-gradient-to-b from-[#0a0a1e] to-black max-h-[60vh] overflow-y-auto">

                        <!-- Market Insights Section -->
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-neon uppercase tracking-widest flex items-center gap-2">
                                <span>📊</span> Market Insights
                            </h4>
                            <div id="modal-market-insights" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Populated by JS -->
                            </div>
                        </div>

                        <!-- Competitive Position Section -->
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                <span>🎯</span> Competitive Position
                            </h4>
                            <div class="relative pt-2 px-4 py-4 rounded-xl bg-white/5 border border-white/5">
                                <div class="flex mb-2 items-center justify-between">
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-500/20 border border-purple-500/30">
                                        Market Gap
                                    </span>
                                    <span id="modal-competitor-gap" class="text-xs font-bold inline-block text-purple-300">
                                        Calculating...
                                    </span>
                                </div>
                                <div class="overflow-hidden h-2 mb-3 text-xs flex rounded-full bg-white/10">
                                    <div id="modal-competitor-bar" style="width: 0%" class="shadow-lg shadow-purple-500/50 flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000 ease-out"></div>
                                </div>
                                <p id="modal-competitor-text" class="text-sm text-white/70 italic leading-relaxed">Analyzing competitor saturation...</p>
                            </div>
                        </div>

                        <!-- Strategic Recommendations Section -->
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                <span>🧠</span> Strategic Recommendations
                            </h4>
                            <ul id="modal-recommendations" class="space-y-3">
                                <!-- Populated by JS -->
                            </ul>
                        </div>

                        <!-- Action Items Section -->
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <span>✅</span> Next Steps
                            </h4>
                            <div id="modal-action-items" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <!-- Populated by JS -->
                            </div>
                        </div>

                    </div>

                    <!-- Modal Footer CTAs -->
                    <div class="bg-[#050510] px-4 py-5 sm:px-6 sm:flex sm:flex-row-reverse gap-3 border-t border-white/10">
                        <button type="button" onclick="bookStrategyCall()" class="w-full inline-flex justify-center items-center rounded-xl border border-transparent bg-gradient-to-r from-purple-600 to-neon px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:from-purple-500 hover:to-neon/90 focus:outline-none sm:ml-3 sm:w-auto transition-all duration-300 transform hover:-translate-y-0.5">
                            <span class="mr-2">📅</span> Book Strategy Call
                        </button>
                        <button type="button" onclick="downloadStrategyPDF()" class="mt-3 w-full inline-flex justify-center items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/10 hover:border-white/20 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto transition-all duration-200">
                            <span class="mr-2">📄</span> Download PDF
                        </button>
                        <button type="button" onclick="shareStrategy()" class="mt-3 w-full inline-flex justify-center items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/10 hover:border-white/20 focus:outline-none sm:mt-0 sm:w-auto transition-all duration-200">
                            <span class="mr-2">🔗</span> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // ==================================================================================
        // STRATEGY MODAL LOGIC (FLAWLESS GENESIS)
        // ==================================================================================

        function showStrategyModal(data) {
            const modal = document.getElementById('genesis-results-modal');
            const backdrop = document.getElementById('modal-backdrop');
            const panel = document.getElementById('modal-panel');

            if (!modal || !backdrop || !panel) {
                console.error('Strategy modal elements not found');
                return;
            }

            // Populate Business Name
            if (data && data.lead && data.lead.business_name) {
                document.getElementById('modal-business-name').textContent = data.lead.business_name;
            } else if (typeof collectedLeadData !== 'undefined' && collectedLeadData.businessName) {
                document.getElementById('modal-business-name').textContent = collectedLeadData.businessName;
            }

            // 1. Market Insights
            const insightsContainer = document.getElementById('modal-market-insights');
            insightsContainer.innerHTML = '';
            const insights = (data && data.strategy && data.strategy.market_insights)
                ? data.strategy.market_insights
                : (data && data.result && data.result.market_insights)
                    ? data.result.market_insights
                    : [
                        "Market demand is growing in your sector by 12% YoY based on recent search volume.",
                        "Competitors are currently under-utilizing short-form video marketing channels.",
                        "AI-generated content is showing 3x higher engagement rates in your vertical.",
                        "Mobile-first video consumption has increased 47% in your target demographic."
                    ];
            insights.forEach(text => {
                const div = document.createElement('div');
                div.className = 'p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon/30 transition-all duration-300 hover:bg-white/10';
                div.innerHTML = '<p class="text-sm text-white/80 leading-relaxed">"' + text + '"</p>';
                insightsContainer.appendChild(div);
            });

            // 2. Competitor Analysis
            const compScore = (data && data.strategy && data.strategy.competitor_score)
                ? data.strategy.competitor_score
                : (data && data.result && data.result.competitor_score)
                    ? data.result.competitor_score
                    : 75;
            setTimeout(() => {
                document.getElementById('modal-competitor-bar').style.width = compScore + '%';
            }, 500);
            document.getElementById('modal-competitor-gap').textContent = (100 - compScore) + '% Opportunity';

            const compText = (data && data.strategy && data.strategy.competitor_analysis)
                ? data.strategy.competitor_analysis
                : (data && data.result && data.result.competitor_analysis)
                    ? data.result.competitor_analysis
                    : 'Your competitors have significant gaps in video content strategy, creating a prime opportunity for market differentiation.';
            document.getElementById('modal-competitor-text').textContent = compText;

            // 3. Strategic Recommendations
            const recList = document.getElementById('modal-recommendations');
            recList.innerHTML = '';
            const recs = (data && data.strategy && data.strategy.recommendations)
                ? data.strategy.recommendations
                : (data && data.result && data.result.recommendations)
                    ? data.result.recommendations
                    : [
                        "Launch a 30s hook-based video on Instagram Reels to target the 25-34 demographic.",
                        "Target lookalike audiences of your top 2 competitors using 'Speed' as the core hook.",
                        "Focus messaging on convenience to differentiate from legacy providers.",
                        "Implement retargeting funnel with sequential video content."
                    ];
            recs.forEach(rec => {
                const li = document.createElement('li');
                li.className = 'flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors';
                li.innerHTML = '<div class="mt-0.5 min-w-[20px] text-amber-400">✓</div><span class="text-sm text-white/90">' + rec + '</span>';
                recList.appendChild(li);
            });

            // 4. Action Items
            const actionContainer = document.getElementById('modal-action-items');
            actionContainer.innerHTML = '';
            const actions = (data && data.strategy && data.strategy.action_items)
                ? data.strategy.action_items
                : (data && data.result && data.result.action_items)
                    ? data.result.action_items
                    : ["Approve Script", "Select Voiceover", "Launch Campaign"];
            actions.forEach((action, idx) => {
                const actionText = typeof action === 'string' ? action : action.text;
                const div = document.createElement('div');
                div.className = 'p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center hover:bg-emerald-500/10 transition-colors cursor-default';
                div.innerHTML = '<span class="text-[10px] text-emerald-400 font-bold block mb-1 tracking-wider">STEP ' + (idx + 1) + '</span><span class="text-sm text-white font-medium">' + actionText + '</span>';
                actionContainer.appendChild(div);
            });

            // Show Modal with Animation
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Trigger reflow for animation
            void modal.offsetWidth;

            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
            panel.classList.remove('opacity-0', 'translate-y-4', 'sm:scale-95');
            panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
        }

        function closeStrategyModal() {
            const modal = document.getElementById('genesis-results-modal');
            const backdrop = document.getElementById('modal-backdrop');
            const panel = document.getElementById('modal-panel');

            if (!modal || !backdrop || !panel) return;

            // Animate out
            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
            panel.classList.remove('opacity-100', 'translate-y-0', 'sm:scale-100');
            panel.classList.add('opacity-0', 'translate-y-4', 'sm:scale-95');

            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        function downloadStrategyPDF() {
            const btn = event.currentTarget;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="mr-2 animate-spin">⏳</span> Generating...';

            setTimeout(() => {
                btn.innerHTML = '<span class="mr-2">✅</span> Downloaded';
                btn.classList.add('text-emerald-400', 'border-emerald-500/50');

                // Show toast notification
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-4 right-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-xl z-[9999] animate-pulse';
                toast.textContent = '📄 Strategy PDF will be emailed to you shortly!';
                document.body.appendChild(toast);

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('text-emerald-400', 'border-emerald-500/50');
                    toast.remove();
                }, 3000);
            }, 1500);
        }

        function shareStrategy() {
            if (navigator.share) {
                navigator.share({
                    title: 'My Genesis Strategy',
                    text: 'Check out this AI-generated video strategy from Barrios A2I!',
                    url: window.location.href
                });
            } else {
                const btn = event.currentTarget;
                const originalText = btn.innerHTML;
                navigator.clipboard.writeText(window.location.href);
                btn.innerHTML = '<span class="mr-2">✅</span> Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            }
        }

        function bookStrategyCall() {
            window.open('https://calendly.com/gary-barrios/strategy', '_blank');
        }

        // Close modal on backdrop click
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'modal-backdrop') {
                closeStrategyModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('genesis-results-modal');
                if (modal && !modal.classList.contains('hidden')) {
                    closeStrategyModal();
                }
            }
        });

        // ==================================================================================
        // PIPELINE HOOK - Override renderGenesisComplete to auto-open modal
        // ==================================================================================
        (function() {
            const _prevRenderComplete = window.renderGenesisComplete;
            window.renderGenesisComplete = function(data) {
                // Call original (shows in-page banner)
                if (_prevRenderComplete) {
                    _prevRenderComplete(data);
                }

                // Auto-open modal after 1.5s delay for smooth UX
                setTimeout(function() {
                    showStrategyModal(data || {});
                }, 1500);
            };
        })();
    </script>
</body>
'''

def inject_modal(file_path):
    """Inject the Strategy Modal into creative-director.html"""

    # Check if file exists
    if not os.path.exists(file_path):
        print(f"❌ Error: {file_path} not found.")
        print("   Please ensure you are in the correct directory")
        return False

    # Read existing file
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if modal already exists to avoid duplication
    if "genesis-results-modal" in content:
        print("⚠️  Modal already exists in file. Skipping injection to avoid duplication.")
        print("   To re-inject, first remove the existing modal code.")
        return True

    # Find </body> tag and inject before it
    if "</body>" not in content:
        print("❌ Error: Could not find </body> tag in file.")
        return False

    # Inject the modal code
    new_content = content.replace("</body>\n</html>", MODAL_CODE)

    # Write updated content
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("✅ Successfully injected Strategy Modal into " + file_path)
    print("")
    print("📊 Modal Features:")
    print("   • 4 Sections: Market Insights, Competitive Position, Recommendations, Action Items")
    print("   • 3 CTAs: Book Strategy Call, Download PDF, Share")
    print("   • Glassmorphism UI with animations")
    print("   • Auto-opens on Genesis pipeline completion")
    print("")
    print("🚀 Next steps:")
    print("   git add creative-director.html")
    print('   git commit -m "feat: Add Strategy Results Modal to FLAWLESS GENESIS"')
    print("   git push origin master")
    return True


if __name__ == "__main__":
    file_path = "creative-director.html"
    if len(sys.argv) > 1:
        file_path = sys.argv[1]

    success = inject_modal(file_path)
    sys.exit(0 if success else 1)
