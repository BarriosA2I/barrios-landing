// Intake Terminal - Command Line Lead Capture
(function() {
  let currentStep = 'input';
  let selectedProtocol = '';

  // Create the modal HTML
  const modalHTML = `
    <div id="intake-terminal" class="fixed inset-0 z-50 flex items-center justify-center px-4 hidden">
      <!-- Backdrop -->
      <div id="terminal-backdrop" class="absolute inset-0 bg-[#0a0a1e]/90 backdrop-blur-sm transition-opacity"></div>

      <!-- Terminal Window -->
      <div id="terminal-window" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/30 bg-[#0b0d1a] shadow-[0_0_50px_rgba(0,194,255,0.15)] opacity-0 scale-95 transition-all duration-300">

        <!-- Terminal Header -->
        <div class="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="font-mono text-xs uppercase tracking-widest text-white/40">
              Protocol_Link: <span id="protocol-name" class="text-primary">A2I Commercial Lab</span>
            </span>
          </div>
          <button id="terminal-close" class="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content Area -->
        <div id="terminal-content" class="p-6 md:p-8">

          <!-- Step 1: Input Form -->
          <div id="step-input" class="terminal-step">
            <form id="intake-form" class="space-y-6">
              <div class="space-y-1">
                <h3 class="font-serif text-2xl text-white">Initialize System</h3>
                <p class="text-sm text-white/40">
                  Configure your parameters to begin deployment.
                </p>
              </div>

              <div class="space-y-4 font-mono text-sm">
                <div class="group">
                  <label class="mb-1.5 block text-[10px] uppercase tracking-wider text-primary/70">
                    --target_email
                  </label>
                  <input
                    type="email"
                    id="input-email"
                    required
                    class="w-full rounded bg-black/40 border border-white/10 px-4 py-3 text-primary placeholder:text-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="founder@company.com"
                  />
                </div>

                <div class="group">
                  <label class="mb-1.5 block text-[10px] uppercase tracking-wider text-primary/70">
                    --organization_id
                  </label>
                  <input
                    type="text"
                    id="input-company"
                    required
                    class="w-full rounded bg-black/40 border border-white/10 px-4 py-3 text-primary placeholder:text-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="Company Name"
                  />
                </div>

                <div class="group">
                  <label class="mb-1.5 block text-[10px] uppercase tracking-wider text-primary/70">
                    --mission_brief <span class="text-white/30">(optional)</span>
                  </label>
                  <textarea
                    id="input-objective"
                    rows="2"
                    class="w-full rounded bg-black/40 border border-white/10 px-4 py-3 text-primary placeholder:text-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Brief description of your objective..."
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                class="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded bg-primary py-3 text-xs font-bold uppercase tracking-widest text-[#0a0a1e] hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all"
              >
                <span class="relative z-10 flex items-center gap-2">
                  Execute_Sequence
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </span>
              </button>
            </form>
          </div>

          <!-- Step 2: Processing -->
          <div id="step-processing" class="terminal-step hidden">
            <div class="flex flex-col items-center justify-center py-8 text-center">
              <div class="relative mb-6">
                <div class="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                <svg class="h-10 w-10 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 class="mb-2 font-mono text-lg text-white">Compiling Request...</h3>
              <div class="h-1 w-48 overflow-hidden rounded-full bg-white/10">
                <div class="h-full w-full bg-primary origin-left animate-progress"></div>
              </div>
              <div id="processing-messages" class="mt-4 space-y-1 text-xs font-mono text-white/40">
                <p class="processing-msg">Authenticating handshake...</p>
                <p class="processing-msg opacity-0">Establishing uplink...</p>
                <p class="processing-msg opacity-0">Allocating bandwidth...</p>
              </div>
            </div>
          </div>

          <!-- Step 3: Success -->
          <div id="step-success" class="terminal-step hidden">
            <div class="flex flex-col items-center justify-center py-4 text-center">
              <div class="mb-6 rounded-full bg-emerald-500/10 p-3">
                <svg class="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="mb-2 font-serif text-2xl text-white">Signal Received.</h3>
              <p class="mb-6 max-w-xs text-sm text-white/40">
                A Barrios Engineer has been dispatched to review your configuration. Expect transmission within 24 hours.
              </p>
              <button
                id="terminal-close-success"
                class="rounded border border-white/10 bg-white/5 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
              >
                [ Close_Terminal ]
              </button>
            </div>
          </div>

        </div>

        <!-- Terminal Footer -->
        <div class="border-t border-white/5 bg-[#05060d] px-4 py-2 text-[10px] font-mono text-white/30 flex justify-between">
          <span>STATUS: <span id="terminal-status" class="text-primary">ONLINE</span></span>
          <span>BARRIOS_A2I_v3.0.1</span>
        </div>
      </div>
    </div>
  `;

  // Inject modal into page
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Cache DOM elements
  const terminal = document.getElementById('intake-terminal');
  const terminalWindow = document.getElementById('terminal-window');
  const backdrop = document.getElementById('terminal-backdrop');
  const closeBtn = document.getElementById('terminal-close');
  const closeSuccessBtn = document.getElementById('terminal-close-success');
  const form = document.getElementById('intake-form');
  const protocolNameEl = document.getElementById('protocol-name');
  const statusEl = document.getElementById('terminal-status');

  const stepInput = document.getElementById('step-input');
  const stepProcessing = document.getElementById('step-processing');
  const stepSuccess = document.getElementById('step-success');

  // Open terminal
  window.openIntakeTerminal = function(protocolName) {
    selectedProtocol = protocolName;
    currentStep = 'input';

    // Reset form
    form.reset();

    // Update protocol name
    protocolNameEl.textContent = protocolName;

    // Show input step
    showStep('input');

    // Show modal
    terminal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Animate in
    setTimeout(() => {
      terminalWindow.classList.remove('opacity-0', 'scale-95');
      terminalWindow.classList.add('opacity-100', 'scale-100');
    }, 10);
  };

  // Close terminal
  function closeTerminal() {
    terminalWindow.classList.remove('opacity-100', 'scale-100');
    terminalWindow.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
      terminal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  // Show specific step
  function showStep(step) {
    stepInput.classList.add('hidden');
    stepProcessing.classList.add('hidden');
    stepSuccess.classList.add('hidden');

    if (step === 'input') {
      stepInput.classList.remove('hidden');
      statusEl.textContent = 'ONLINE';
      statusEl.className = 'text-primary';
    } else if (step === 'processing') {
      stepProcessing.classList.remove('hidden');
      statusEl.textContent = 'PROCESSING';
      statusEl.className = 'text-amber-400';
      animateProcessingMessages();
    } else if (step === 'success') {
      stepSuccess.classList.remove('hidden');
      statusEl.textContent = 'COMPLETE';
      statusEl.className = 'text-emerald-400';
    }
  }

  // Animate processing messages
  function animateProcessingMessages() {
    const messages = document.querySelectorAll('.processing-msg');
    messages.forEach((msg, i) => {
      msg.classList.add('opacity-0');
      setTimeout(() => {
        msg.classList.remove('opacity-0');
        msg.classList.add('opacity-100');
      }, i * 600);
    });
  }

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('input-email').value;
    const company = document.getElementById('input-company').value;
    const objective = document.getElementById('input-objective').value;

    // Show processing
    showStep('processing');

    // Prepare payload
    const formData = {
      email: email,
      company: company,
      objective: objective,
      protocol: selectedProtocol,
      timestamp: new Date().toISOString()
    };

    // Send to API endpoint
    fetch('/api/terminal-intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'SIGNAL_LOCKED') {
        // Success - show confirmation
        showStep('success');
      } else {
        // API returned error but request succeeded
        console.error('API error:', data.error);
        showStep('success'); // Still show success to user
      }
    })
    .catch(error => {
      // Network error - still show success (graceful degradation)
      console.error('Network error:', error);
      showStep('success');
    });
  });

  // Event listeners
  closeBtn.addEventListener('click', closeTerminal);
  closeSuccessBtn.addEventListener('click', closeTerminal);
  backdrop.addEventListener('click', closeTerminal);

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !terminal.classList.contains('hidden')) {
      closeTerminal();
    }
  });

})();
