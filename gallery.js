const images = [
    "realimage/IMG_20251117_003742_005.jpg",
    "realimage/IMG_20251117_003844_737.jpg",
    
    "realimage/IMG_20260114_231425_133.jpg",
    
    "realimage/IMG_20260214_093621_495.jpg",
    "realimage/IMG_20260311_205115_474.jpg",
    "realimage/IMG_20260312_131120_074.jpg",
    "realimage/IMG_20260312_140608_670.jpg",
    
    "realimage/IMG_20260417_004757_781.jpg",
    "realimage/IMG_20260417_004910_617.jpg",
    
    "realimage/IMG_20260417_005001_759.jpg",
    
    "realimage/IMG_20260417_005028_172.jpg",
    "realimage/IMG_20260417_005112_352.jpg",
    
    
    
    "realimage/IMG_20260430_193052_682.WEBP",
    "realimage/IMG_20260430_193052_727.WEBP",
    
  
    "realimage/IMG_20260502_131504_139.jpg",
    "realimage/IMG_20260502_131537_345.jpg",
    "realimage/IMG_20260502_131551_055.jpg",
    
    "realimage/IMG_20260502_131642_511.jpg",
    "realimage/IMG_20260502_131902_079.jpg",
    "realimage/IMG_20260502_132053_972.jpg",
    "realimage/IMG_20260502_132117_072.jpg",
    "realimage/IMG_20260502_132126_211.jpg",
    "realimage/IMG_20260502_132212_754.jpg",
    
    "realimage/IMG_20260502_132624_002.jpg",
    
    "realimage/IMG_20260502_132647_032.jpg",
    "realimage/IMG_20260502_132659_254.jpg",
    "realimage/IMG_20260502_132702_293.jpg",
    "realimage/IMG_20260502_132736_615.jpg",
    "realimage/IMG_20260502_132824_804.jpg",
    "realimage/IMG_20260502_132837_098.jpg",
    "realimage/IMG_20260502_132847_313.jpg",
    "realimage/IMG_20260502_132918_309.jpg",
    "realimage/IMG_20260502_132920_412.jpg",
    
    "realimage/IMG_20260502_132941_141.jpg",
   
    "realimage/IMG_20260502_133038_528.jpg",
    "realimage/IMG_20260502_133046_249.jpg",
    "realimage/IMG_20260502_133052_839.jpg",
    "realimage/IMG_20260502_133059_543.jpg",
    
    "realimage/IMG_20260502_133245_060.jpg",
    "realimage/sketch1763175676600.png"
];

let currentIndex = 0;

const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Load images into the gallery as 3D cards
function loadGallery() {
    images.forEach((src, index) => {
        // Create card container
        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        // Assign different duration based on index (5s to 12s)
        const duration = 5 + (index % 8); // Cycles through 5-12 seconds
        card.style.setProperty('--duration', duration + 's');
        
        // Random pin position (between 30% and 70% for variety)
        const pinPosition = 30 + Math.random() * 40; // 30-70%
        card.style.setProperty('--pin-position', pinPosition + '%');
        
        // Random pin angle (tilted between -15deg and 15deg)
        const pinAngle = -15 + Math.random() * 30; // -15 to 15 degrees
        card.style.setProperty('--pin-angle', pinAngle + 'deg');
        
        // Create card inner
        const cardInner = document.createElement('div');
        cardInner.className = 'gallery-card-inner';
        
        // Create card front
        const cardFront = document.createElement('div');
        cardFront.className = 'gallery-card-front';
        
        // Create image
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Memory ${index + 1}`;
        img.className = 'gallery-image';
        
        // Add click event
        card.addEventListener('click', () => openLightbox(index));
        
        // Assemble the card
        cardFront.appendChild(img);
        cardInner.appendChild(cardFront);
        card.appendChild(cardInner);
        galleryGrid.appendChild(card);
    });
}

function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
}

function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex];
}

// Event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
});

// Initialize
loadGallery();
