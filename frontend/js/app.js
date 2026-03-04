/**
 * TripPlanner AI - Enhanced Premium Experience Logic
 * Advanced Three.js, GSAP Animations & Interactive Elements
 * by Senior Web Designer
 */

// ========== STATE MANAGEMENT ==========
const appState = {
    currentTrip: null,
    isLoading: false,
    threeScene: null,
    renderer: null,
    camera: null,
    particles: null,
    currentDay: 0, // 0-indexed day counter
};

// ========== DOM ELEMENTS ==========
const elements = {
    // Sections
    landingSection: document.getElementById('landingSection'),
    inputSection: document.getElementById('inputSection'),
    loadingSection: document.getElementById('loadingSection'),
    resultsSection: document.getElementById('resultsSection'),
    errorSection: document.getElementById('errorSection'),

    // Form Elements
    tripForm: document.getElementById('tripForm'),
    planButton: document.getElementById('planButton'),
    progressBar: document.getElementById('progressBar'),
    loadingStatus: document.getElementById('loadingStatus'),
    loadingSubstatus: document.getElementById('loadingSubstatus'),
    loadingTip: document.getElementById('loadingTip'),

    // Results Elements
    destinationTitle: document.getElementById('destinationTitle'),
    tripMeta: document.getElementById('tripMeta'),
    tripOverview: document.getElementById('tripOverview'),
    itineraryContainer: document.getElementById('itineraryContainer'),
    recommendationsGrid: document.getElementById('recommendationsGrid'),
    errorMessage: document.getElementById('errorMessage'),
    downloadButton: document.getElementById('downloadButton'),

    // Day navigation
    prevDayBtn: document.getElementById('prevDayBtn'),
    nextDayBtn: document.getElementById('nextDayBtn'),
    dayStepsContainer: document.getElementById('dayStepsContainer'),
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = getCurrentPage(path);

    console.log('🌿 TripPlanner AI initialized on page:', page);

    // Page-specific initialization
    if (page === 'home') {
        initHomePage();
    } else if (page === 'plan') {
        initPlanPage();
    } else if (page === 'results') {
        initResultsPage();
    }

    // Universal features
    initMagneticButtons();
    initScrollAnimations();
    initNavigation();
});

function getCurrentPage(path) {
    if (path.includes('plan.html')) return 'plan';
    if (path.includes('results.html')) return 'results';
    return 'home';
}

// ========== HOME PAGE ==========
function initHomePage() {
    initAdvancedThreeBackground();
    initGSAPHeroAnimations();
    initParallaxEffects();
    initScrollIndicator();
}

/**
 * Advanced Three.js Background with Particles & Waves
 */
function initAdvancedThreeBackground() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle system
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;

        // Color (nature palette)
        const colorChoice = Math.random();
        if (colorChoice < 0.5) {
            colors[i] = 0.063; // Forest green
            colors[i + 1] = 0.725;
            colors[i + 2] = 0.506;
        } else {
            colors[i] = 0.365; // Sky blue
            colors[i + 1] = 0.510;
            colors[i + 2] = 0.965;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.025,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add ambient waves effect
    const waveGeometry = new THREE.PlaneGeometry(20, 20, 50, 50);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.rotation.x = -Math.PI / 2;
    wave.position.y = -5;
    scene.add(wave);

    camera.position.z = 5;

    // Store for updates
    appState.threeScene = { scene, camera, renderer, particles, wave };

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    let frameCount = 0;
    function animate() {
        requestAnimationFrame(animate);
        frameCount++;

        // Rotate particles
        particles.rotation.y += 0.0005;
        particles.rotation.x = mouseY * 0.1;

        // Wave animation
        const positions = wave.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x * 0.5 + frameCount * 0.01) * 0.3 +
                Math.cos(y * 0.5 + frameCount * 0.01) * 0.3;
        }
        wave.geometry.attributes.position.needsUpdate = true;

        // Camera subtle movement
        camera.position.x = mouseX * 0.5;
        camera.position.y = mouseY * 0.5;

        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/**
 * GSAP Hero Animations
 */
function initGSAPHeroAnimations() {
    if (typeof gsap === 'undefined') return;
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // CSS already animates the hero — GSAP handles scroll-triggered sections
    if (typeof ScrollTrigger !== 'undefined') {
        // Feature cards
        gsap.utils.toArray('.lp-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 60,
                duration: 0.7,
                delay: i * 0.12,
                ease: 'power3.out',
            });
        });

        // Steps
        gsap.utils.toArray('.lp-step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 40,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'power3.out',
            });
        });

        // Testimonial
        gsap.from('.lp-testimonial__inner', {
            scrollTrigger: {
                trigger: '.lp-testimonial__inner',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 50,
            scale: 0.97,
            duration: 0.8,
            ease: 'power3.out',
        });

        // CTA
        gsap.from('.lp-cta__inner', {
            scrollTrigger: {
                trigger: '.lp-cta__inner',
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
        });
    }
}

/**
 * Parallax Effects on Scroll
 */
function initParallaxEffects() {
    // Handled inside initGSAPHeroAnimations with ScrollTrigger
}

/**
 * Scroll Indicator Click
 */
function initScrollIndicator() {
    const indicator = document.querySelector('.lp-scroll-hint');
    if (indicator) {
        indicator.addEventListener('click', () => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Smooth scroll to features (legacy support)
window.scrollToFeatures = function () {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
};

// ========== PLAN PAGE ==========
function initPlanPage() {
    initParticlesBackground();
    initFormAnimations();
    initFormInteractivity();

    if (elements.tripForm) {
        elements.tripForm.addEventListener('submit', handleFormSubmit);
        setupDateValidation();
    }
}

/**
 * Particles Background for Plan Page
 */
function initParticlesBackground() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/**
 * Form Entrance Animations
 */
function initFormAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.form-hero-header', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
    });

    gsap.from('.form-glass-container', {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5,
    });
}

/**
 * Form Interactivity Enhancements
 */
function initFormInteractivity() {
    // Input focus effects
    const inputs = document.querySelectorAll('.ghost-input, .ghost-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

    // Progress step updates (visual only)
    const formInputs = document.querySelectorAll('.form-grid input, .form-grid select');
    let filledCount = 0;

    formInputs.forEach(input => {
        input.addEventListener('change', () => {
            filledCount = Array.from(formInputs).filter(i => i.value).length;
            updateProgressSteps(filledCount, formInputs.length);
        });
    });
}

function updateProgressSteps(filled, total) {
    const steps = document.querySelectorAll('.progress-step');
    const percentage = (filled / total) * 100;

    steps.forEach((step, index) => {
        if (percentage > index * 33) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Number input steppers
window.changeNumber = function (inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const current = parseInt(input.value) || 0;
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 99;
    const newValue = Math.max(min, Math.min(max, current + delta));

    input.value = newValue;
    input.dispatchEvent(new Event('change'));
};

/**
 * Date Validation Setup
 */
function setupDateValidation() {
    const today = new Date().toISOString().split('T')[0];
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    if (startDate) {
        startDate.setAttribute('min', today);
        startDate.addEventListener('change', (e) => {
            if (endDate) {
                endDate.setAttribute('min', e.target.value);
            }
        });
    }

    if (endDate) {
        endDate.setAttribute('min', today);
    }
}

// ========== RESULTS PAGE ==========
function initResultsPage() {
    console.log('🎉 Initializing Results Page...');

    const savedTrip = sessionStorage.getItem('currentTrip');

    if (savedTrip) {
        try {
            const tripData = JSON.parse(savedTrip);
            console.log('✅ Found trip data:', tripData);
            appState.currentTrip = tripData;
            appState.currentDay = 0; // Initialize at day 1

            displayResults(tripData);

            // Attach pagination events
            if (elements.prevDayBtn) elements.prevDayBtn.onclick = () => changeDay(-1);
            if (elements.nextDayBtn) elements.nextDayBtn.onclick = () => changeDay(1);

            if (elements.downloadButton) {
                elements.downloadButton.addEventListener('click', downloadItinerary);
            }

            initResultsAnimations();
            celebrateWithConfetti();
        } catch (error) {
            console.error('❌ Error parsing trip data:', error);
            loadMockData();
        }
    } else {
        console.log('⚠️ No trip data found in sessionStorage, loading mock data for preview...');
        loadMockData();
    }
}

/**
 * Handle Day Changes
 */
function changeDay(delta) {
    if (!appState.currentTrip) return;
    const totalDays = appState.currentTrip.itinerary.length;
    const newDay = appState.currentDay + delta;

    if (newDay >= 0 && newDay < totalDays) {
        appState.currentDay = newDay;
        displayDay(appState.currentDay);
    }
}

function goToDay(index) {
    appState.currentDay = index;
    displayDay(index);
}

/**
 * Load Mock Data for Testing/Preview
 */
function loadMockData() {
    const mockTrip = {
        overview: {
            destination: 'Kyoto, Japan',
            duration: 5,
            travelers: 2,
            total_budget: 2500,
            pace: 'balanced',
            start_date: '2026-04-01',
            end_date: '2026-04-05'
        },
        itinerary: [
            {
                day: 1,
                date: '2026-04-01',
                theme: 'Cultural Immersion',
                morning: {
                    name: 'Fushimi Inari Shrine',
                    icon: '⛩️',
                    description: 'Walk through thousands of vermillion torii gates in this iconic mountain shrine.',
                    duration: '2-3 hours',
                    cost: 0,
                    tips: 'Visit early morning to avoid crowds'
                },
                afternoon: {
                    name: 'Nishiki Market Food Tour',
                    icon: '🍜',
                    description: 'Explore Kyoto\'s famous food market and taste local delicacies.',
                    duration: '2 hours',
                    cost: 25,
                    tips: 'Try the fresh seafood and Japanese pickles'
                },
                evening: {
                    name: 'Gion District Evening Walk',
                    icon: '🏮',
                    description: 'Stroll through historic streets and spot geishas.',
                    duration: '1-2 hours',
                    cost: 0,
                    tips: 'Best time is around 6-7 PM'
                },
                estimated_cost: 100
            },
            {
                day: 2,
                date: '2026-04-02',
                theme: 'Nature & Serenity',
                morning: {
                    name: 'Arashiyama Bamboo Grove',
                    icon: '🎋',
                    description: 'Walk through the enchanting bamboo forest.',
                    duration: '1-2 hours',
                    cost: 0,
                    tips: 'Early morning visit recommended'
                },
                afternoon: {
                    name: 'Tenryu-ji Temple & Gardens',
                    icon: '🏯',
                    description: 'UNESCO World Heritage Site with stunning Zen gardens.',
                    duration: '2 hours',
                    cost: 8,
                    tips: 'Combine with bamboo grove visit'
                },
                evening: {
                    name: 'Sagano Romantic Train',
                    icon: '🚂',
                    description: 'Scenic railway journey along Hozu River.',
                    duration: '30 minutes',
                    cost: 12,
                    tips: 'Book tickets in advance'
                },
                estimated_cost: 80
            },
            {
                day: 3,
                date: '2026-04-03',
                theme: 'Historical Exploration',
                morning: {
                    name: 'Kinkaku-ji (Golden Pavilion)',
                    icon: '✨',
                    description: 'Visit the stunning gold-leaf covered temple.',
                    duration: '1-2 hours',
                    cost: 5,
                    tips: 'Best photos in morning light'
                },
                afternoon: {
                    name: 'Ryoan-ji Rock Garden',
                    icon: '🪨',
                    description: 'Meditate at Japan\'s most famous Zen garden.',
                    duration: '1 hour',
                    cost: 6,
                    tips: 'Visit during weekdays for quieter experience'
                },
                evening: {
                    name: 'Pontocho Alley Dining',
                    icon: '🍱',
                    description: 'Traditional dinner at riverside restaurant.',
                    duration: '2 hours',
                    cost: 50,
                    tips: 'Try kaiseki multi-course meal'
                },
                estimated_cost: 120
            }
        ],
        smart_additions: {
            packing_list: [
                'Comfortable walking shoes',
                'Light jacket',
                'Portable WiFi device',
                'JR Rail Pass',
                'Reusable water bottle'
            ],
            local_tips: [
                'Remove shoes when entering temples and traditional restaurants',
                'Cash is preferred at many small shops',
                'Learn basic Japanese greetings',
                'Download Google Translate offline'
            ]
        }
    };

    console.log('📦 Loaded mock data for preview');
    appState.currentTrip = mockTrip;
    appState.currentDay = 0; // Initialize at day 1

    displayResults(mockTrip);

    // Attach pagination events for mock data
    if (elements.prevDayBtn) elements.prevDayBtn.onclick = () => changeDay(-1);
    if (elements.nextDayBtn) elements.nextDayBtn.onclick = () => changeDay(1);

    celebrateWithConfetti();

    // Attach pagination events for mock data
    if (elements.prevDayBtn) elements.prevDayBtn.onclick = () => changeDay(-1);
    if (elements.nextDayBtn) elements.nextDayBtn.onclick = () => changeDay(1);
}

/**
 * Confetti Celebration
 */
function celebrateWithConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const confettiCount = 100;
    const colors = ['#10b981', '#f59e0b', '#3b82f6', '#fbbf24', '#6ee7b7'];

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    for (let i = 0; i < confettiCount; i++) {
        confetti.push(new ConfettiPiece());
    }

    let animationFrames = 0;
    const maxFrames = 300; // Stop after ~5 seconds

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach(piece => {
            piece.update();
            piece.draw();
        });

        animationFrames++;
        if (animationFrames < maxFrames) {
            requestAnimationFrame(animateConfetti);
        } else {
            // Fade out
            gsap.to(canvas, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    canvas.style.display = 'none';
                },
            });
        }
    }

    animateConfetti();
}

/**
 * Results Page Animations
 */
function initResultsAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.results-glass-header', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
    });

    gsap.from('.overview-sidebar', {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
    });

    gsap.from('.itinerary-main', {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
    });

    // Stagger day cards
    gsap.from('.day-card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.8,
    });
}

// Share functionality
window.shareTrip = function () {
    if (navigator.share && appState.currentTrip) {
        navigator.share({
            title: `My ${appState.currentTrip.overview.destination} Trip`,
            text: 'Check out my personalized trip plan created with TripPlanner AI!',
            url: window.location.href,
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Please copy the URL manually'));
    }
};

// ========== UNIVERSAL FEATURES ==========

/**
 * Magnetic Button Effect
 */
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.3;
            const moveY = y * 0.3;

            this.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Scroll-based Animations
 */
function initScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
    });

    // Observe elements
    document.querySelectorAll('.animate-scroll, .animate-fade-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Enhanced Navigation Effects
 */
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ========== FORM SUBMISSION ==========

/**
 * Handle Form Submission with Enhanced Loading
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    if (appState.isLoading) return;

    const formData = getFormData();
    if (!validateFormData(formData)) return;

    try {
        appState.isLoading = true;
        showUISection('loading');

        // Rotate loading messages
        const loadingMessages = [
            { status: 'Curating your adventure...', sub: 'Analyzing destinations' },
            { status: 'Consulting the travel spirits...', sub: 'Finding hidden gems' },
            { status: 'Weaving your perfect journey...', sub: 'Crafting experiences' },
            { status: 'Almost there...', sub: 'Finalizing details' },
        ];

        const loadingTips = [
            '💡 Tip: Pack light, travel lighter',
            '💡 Tip: Learn a few local phrases',
            '💡 Tip: Keep digital copies of documents',
            '💡 Tip: Try the local cuisine',
            '💡 Tip: Wake up early for fewer crowds',
        ];

        let messageIndex = 0;
        let tipIndex = 0;

        const messageInterval = setInterval(() => {
            if (messageIndex < loadingMessages.length && elements.loadingStatus) {
                elements.loadingStatus.textContent = loadingMessages[messageIndex].status;
                if (elements.loadingSubstatus) {
                    elements.loadingSubstatus.textContent = loadingMessages[messageIndex].sub;
                }
                messageIndex++;
            }
        }, 1500);

        const tipInterval = setInterval(() => {
            if (elements.loadingTip) {
                elements.loadingTip.textContent = loadingTips[tipIndex % loadingTips.length];
                tipIndex++;
            }
        }, 3000);

        // Progress bar animation
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 8;
            if (progress > 90) progress = 95;
            if (elements.progressBar) {
                elements.progressBar.style.width = `${progress}%`;
            }
        }, 500);

        // API Call
        const response = await apiClient.planTrip(formData);

        // Complete loading
        clearInterval(messageInterval);
        clearInterval(tipInterval);
        clearInterval(progressInterval);

        if (elements.progressBar) elements.progressBar.style.width = '100%';
        if (elements.loadingStatus) elements.loadingStatus.textContent = 'Journey complete! 🎉';
        if (elements.loadingSubstatus) elements.loadingSubstatus.textContent = 'Preparing your experience...';

        // Store trip data
        sessionStorage.setItem('currentTrip', JSON.stringify(response));

        // Redirect to results
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 1000);

    } catch (error) {
        console.error('Trip planning failed:', error);
        appState.isLoading = false;
        showError(error.message || 'Failed to create your journey. Please try again.');
    }
}

/**
 * Get Form Data
 */
function getFormData() {
    const interests = Array.from(
        document.querySelectorAll('input[name="interests"]:checked')
    ).map(cb => cb.value);

    const pace = document.querySelector('input[name="pace"]:checked')?.value || 'balanced';

    return {
        destination: document.getElementById('destination')?.value.trim() || '',
        start_date: document.getElementById('startDate')?.value || '',
        end_date: document.getElementById('endDate')?.value || '',
        budget: parseFloat(document.getElementById('budget')?.value) || 0,
        travelers: parseInt(document.getElementById('travelers')?.value) || 1,
        interests: interests.length > 0 ? interests : ['culture', 'nature'],
        pace: pace,
        special_requests: document.getElementById('specialRequests')?.value || '',
    };
}

/**
 * Validate Form Data
 */
function validateFormData(data) {
    if (!data.destination) {
        alert('🌍 Where would you like to go?');
        return false;
    }
    if (!data.start_date || !data.end_date) {
        alert('📅 Please select your travel dates');
        return false;
    }
    if (new Date(data.end_date) <= new Date(data.start_date)) {
        alert('📅 Return date must be after departure date');
        return false;
    }
    if (data.budget < 100) {
        alert('💰 Please enter a realistic budget');
        return false;
    }
    return true;
}

// ========== UI SECTION MANAGEMENT ==========

/**
 * Show UI Section (for multi-section pages)
 */
function showUISection(sectionName) {
    const sections = ['input', 'loading', 'results', 'error'];

    sections.forEach(section => {
        const el = elements[`${section}Section`];
        if (el) {
            el.classList.remove('section-active');
            el.classList.add('section-hidden');
        }
    });

    const target = elements[`${sectionName}Section`];
    if (target) {
        target.classList.remove('section-hidden');
        target.classList.add('section-active');

        // Animate entrance
        if (typeof gsap !== 'undefined') {
            gsap.from(target, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out',
            });
        }
    }
}

/**
 * Show Error Message
 */
function showError(message) {
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message || 'Something went wrong. Please try again.';
    }
    showUISection('error');
}

// ========== RESULTS DISPLAY ==========

/**
 * Display Trip Results
 */
function displayResults(data) {
    console.log('📊 Displaying results with data:', data);

    if (!data || !data.overview) {
        console.error('❌ Invalid trip data structure');
        showError('Invalid trip data');
        return;
    }

    console.log('✅ Valid data structure confirmed');

    // Update header
    if (elements.destinationTitle) {
        elements.destinationTitle.textContent = data.overview.destination || 'Your Journey';
        console.log('✅ Updated destination title');
    } else {
        console.warn('⚠️ destinationTitle element not found');
    }

    if (elements.tripMeta) {
        elements.tripMeta.textContent = `${data.overview.duration || 0} Days · ${data.overview.travelers || 1} Traveler(s) · $${data.overview.total_budget || 0} Budget`;
        console.log('✅ Updated trip meta');
    } else {
        console.warn('⚠️ tripMeta element not found');
    }

    // Update overview sidebar
    if (elements.tripOverview) {
        console.log('✅ Updating trip overview sidebar');
        elements.tripOverview.innerHTML = `
            <div class="summary-item">
                <div class="summary-icon">📅</div>
                <div class="summary-content">
                    <div class="summary-label">Duration</div>
                    <div class="summary-value">${data.overview.duration || 0} Days</div>
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-icon">💰</div>
                <div class="summary-content">
                    <div class="summary-label">Budget</div>
                    <div class="summary-value">$${data.overview.total_budget || 0}</div>
                </div>
            </div>
        `;
    }

    // Initialize day steps/pills
    if (elements.dayStepsContainer) {
        elements.dayStepsContainer.innerHTML = data.itinerary.map((_, i) =>
            `<div class="day-step-pill ${i === 0 ? 'active' : ''}" onclick="goToDay(${i})">${i + 1}</div>`
        ).join('');
    }

    // Show the first day
    displayDay(0);

    // Update recommendations
    if (elements.recommendationsGrid && data.smart_additions) {
        console.log('✅ Rendering smart recommendations');
        const recommendations = [];

        if (data.smart_additions.packing_list) {
            recommendations.push({
                icon: '🧳',
                title: 'Packing Essentials',
                description: data.smart_additions.packing_list.slice(0, 5).join(', '),
                items: data.smart_additions.packing_list,
            });
        }

        if (data.smart_additions.local_tips) {
            recommendations.push({
                icon: '💡',
                title: 'Local Insights',
                description: data.smart_additions.local_tips.slice(0, 3).join('. '),
                items: data.smart_additions.local_tips,
            });
        }

        recommendations.push({
            icon: '🌐',
            title: 'Stay Connected',
            description: 'Consider getting a local SIM or portable WiFi',
            price: '$8/day',
        });

        elements.recommendationsGrid.innerHTML = recommendations.map((rec, index) => `
            <div class="addon-card glass-effect" style="animation-delay: ${index * 0.15}s">
                <div class="addon-icon">${rec.icon}</div>
                <h3 class="addon-title">${rec.title}</h3>
                <p class="addon-description">${rec.description}</p>
                ${rec.price ? `<div class="addon-price">${rec.price}</div>` : ''}
                <button class="addon-btn" onclick="expandRecommendation(${index})">View Details</button>
            </div>
        `).join('');
        console.log(`✅ Rendered ${recommendations.length} recommendations`);
    } else {
        console.warn('⚠️ recommendationsGrid element not found or no smart_additions data');
    }
}

/**
 * Display a Single Day
 */
function displayDay(index) {
    const data = appState.currentTrip;
    const day = data.itinerary[index];
    if (!day) return;

    // Update Pills
    const pills = document.querySelectorAll('.day-step-pill');
    pills.forEach((p, i) => {
        p.classList.toggle('active', i === index);
    });

    // Update Buttons
    if (elements.prevDayBtn) elements.prevDayBtn.disabled = index === 0;
    if (elements.nextDayBtn) elements.nextDayBtn.disabled = index === data.itinerary.length - 1;

    // Fade animation trigger
    const container = elements.itineraryContainer;
    if (!container) return;

    gsap.to(container, {
        opacity: 0, y: 20, duration: 0.2, onComplete: () => {
            container.innerHTML = `
            <div class="day-card single-day glass-effect animate-day-entrance">
                <div class="day-header">
                    <div class="day-number">
                        <span class="day-badge">Day ${day.day || index + 1}</span>
                        <span class="day-date">${formatDate(day.date)}</span>
                    </div>
                    ${day.theme ? `
                        <div class="day-theme">
                            <span class="theme-icon">${getThemeIcon(day.theme)}</span>
                            <span class="theme-name">${day.theme}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="day-activities">
                    ${renderActivity(day.morning, '09:00 AM')}
                    ${renderActivity(day.afternoon, '02:00 PM')}
                    ${renderActivity(day.evening, '07:00 PM')}
                </div>
                <div class="day-summary">
                    <div class="summary-stats">
                        <span class="stat">${countActivities(day)} Activities</span>
                        <span class="stat-divider">·</span>
                        <span class="stat">Investment: $${day.estimated_cost || 100}</span>
                    </div>
                </div>
            </div>
        `;
            gsap.to(container, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        }
    });
}



/**
 * Render Activity Item
 */
function renderActivity(activity, time) {
    if (!activity || !activity.name) return '';

    return `
        <div class="activity-item">
            <div class="activity-time">
                <span class="time-dot"></span>
                <span class="time-text">${time}</span>
            </div>
            <div class="activity-content">
                <h4 class="activity-title">
                    <span class="activity-icon">${activity.icon || '📍'}</span>
                    ${activity.name}
                </h4>
                <p class="activity-description">${activity.description || ''}</p>
                <div class="activity-meta">
                    ${activity.duration ? `<span class="meta-tag">⏱️ ${activity.duration}</span>` : ''}
                    ${activity.cost ? `<span class="meta-tag">💰 $${activity.cost}</span>` : ''}
                    ${activity.category ? `<span class="meta-tag">🏷️ ${activity.category}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// ========== HELPER FUNCTIONS ==========

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getThemeIcon(theme) {
    const icons = {
        culture: '🏛️',
        nature: '🌳',
        adventure: '🧗',
        food: '🍽️',
        relaxation: '🧘',
        nightlife: '🎭',
    };
    return icons[theme.toLowerCase()] || '🌟';
}

function countActivities(day) {
    let count = 0;
    if (day.morning && day.morning.name) count++;
    if (day.afternoon && day.afternoon.name) count++;
    if (day.evening && day.evening.name) count++;
    return count;
}

window.expandRecommendation = function (index) {
    alert('This feature will be available soon!');
};

// ========== PDF DOWNLOAD ==========

/**
 * Download Itinerary as PDF
 */
function downloadItinerary() {
    if (!appState.currentTrip) {
        alert('No trip data available');
        return;
    }

    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please try refreshing the page.');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const trip = appState.currentTrip;

        // Title
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text(trip.overview.destination, 20, 25);

        // Subtitle
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`${trip.overview.duration} Day Journey`, 20, 35);
        doc.text(`${trip.overview.travelers} Traveler(s) · Total Budget: $${trip.overview.total_budget}`, 20, 42);

        // Line
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.5);
        doc.line(20, 48, 190, 48);

        let y = 60;

        // Itinerary
        trip.itinerary.forEach((day, index) => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Day ${day.day} - ${formatDate(day.date)}`, 20, y);
            y += 8;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');

            if (day.morning && day.morning.name) {
                doc.text(`Morning: ${day.morning.name}`, 25, y);
                y += 5;
            }
            if (day.afternoon && day.afternoon.name) {
                doc.text(`Afternoon: ${day.afternoon.name}`, 25, y);
                y += 5;
            }
            if (day.evening && day.evening.name) {
                doc.text(`Evening: ${day.evening.name}`, 25, y);
                y += 5;
            }

            y += 8;
        });

        // Save
        doc.save(`TripPlanner-${trip.overview.destination.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}

// ========== CONSOLE BRANDING ==========
console.log(
    '%c🌿 TripPlanner AI',
    'font-size: 24px; font-weight: bold; color: #10b981; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%cWhere Nature Meets Intelligence',
    'font-size: 14px; color: #475569; font-style: italic;'
);

// ========== END OF APP.JS ==========
