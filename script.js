// Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.color = `rgba(201, 161, 59, ${Math.random() * 0.3})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

resizeCanvas();
initParticles();
animateParticles();

// Theme Toggle Function
function setTheme(theme) {
    const body = document.body;
    const lightBtn = document.getElementById('lightModeBtn');
    const darkBtn = document.getElementById('darkModeBtn');
    
    if (theme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
        
        anime({
            targets: body,
            backgroundColor: ['#1a1a2e', '#fcf9f2'],
            duration: 1000,
            easing: 'easeInOutQuad'
        });
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
        
        anime({
            targets: body,
            backgroundColor: ['#fcf9f2', '#1a1a2e'],
            duration: 1000,
            easing: 'easeInOutQuad'
        });
    }
    
    // Animate all cards
    anime({
        targets: '.card',
        scale: [0.98, 1],
        opacity: [0.8, 1],
        duration: 800,
        easing: 'easeOutElastic'
    });
}

// Remove loading screen
window.addEventListener('load', function() {
    setTimeout(() => {
        anime({
            targets: '#loading',
            opacity: 0,
            duration: 800,
            easing: 'easeOutQuad',
            complete: () => {
                document.getElementById('loading').style.display = 'none';
            }
        });
    }, 1500);
});

// Main animations and logic
document.addEventListener('DOMContentLoaded', function() {
    // Main container animation
    anime({
        targets: '.zakat-container',
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.98, 1],
        duration: 1200,
        easing: 'easeOutElastic'
    });

    // Header animations
    anime({
        targets: '.badge',
        scale: [0, 1],
        rotate: ['-10deg', '0deg'],
        duration: 800,
        delay: 300,
        easing: 'easeOutElastic'
    });

    anime({
        targets: '.header h1',
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 500,
        easing: 'easeOutQuad'
    });

    anime({
        targets: '.header p',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 700,
        easing: 'easeOutQuad'
    });

    // Card animations
    anime({
        targets: '#formCard',
        translateX: [-30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 900,
        easing: 'easeOutQuad'
    });

    anime({
        targets: '#resultCard',
        translateX: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 1100,
        easing: 'easeOutQuad'
    });

    // Button animations
    anime({
        targets: '.type-btn',
        scale: [0, 1],
        rotate: ['-5deg', '0deg'],
        duration: 600,
        delay: anime.stagger(100, {start: 1300}),
        easing: 'easeOutElastic'
    });

    // Constants
    const NISAB_GRAM = 85;
    
    // DOM Elements
    const btnPenghasilan = document.getElementById('btnPenghasilan');
    const btnEmas = document.getElementById('btnEmas');
    const formPenghasilan = document.getElementById('formPenghasilan');
    const formEmas = document.getElementById('formEmas');
    const hitungBtn = document.getElementById('hitungBtn');
    
    const gaji = document.getElementById('gaji');
    const penghasilanLain = document.getElementById('penghasilanLain');
    const jumlahEmas = document.getElementById('jumlahEmas');
    const hargaEmas = document.getElementById('hargaEmas');
    
    const totalHartaEl = document.getElementById('totalHarta');
    const nilaiNisabEl = document.getElementById('nilaiNisab');
    const nisabGram = document.getElementById('nisabGram');
    const hargaEmasDisplay = document.getElementById('hargaEmasDisplay');
    const statusContainer = document.getElementById('statusContainer');
    const jumlahZakatEl = document.getElementById('jumlahZakat');
    const zakatAmount = document.getElementById('zakatAmount');

    // Format Rupiah
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(angka).replace('Rp', 'Rp ');
    }

    // Toggle Form
    function toggleForm(jenis) {
        if (jenis === 'penghasilan') {
            formPenghasilan.style.display = 'block';
            formEmas.style.display = 'none';
            btnPenghasilan.classList.add('active');
            btnEmas.classList.remove('active');
        } else {
            formPenghasilan.style.display = 'none';
            formEmas.style.display = 'block';
            btnEmas.classList.add('active');
            btnPenghasilan.classList.remove('active');
        }
    }

    // Hitung Zakat
    function hitungZakat() {
        const hargaPerGram = parseFloat(hargaEmas.value) || 0;
        const nisab = hargaPerGram * NISAB_GRAM;
        
        let total = 0;
        
        if (formPenghasilan.style.display !== 'none') {
            const gajiValue = parseFloat(gaji.value) || 0;
            const lainValue = parseFloat(penghasilanLain.value) || 0;
            total = gajiValue + lainValue;
        } else {
            const emasValue = parseFloat(jumlahEmas.value) || 0;
            total = emasValue * hargaPerGram;
        }

        // Update display with animation
        anime({
            targets: totalHartaEl,
            scale: [1, 1.1, 1],
            duration: 400,
            easing: 'easeInOutQuad',
            complete: () => {
                totalHartaEl.textContent = formatRupiah(total);
            }
        });

        anime({
            targets: nilaiNisabEl,
            scale: [1, 1.1, 1],
            duration: 400,
            easing: 'easeInOutQuad',
            complete: () => {
                nilaiNisabEl.textContent = formatRupiah(nisab);
            }
        });

        nisabGram.textContent = NISAB_GRAM + ' gram';
        hargaEmasDisplay.textContent = formatRupiah(hargaPerGram);

        // Cek status
        const isWajib = total >= nisab;
        const zakat = isWajib ? total * 0.025 : 0;

        // Create status badge
        let statusHtml = '';
        if (isWajib) {
            statusHtml = `
                <div class="status-badge status-wajib">
                    <i class="fas fa-check-circle"></i> WAJIB ZAKAT
                </div>
            `;
        } else {
            statusHtml = `
                <div class="status-badge status-tidak">
                    <i class="fas fa-times-circle"></i> TIDAK WAJIB ZAKAT
                </div>
            `;
        }
        statusContainer.innerHTML = statusHtml;

        // Animate status badge
        anime({
            targets: '.status-badge',
            scale: [0, 1],
            rotate: ['-10deg', '0deg'],
            duration: 500,
            easing: 'easeOutElastic'
        });

        // Update zakat amount
        jumlahZakatEl.textContent = formatRupiah(zakat);
        
        anime({
            targets: zakatAmount,
            scale: [1, 1.05, 1],
            duration: 400,
            easing: 'easeInOutQuad'
        });

        // Animate result items
        anime({
            targets: '.result-item',
            translateX: ['-10px', '0px'],
            opacity: [0.5, 1],
            duration: 400,
            delay: anime.stagger(50),
            easing: 'easeOutQuad'
        });
    }

    // Event Listeners
    btnPenghasilan.addEventListener('click', function() {
        toggleForm('penghasilan');
        
        anime({
            targets: this,
            scale: [1, 0.9, 1.1, 1],
            duration: 400,
            easing: 'easeInOutQuad'
        });
        
        hitungZakat();
    });

    btnEmas.addEventListener('click', function() {
        toggleForm('emas');
        
        anime({
            targets: this,
            scale: [1, 0.9, 1.1, 1],
            duration: 400,
            easing: 'easeInOutQuad'
        });
        
        hitungZakat();
    });

    hitungBtn.addEventListener('click', function() {
        hitungZakat();
        
        anime({
            targets: this,
            scale: [1, 0.95, 1.05, 1],
            duration: 400,
            easing: 'easeInOutQuad'
        });
    });

    // Input animations
    [gaji, penghasilanLain, jumlahEmas, hargaEmas].forEach(input => {
        input.addEventListener('input', function() {
            anime({
                targets: this.parentElement,
                scale: [1, 1.02, 1],
                duration: 200,
                easing: 'easeInOutQuad'
            });
        });
    });

    // Keyboard shortcut (Enter)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            hitungBtn.click();
        }
    });

    // Initial calculation
    hitungZakat();
});
