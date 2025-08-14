// Advanced Particle Effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(window.innerWidth / 10, 100);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor(),
                type: Math.random() > 0.5 ? 'circle' : 'square'
            });
        }
    }

    getRandomColor() {
        const colors = [
            '#667eea',
            '#764ba2',
            '#ffd700',
            '#ffed4e',
            '#ffffff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Add touch support for mobile
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }

            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            
            if (particle.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            }
            
            this.ctx.restore();

            // Draw connections
            this.particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        this.ctx.save();
                        this.ctx.globalAlpha = (150 - distance) / 150 * 0.3;
                        this.ctx.strokeStyle = particle.color;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Floating Text Effect
class FloatingText {
    constructor() {
        this.texts = [];
        this.init();
    }

    init() {
        this.createFloatingTexts();
        this.animate();
    }

    createFloatingTexts() {
        const words = ['HTML', 'CSS', 'JS', 'React', 'Node.js', 'PHP', 'MySQL', 'Git'];
        
        words.forEach((word, index) => {
            this.texts.push({
                text: word,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                size: Math.random() * 20 + 15,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2
            });
        });
    }

    animate() {
        this.texts.forEach(text => {
            // Update position
            text.x += text.vx;
            text.y += text.vy;
            text.rotation += text.rotationSpeed;

            // Bounce off edges
            if (text.x < 0 || text.x > window.innerWidth) {
                text.vx *= -1;
            }
            if (text.y < 0 || text.y > window.innerHeight) {
                text.vy *= -1;
            }

            // Create floating text element
            let textElement = document.querySelector(`[data-text="${text.text}"]`);
            if (!textElement) {
                textElement = document.createElement('div');
                textElement.className = 'floating-text';
                textElement.setAttribute('data-text', text.text);
                textElement.textContent = text.text;
                textElement.style.cssText = `
                    position: fixed;
                    font-size: ${text.size}px;
                    color: rgba(102, 126, 234, ${text.opacity});
                    font-weight: 700;
                    pointer-events: none;
                    z-index: 1;
                    user-select: none;
                    transition: all 0.3s ease;
                `;
                document.body.appendChild(textElement);
            }

            // Update position and rotation
            textElement.style.transform = `translate(${text.x}px, ${text.y}px) rotate(${text.rotation}deg)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle effects
document.addEventListener('DOMContentLoaded', () => {
    // Only create particles on desktop for performance
    if (window.innerWidth > 768) {
        new ParticleSystem();
        new FloatingText();
    }
});

// Add CSS for particle effects
const particleCSS = `
    .particle-canvas {
        background: transparent;
    }

    .floating-text {
        font-family: 'Poppins', sans-serif;
        text-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
    }

    /* Dark mode adjustments */
    .dark-mode .floating-text {
        color: rgba(255, 255, 255, 0.1) !important;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
        .particle-canvas {
            display: none;
        }
        
        .floating-text {
            display: none;
        }
    }

    /* Performance optimizations */
    .particle-canvas {
        will-change: transform;
    }

    .floating-text {
        will-change: transform;
    }
`;

// Inject particle CSS
const style = document.createElement('style');
style.textContent = particleCSS;
document.head.appendChild(style); 