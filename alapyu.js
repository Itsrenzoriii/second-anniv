const tracks = [
    { src: "music/spotifydown.com - 4 U.mp3", name: "4 U", artist: "Unknown Artist" },
    { src: "music/I'll Follow - Acoustic Version - Fancy Cars, SVRCINA.m4a", name: "I'll Follow (Acoustic Version)", artist: "Fancy Cars, SVRCINA" },
    { src: "music/Myself (Rosarrie & Adib Sin).mp3", name: "Myself", artist: "Rosarrie & Adib Sin" },
    { src: "music/Mac Mafia - Pasensya (Lyrics).mp3", name: "Pasensya", artist: "Mac Mafia" },
    { src: "music/better with you Virginia To Vegas (320K).mp3", name: "Better With You", artist: "Virginia To Vegas" },
    { src: "music/If I Could Tell Her - Ben Platt, Laura Dreyfuss.m4a", name: "If I Could Tell Her", artist: "Ben Platt, Laura Dreyfuss" },
    { src: "music/Jake Scott - Man Who Stays (Lyrics).mp3", name: "Man Who Stays", artist: "Jake Scott" },
    { src: "music/Jeremy Zucker - Cry with you (Official Lyric Video).mp3", name: "Cry With You", artist: "Jeremy Zucker" },
    { src: "music/Leading Role - Chris James.m4a", name: "Leading Role", artist: "Chris James" },
    { src: "music/AJ Mitchell - I Choose You (Official Audio).mp3", name: "I Choose You", artist: "AJ Mitchell" },
    { src: "music/Nightcore Escape Lyrics.mp3", name: "Escape", artist: "Nightcore" },
    { src: "music/Nightcore_-_Helplessly_-_(Lyrics)-mc.m4a", name: "Helplessly", artist: "Nightcore" },
    { src: "music/Nightcore_-_Long_Distance_Love_-_(Lyrics)-mc.mp3", name: "Long Distance Love", artist: "Nightcore" },
    { src: "music/spotifydown.com - Keep Your Head Up Princess.mp3", name: "Keep Your Head Up Princess", artist: "Unknown Artist" },
    { src: "music/spotifydown.com - One-Off.mp3", name: "One-Off", artist: "Unknown Artist" },
    { src: "music/X Lovers - Haunt You (Lyrics) ft. chloe moriondo (128K).m4a", name: "Haunt You", artist: "X Lovers, chloe moriondo" }
];

let currentTrack = 0;
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackName = document.getElementById('track-name');
const artistName = document.getElementById('artist-name');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// Envelope swipe logic
const envelope = document.getElementById('envelope');
let isEnvelopeDragging = false;
let envelopeStartX = 0;
let envelopeCurrentX = 0;
let envelopeOpened = false;

const ENVELOPE_THRESHOLD = 100;

function onEnvelopePointerDown(e) {
  if (envelopeOpened) return;
  isEnvelopeDragging = true;
  envelopeStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  envelopeCurrentX = envelopeStartX;
  envelope.style.transition = 'none';
}

function onEnvelopePointerMove(e) {
  if (!isEnvelopeDragging) return;
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const deltaX = clientX - envelopeStartX;
  envelopeCurrentX = clientX;
  const rotation = deltaX * 0.01;
  envelope.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
}

function onEnvelopePointerUp(e) {
  if (!isEnvelopeDragging) return;
  isEnvelopeDragging = false;
  const deltaX = envelopeCurrentX - envelopeStartX;
  envelope.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  if (Math.abs(deltaX) > ENVELOPE_THRESHOLD) {
    envelopeOpened = true;
    envelope.classList.add('opened');
    const dir = deltaX > 0 ? 1 : -1;
    envelope.style.transform = `translateX(${dir * 350}px) rotate(${dir * 15}deg) scale(0.9)`;
  } else {
    envelope.style.transform = 'translateX(0) rotate(0deg)';
  }
}

// Music player functions
function loadTrack(index) {
    currentTrack = index;
    audio.src = tracks[index].src;
    trackName.textContent = tracks[index].name;
    artistName.textContent = tracks[index].artist;
    audio.load();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '&#9208;';
    } else {
        audio.pause();
        playBtn.innerHTML = '&#9654;';
    }
}

// Avoid jerky UI updates / long-text selection on touch
audio.preload = 'metadata';


function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playBtn.innerHTML = '&#9208;';
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playBtn.innerHTML = '&#9208;';
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (!duration || Number.isNaN(duration)) return;

    const progressPercent = Math.max(0, Math.min(100, (currentTime / duration) * 100));
    progressBar.style.width = progressPercent + '%';

    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;
    if (duration) durationEl.textContent = durationMinutes + ':' + durationSeconds;

    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = '0' + currentSeconds;
    currentTimeEl.textContent = currentMinutes + ':' + currentSeconds;
}


function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Event listeners
envelope.addEventListener('mousedown', onEnvelopePointerDown);
envelope.addEventListener('touchstart', onEnvelopePointerDown, { passive: true });

window.addEventListener('mousemove', onEnvelopePointerMove);
window.addEventListener('touchmove', onEnvelopePointerMove, { passive: true });

window.addEventListener('mouseup', onEnvelopePointerUp);
window.addEventListener('touchend', onEnvelopePointerUp);

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextTrack);
progressContainer.addEventListener('click', setProgress);


// Randomize initial track selection on page load
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const shuffledTracks = shuffleArray([...tracks]);
tracks.length = 0;
tracks.push(...shuffledTracks);

loadTrack(0);

