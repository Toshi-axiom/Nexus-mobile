// 1. 3D Particle Background Setup
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Theme Colors for particles (Gold/Sand)
    const colors = ['#CBBD93', '#FAE8B4', '#80775C'];

    // FIX: Declare mouseX/mouseY before resize() so they can be initialised after
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // FIX: Reset mouse to centre whenever viewport changes
        mouseX = width / 2;
        mouseY = height / 2;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 2 + 0.1;
            this.size = (Math.random() * 2 + 1) / this.z;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            let dx = (mouseX - width / 2) * 0.0005 / this.z;
            let dy = (mouseY - height / 2) * 0.0005 / this.z;

            this.x += this.speedX + dx;
            this.y += this.speedY + dy;

            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0.1, 1 - this.z / 3);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = 1; // reset before loop
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    // FIX: Call resize() first so width/height/mouseX/mouseY are all valid
    resize();
    initParticles();
    animateParticles();
}

// 2. Initialize VanillaTilt for 3D Cards
// FIX: Exclude inputs/textareas inside tilt cards from tilt interference
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02
    });

    // FIX: Pause tilt on form focus, resume on blur to prevent input drift
    document.querySelectorAll('.tilt-card input, .tilt-card textarea').forEach(el => {
        el.addEventListener('focus', () => {
            const card = el.closest('.tilt-card');
            if (card && card.vanillaTilt) card.vanillaTilt.destroy();
        });
        el.addEventListener('blur', () => {
            const card = el.closest('.tilt-card');
            if (card && !card.vanillaTilt) {
                VanillaTilt.init(card, {
                    max: 15, speed: 400, glare: true,
                    "max-glare": 0.2, scale: 1.02
                });
            }
        });
    });
}

// 3. GSAP Animations
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (document.querySelector(".gsap-nav")) {
        gsap.from(".gsap-nav", {
            y: -50, opacity: 0, duration: 1, ease: "power3.out"
        });
    }

    if (document.querySelector(".gsap-hero h1")) {
        gsap.from(".gsap-hero h1", {
            y: 50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out"
        });
    }

    if (document.querySelector(".gsap-hero p")) {
        gsap.from(".gsap-hero p", {
            y: 30, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out"
        });
    }

    document.querySelectorAll('.gsap-stagger').forEach(container => {
        const items = container.querySelectorAll('.tilt-card, .feature-card, .page-content');
        if (items.length > 0) {
            gsap.fromTo(items,
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: container,
                        start: "top bottom", 
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "back.out(1.7)",
                    clearProps: "all"
                }
            );
        }
    });
}

// 4. Button click interaction
// FIX: Only target catalogue "Add to Cart" buttons, not the contact form submit button
document.querySelectorAll('.card button.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        const originalText = btn.innerText;
        btn.innerText = "Added ✓";
        btn.style.color = "var(--color-bg-dark)";
        btn.style.background = "var(--color-sand)";

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.color = "var(--color-cream)";
            btn.style.background = "transparent";
        }, 2000);
    });
});