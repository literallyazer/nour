// ===== GAME STATE =====
let gameState = {
    level: 'intro',
    matchedPairs: 0,
    score: 0,
    flipped: [],
    locked: false
};

const memories = [
    { emoji: '📱', title: 'July 22', memory: 'It Started With A Follow' },
    { emoji: '🍝', title: 'Aug 29', memory: 'Our First Date' },
    { emoji: '☕', title: 'Sep 7', memory: 'You Said Yes' },
    { emoji: '💪', title: 'Sep 21', memory: 'Growing Stronger' },
    { emoji: '💫', title: 'Oct 10', memory: 'Falling Deeper' },
    { emoji: '💍', title: 'Oct 31', memory: 'Forever With You' }
];

const timelineMemories = [
    {
        title: 'It Started With A Follow 📱',
        date: 'July 22',
        story: 'I saw your profile and something just clicked. Your energy - I had to reach out. That single moment changed everything.',
        days: 101
    },
    {
        title: 'Our First Date 🍝✨',
        date: 'Aug 29',
        story: 'Pasta and ice cream. Such simple things, but with you everything felt magical. I remember every moment - your laugh, your smile. and the first time we held hands.',
        days: 63
    },
     {
        title: 'The server that took us forward 💪',
        date: 'Sep 5',
        story: 'Laughter and games with you, I felt so alive. You challenged me, made me think, and we grew closer. That night, I knew we were building something special together.',
        days: 56
    },
    {
        title: 'You Said Yes ☕💕',
        date: 'Sep 7',
        story: 'In that café, with hearts racing, and the eclipsed moon above us, you made it official. I was the happiest I\'d ever been. You chose me. That moment is forever.',
        days: 54
    },
   
    {
        title: 'Falling in Medina 💫',
        date: 'sep 17',
        story: 'Kefteji and walks through the old streets of Medina. Every moment with you felt like a dream. I was falling deeper in love with you, and I never wanted it to end.',
        days: 44
    },
    {
        title: 'Forever With You 💍',
        date: 'Oct 31',
        story: 'Nour, I want to spend my life making you happy. You\'re my today and all my tomorrows. I love you more than words can say.',
        days: 0
    }
];

// ===== SCREEN MANAGEMENT =====
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
}

function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    screen.classList.remove('hidden');
}

// ===== GAME LOGIC =====
function startGame() {
    gameState.level = 'game';
    showScreen('game-screen');
    initGameBoard();
}

function initGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Create pairs
    const cards = [];
    memories.forEach((mem, idx) => {
        cards.push({ ...mem, pairId: idx });
        cards.push({ ...mem, pairId: idx });
    });
    
    // Shuffle
    cards.sort(() => Math.random() - 0.5);
    
    // Render cards
    cards.forEach((card, idx) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'game-card';
        cardEl.dataset.pairId = card.pairId;
        cardEl.textContent = '❓';
        cardEl.onclick = () => flipGameCard(cardEl, card);
        gameBoard.appendChild(cardEl);
    });
    
    gameState.matchedPairs = 0;
    gameState.score = 0;
    gameState.flipped = [];
    updateGameStats();
}

function flipGameCard(element, card) {
    if (gameState.locked || gameState.flipped.length > 1) return;
    if (element.classList.contains('matched')) return;
    
    element.classList.add('flipped');
    element.textContent = card.emoji;
    gameState.flipped.push({ element, card, pairId: card.pairId });
    
    if (gameState.flipped.length === 2) {
        gameState.locked = true;
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = gameState.flipped;
    
    if (first.pairId === second.pairId) {
        // Match!
        gameState.score += 10;
        gameState.matchedPairs++;
        first.element.classList.add('matched');
        second.element.classList.add('matched');
        createParticleBurst(first.element);
        
        setTimeout(() => {
            gameState.flipped = [];
            gameState.locked = false;
            updateGameStats();
            
            if (gameState.matchedPairs === 6) {
                completeLevel();
            }
        }, 600);
    } else {
        // No match
        setTimeout(() => {
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            first.element.textContent = '❓';
            second.element.textContent = '❓';
            gameState.flipped = [];
            gameState.locked = false;
        }, 800);
    }
}

function updateGameStats() {
    document.getElementById('match-count').textContent = gameState.matchedPairs;
    document.getElementById('score').textContent = gameState.score;
}

function completeLevel() {
    document.getElementById('level-complete').classList.remove('hidden');
}

function goToTimeline() {
    gameState.level = 'timeline';
    showScreen('timeline-screen');
    initTimeline();
}

// ===== TIMELINE =====
function initTimeline() {
    const timelineCards = document.getElementById('timeline-cards');
    timelineCards.innerHTML = '';
    
    timelineMemories.forEach((mem, idx) => {
        const card = document.createElement('div');
        card.className = 'timeline-card';
        card.innerHTML = `
            <div class="timeline-card-image" style="background-image: url('${idx + 1}.jfif')"></div>
            <div class="timeline-card-content">
                <h3>${mem.title}</h3>
                <p>${mem.story}</p>
                <div class="timeline-card-date">${mem.date}</div>
            </div>
        `;
        timelineCards.appendChild(card);
    });
}

function goToFinale() {
    gameState.level = 'finale';
    showScreen('finale-screen');
    initFinale();
}

// ===== FINALE =====
function initFinale() {
    createConfetti();
    animateBouquet();
}

// ===== ANIMATED BOUQUET =====
function animateBouquet() {
    const canvas = document.getElementById('bouquet-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Bouquet flower positions (arranged in beautiful formation) - MUCH BIGGER
    const flowers = [
        { x: 400, y: 250, angle: 0, delay: 0, color: '#ff6b9d' },           // hot pink center
        { x: 360, y: 180, angle: -30, delay: 0.1, color: '#ffa6c1' },       // light pink
        { x: 440, y: 180, angle: 30, delay: 0.2, color: '#ff6b9d' },        // hot pink
        { x: 320, y: 240, angle: -60, delay: 0.15, color: '#ffc1d9' },      // very light pink
        { x: 480, y: 240, angle: 60, delay: 0.25, color: '#ff8fab' },       // medium pink
        { x: 370, y: 320, angle: -45, delay: 0.2, color: '#ffb3d9' },       // soft pink
        { x: 430, y: 320, angle: 45, delay: 0.3, color: '#ff6b9d' },        // hot pink
        { x: 300, y: 300, angle: -90, delay: 0.25, color: '#ffc1d9' },      // very light pink
        { x: 500, y: 300, angle: 90, delay: 0.35, color: '#ffa6c1' },       // light pink
        { x: 400, y: 380, angle: -180, delay: 0.3, color: '#ff8fab' },      // medium pink
        { x: 350, y: 360, angle: -120, delay: 0.35, color: '#ffb3d9' },     // soft pink
        { x: 450, y: 360, angle: 120, delay: 0.4, color: '#ff6b9d' },       // hot pink
        { x: 380, y: 140, angle: -60, delay: 0.22, color: '#ff8fab' },      // top left
        { x: 420, y: 140, angle: -30, delay: 0.28, color: '#ffb3d9' },      // top right
    ];
    
    const stems = [];
    let animationStartTime = Date.now();
    
    function drawFlower(x, y, color, radius, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Petals
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(px, py, radius * 0.4, radius * 0.6, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Center
        ctx.fillStyle = '#fff9e6';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawStem(fromX, fromY, toX, toY, opacity) {
        ctx.strokeStyle = `rgba(76, 175, 80, ${opacity * 0.8})`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        
        // Curved stem
        const midX = (fromX + toX) / 2 + Math.random() * 30 - 15;
        const midY = (fromY + toY) / 2 + 40;
        ctx.quadraticCurveTo(midX, midY, toX, toY);
        ctx.stroke();
    }
    
    function animate() {
        const elapsed = Date.now() - animationStartTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        flowers.forEach((flower, idx) => {
            const flowerDelay = flower.delay * 1000;
            const flowerElapsed = elapsed - flowerDelay;
            
            if (flowerElapsed < 0) return;
            
            // Animation progress (0 to 1)
            const progress = Math.min(flowerElapsed / 800, 1);
            
            // Calculate position - flowers fly in from the sides
            const startX = flower.x + Math.cos(flower.angle * Math.PI / 180) * 250;
            const startY = flower.y + Math.sin(flower.angle * Math.PI / 180) * 250;
            
            // Easing function for smooth deceleration
            const easing = 1 - Math.pow(1 - progress, 3);
            
            const currentX = startX + (flower.x - startX) * easing;
            const currentY = startY + (flower.y - startY) * easing;
            
            // Scale animation - starts small, grows to full size
            const scale = Math.min(progress * 1.2, 1);
            const rotation = progress * Math.PI * 2;
            
            // Draw stem
            drawStem(currentX, currentY, 400, 500, progress);
            
            // Draw flower with BIGGER size
            ctx.save();
            ctx.globalAlpha = Math.min(progress, 1);
            drawFlower(currentX, currentY, flower.color, 32 * scale, rotation);
            ctx.restore();
        });
        
        // Continue animating while flowers are still arriving
        if (elapsed < flowers[flowers.length - 1].delay * 1000 + 800) {
            requestAnimationFrame(animate);
        } else {
            // Final draw
            flowers.forEach((flower) => {
                drawStem(flower.x, flower.y, 400, 500, 1);
                drawFlower(flower.x, flower.y, flower.color, 32, 0);
            });
        }
    }
    
    animate();
}

// ===== GIFT MODAL =====
function showGift() {
    document.getElementById('gift-modal').classList.remove('hidden');
}

function closeGift(event) {
    if (event && event.target.id !== 'gift-modal' && !event.target.classList.contains('modal-close')) {
        return;
    }
    document.getElementById('gift-modal').classList.add('hidden');
}

// ===== PARTICLE EFFECTS =====
function createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        createParticle(x, y);
    }
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const angle = (Math.random() * Math.PI * 2);
    const velocity = Math.random() * 5 + 3;
    const colors = ['#ffd6e8', '#ffb3d9', '#e8d5f2', '#d5e8f2'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${color}, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 400;
    `;
    
    document.body.appendChild(particle);
    
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    let px = x, py = y;
    
    const animationDuration = 800;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / animationDuration;
        
        if (progress >= 1) {
            particle.remove();
            return;
        }
        
        px += vx;
        py += vy;
        const opacity = 1 - progress;
        
        particle.style.transform = `translate(${px - x}px, ${py - y}px)`;
        particle.style.opacity = opacity;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== CONFETTI =====
function createConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const confettiPieces = 100;
    
    for (let i = 0; i < confettiPieces; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            opacity: Math.random() * 0.5 + 0.5,
            color: ['#ffd6e8', '#ffb3d9', '#e8d5f2', '#d5e8f2', '#pastel-blue'][Math.floor(Math.random() * 5)],
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 3 + 2
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach(c => {
            c.y += c.vy;
            c.x += c.vx;
            c.opacity -= 0.02;
            
            ctx.globalAlpha = c.opacity;
            ctx.fillStyle = c.color;
            ctx.fillRect(c.x, c.y, c.width, c.height);
        });
        
        ctx.globalAlpha = 1;
        
        if (confetti.some(c => c.opacity > 0)) {
            requestAnimationFrame(animateConfetti);
        }
    }
    
    animateConfetti();
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    showScreen('intro-screen');
});

window.addEventListener('resize', () => {
    if (gameState.level === 'finale') {
        const canvas = document.getElementById('confetti-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
