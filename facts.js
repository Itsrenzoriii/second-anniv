const cardStack = document.querySelector('.card-stack');
const cards = Array.from(document.querySelectorAll('.card'));

let isDragging = false;
let startX = 0;
let currentX = 0;
let currentCard = null;

const SWIPE_THRESHOLD = 80;

function updateCardStack() {
    cards.forEach((card, index) => {
        card.style.zIndex = cards.length - index;
        const offset = index * 3;
        const scale = 1 - index * 0.025;
        const opacity = 1 - index * 0.08;
        card.style.transform = `translateY(${offset}px) scale(${Math.max(scale, 0.72)})`;
        card.style.opacity = Math.max(opacity, 0.25);
    });
}

function moveToBack(card) {
    const parent = card.parentNode;
    parent.appendChild(card);
    cards.push(cards.shift());
    updateCardStack();
}

function onPointerDown(e) {
    if (currentCard) return;
    currentCard = cards[0];
    if (!currentCard) return;

    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    currentX = startX;

    currentCard.style.transition = 'none';
}

function onPointerMove(e) {
    if (!isDragging || !currentCard) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    currentX = clientX;

    const rotation = deltaX * 0.008;
    const flipY = deltaX * 0.015;
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg) rotateY(${flipY}deg)`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onPointerUp(e) {
    if (!isDragging || !currentCard) return;

    isDragging = false;
    const deltaX = currentX - startX;

    currentCard.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        const direction = deltaX > 0 ? 1 : -1;
        const variant = getRandomInt(1, 4);
        let flipStr = '';

        if (variant === 1) {
            // Sideways Y-flip (original)
            flipStr = `translateX(${direction * 180}px) rotateY(${direction * 160}deg) scale(0.92)`;
        } else if (variant === 2) {
            // Upward X-flip
            flipStr = `translateY(-140px) rotateX(${direction * -140}deg) scale(0.88)`;
        } else if (variant === 3) {
            // Tumble Z-twist diagonal
            flipStr = `translate(${direction * 120}px, -80px) rotateZ(${direction * 360}deg) rotateY(30deg) scale(0.90)`;
        } else {
            // Double flip Y+X
            flipStr = `translateX(${direction * 160}px) rotateY(${direction * 120}deg) rotateX(60deg) scale(0.94)`;
        }

        currentCard.style.transform = flipStr;

        const duration = getRandomInt(400, 500);
        setTimeout(() => {
            currentCard.style.transition = 'none';
            currentCard.style.transform = 'translateX(0) rotate(0deg) rotateY(0deg) rotateX(0deg) rotateZ(0deg) scale(1)';
            currentCard.style.opacity = '1';
            moveToBack(currentCard);
            currentCard = null;
        }, duration);
    } else {
        currentCard.style.transform = 'translateX(0) rotate(0deg) rotateY(0deg)';
        currentCard = null;
    }
}

cardStack.addEventListener('mousedown', onPointerDown);
cardStack.addEventListener('touchstart', onPointerDown, { passive: true });

window.addEventListener('mousemove', onPointerMove);
window.addEventListener('touchmove', onPointerMove, { passive: true });

window.addEventListener('mouseup', onPointerUp);
window.addEventListener('touchend', onPointerUp);

// Shuffle and animate cards on page load
function shuffleAndAnimate() {
    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    // Re-append cards in shuffled order
    cards.forEach((card, index) => {
        cardStack.appendChild(card);
        card.style.transition = 'none';
        card.style.zIndex = cards.length - index;
        
        // Start from random positions off-screen
        const startX = (Math.random() - 0.5) * 400;
        const startY = -300 - Math.random() * 200;
        const startRot = (Math.random() - 0.5) * 180;
        
        card.style.transform = `translateX(${startX}px) translateY(${startY}px) rotate(${startRot}deg)`;
        card.style.opacity = '0';
        
        // Animate to final stacked position with delay
        setTimeout(() => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease';
            const offset = index * 3;
            const scale = 1 - index * 0.025;
            const opacity = 1 - index * 0.08;
            card.style.transform = `translateY(${offset}px) scale(${Math.max(scale, 0.72)})`;
            card.style.opacity = Math.max(opacity, 0.25);
        }, 100 + index * 80);
    });
    
    // Update cards array order after shuffle
    cards.length = 0;
    cards.push(...document.querySelectorAll('.card'));
    
    setTimeout(() => {
        updateCardStack();
    }, 100 + cards.length * 80 + 500);
}

shuffleAndAnimate();

