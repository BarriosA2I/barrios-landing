/**
 * Neural Nexus Visualization
 * Interactive particle network with mouse interaction
 */
(function() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    // Configuration
    const CONFIG = {
        particleCount: 50,
        connectionRadius: 120,
        mouseRadius: 180,
        baseSpeed: 0.3,
        colors: {
            primary: '#00CED1',
            secondary: '#0E7490',
            pulse: '#F59E0B'
        }
    };

    function resize() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * CONFIG.baseSpeed,
            vy: (Math.random() - 0.5) * CONFIG.baseSpeed,
            radius: Math.random() * 2 + 1,
            pulse: Math.random() < 0.1
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: CONFIG.particleCount }, createParticle);
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.pulse ? CONFIG.colors.pulse : CONFIG.colors.primary;
        ctx.fill();

        // Glow effect
        ctx.shadowColor = p.pulse ? CONFIG.colors.pulse : CONFIG.colors.primary;
        ctx.shadowBlur = p.pulse ? 15 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.connectionRadius) {
                    const opacity = 1 - dist / CONFIG.connectionRadius;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 206, 209, ${opacity * 0.3})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function update() {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        particles.forEach(p => {
            // Mouse interaction
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.mouseRadius) {
                    const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                    p.vx += (dx / dist) * force * 0.5;
                    p.vy += (dy / dist) * force * 0.5;
                }
            }

            // Apply velocity with damping
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Bounce off edges
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            // Keep in bounds
            p.x = Math.max(0, Math.min(w, p.x));
            p.y = Math.max(0, Math.min(h, p.y));
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        drawConnections();
        particles.forEach(drawParticle);
        update();

        requestAnimationFrame(animate);
    }

    // Event listeners
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        resize();
    });

    // Initialize
    init();
    animate();
})();
