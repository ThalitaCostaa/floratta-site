// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let autoSlideInterval;

function goToSlide(slideIndex) {
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Add active class to new slide and indicator
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    goToSlide(prevIndex);
}

// Detecta se é um dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

function startAutoSlide() {
    // Limpa qualquer intervalo existente primeiro
    clearInterval(autoSlideInterval);
    // Define intervalo baseado no tipo de dispositivo
    const interval = isMobileDevice() ? 5000 : 4000; // 4s no desktop, 5s no mobile
    autoSlideInterval = setInterval(nextSlide, interval);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Start auto-advance carousel
startAutoSlide();

// Garantir que o carrossel inicie após carregamento completo da página
window.addEventListener('load', async function() {
    startAutoSlide();
    
    // Verificar se há hash na URL e rolar para a seção correta
    if (window.location.hash) {
        // Aguardar que os produtos sejam carregados antes de fazer scroll
        await new Promise(resolve => setTimeout(resolve, 1000));
        smoothScrollToAnchor(window.location.hash);
    }
});

// Pause auto-slide on hover apenas em dispositivos móveis
const heroSection = document.querySelector('.hero');

// Só pausa o carrossel no hover se for dispositivo móvel
if (isMobileDevice()) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
}

// Listener para redimensionamento da janela - reinicia o carrossel com intervalo correto
window.addEventListener('resize', function() {
    startAutoSlide();
}); 