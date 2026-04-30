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

// 2. Helper to Initialize VanillaTilt for 3D Cards
function initVanillaTilt(elements) {
    if (typeof VanillaTilt !== 'undefined' && elements.length > 0) {
        VanillaTilt.init(elements, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });

        elements.forEach(card => {
            card.querySelectorAll('input, textarea').forEach(el => {
                el.addEventListener('focus', () => {
                    if (card.vanillaTilt) card.vanillaTilt.destroy();
                });
                el.addEventListener('blur', () => {
                    if (!card.vanillaTilt) {
                        VanillaTilt.init(card, {
                            max: 15, speed: 400, glare: true, "max-glare": 0.2, scale: 1.02
                        });
                    }
                });
            });
        });
    }
}

// 3. Helper to Initialize GSAP Stagger
function initScrollTriggers(containers) {
    if (typeof gsap !== 'undefined' && containers.length > 0) {
        containers.forEach(container => {
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
}

// Initialize global static GSAP
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (document.querySelector(".gsap-nav")) gsap.from(".gsap-nav", { y: -50, opacity: 0, duration: 1, ease: "power3.out" });
    if (document.querySelector(".gsap-hero h1")) gsap.from(".gsap-hero h1", { y: 50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    if (document.querySelector(".gsap-hero p")) gsap.from(".gsap-hero p", { y: 30, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
}

// 4. Cart System
const Cart = {
    items: [],
    
    init() {
        const saved = localStorage.getItem('nexus_cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
        this.updateUI();
        
        document.getElementById('cart-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cart-drawer').classList.add('open');
        });
        document.getElementById('close-cart')?.addEventListener('click', () => {
            document.getElementById('cart-drawer').classList.remove('open');
        });
        
        // Expose remove item globally for the generated HTML
        window.removeFromCart = (id) => this.remove(id);
    },

    add(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
    },

    remove(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
    },

    save() {
        localStorage.setItem('nexus_cart', JSON.stringify(this.items));
        this.updateUI();
    },

    updateUI() {
        const countSpan = document.getElementById('cart-count');
        const itemsContainer = document.getElementById('cart-items');
        const totalPriceEl = document.getElementById('cart-total-price');
        
        if (!countSpan || !itemsContainer) return;

        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        countSpan.textContent = totalItems;
        totalPriceEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
        
        if (this.items.length === 0) {
            itemsContainer.innerHTML = '<p style="color: var(--color-bronze); text-align: center; margin-top: 20px;">Your cart is empty.</p>';
            return;
        }

        itemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">&times;</button>
            </div>
        `).join('');
    }
};

Cart.init();

// 5. Dynamic Data Fetching & Rendering
const productGrid = document.getElementById('product-grid');
let allProducts = [];

if (productGrid) {
    // Fetch products
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
            
            // Setup Filter Bar
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const filter = e.target.getAttribute('data-filter');
                    if (filter === 'all') {
                        renderProducts(allProducts);
                    } else {
                        renderProducts(allProducts.filter(p => p.category === filter));
                    }
                });
            });
        })
        .catch(err => console.error("Failed to load products:", err));
} else {
    // If not on index.html, just initialize static elements
    initVanillaTilt(document.querySelectorAll(".tilt-card"));
    initScrollTriggers(document.querySelectorAll('.gsap-stagger'));
}

function renderProducts(products) {
    productGrid.innerHTML = '';
    
    if (products.length === 0) {
        productGrid.innerHTML = '<p style="color: var(--color-cream); grid-column: 1/-1; text-align: center;">No products found.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card tilt-card';
        card.innerHTML = `
            <img src="${product.image}" style="object-fit: cover;" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.specs}</p>
            <span class="price">₹${product.price.toLocaleString('en-IN')}</span>
            <button class="btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });

    // Add Cart button listeners
    productGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const product = allProducts.find(p => p.id === id);
            if (product) {
                Cart.add(product);
                
                // Button visual feedback
                const originalText = btn.innerText;
                btn.innerText = "Added ✓";
                btn.style.color = "var(--color-bg-dark)";
                btn.style.background = "var(--color-sand)";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.color = "var(--color-cream)";
                    btn.style.background = "transparent";
                }, 2000);
            }
        });
    });

    // Re-initialize 3D & Animations for new elements
    ScrollTrigger.refresh();
    initVanillaTilt(productGrid.querySelectorAll(".tilt-card"));
    
    // For GSAP, we manually trigger a simple fade-up since ScrollTrigger batching is complex on dynamic replace
    gsap.fromTo(productGrid.querySelectorAll('.tilt-card'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all" }
    );
}