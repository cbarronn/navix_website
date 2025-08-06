// Carrusel de imágenes
const bannerContainer = document.querySelector('.banner-container');
const slides = document.querySelectorAll('.banner-slide');
const prevSlide = document.querySelector('.prev-slide');
const nextSlide = document.querySelector('.next-slide');
let currentSlide = 0;

// Función para mover al siguiente slide
function goToNextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlidePosition();
}

// Función para mover al slide anterior
function goToPrevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlidePosition();
}

// Actualizar la posición del carrusel
function updateSlidePosition() {
    bannerContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Event listeners para los botones
prevSlide.addEventListener('click', goToPrevSlide);
nextSlide.addEventListener('click', goToNextSlide);

// Iniciar el carrusel
updateSlidePosition();

// Agregar navegación automática (opcional)
setInterval(goToNextSlide, 5000);
