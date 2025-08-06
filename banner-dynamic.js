// Dynamic Banner with Image Optimization
class DynamicBanner {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.bannerContainer = null;
        this.slideContainer = null;
        this.autoSlideInterval = null;
        this.imageFiles = [
            'Diseño sin título.zip - 1.png',
            'Diseño sin título.zip - 2.png',
            'Diseño sin título.zip - 3.png',
            'Diseño sin título.zip - 4.png',
            'Diseño sin título.zip - 5.png',
            'Diseño sin título.zip - 6.png',
            'Diseño sin título.zip - 7.png',
            'Diseño sin título.zip - 8.png',
            'Diseño sin título.zip - 9.png',
            'Diseño sin título.zip - 10.png'
        ];
        this.slideData = [
            { title: 'ERP Dynamics NAV', description: 'Optimización de procesos empresariales' },
            { title: 'Infraestructura en la Nube', description: 'Soluciones escalables y seguras' },
            { title: 'Transformación Digital', description: 'Innovación tecnológica para tu negocio' },
            { title: 'Consultoría IT', description: 'Asesoramiento especializado en tecnología' },
            { title: 'Desarrollo de Software', description: 'Soluciones personalizadas para tu empresa' },
            { title: 'Seguridad Informática', description: 'Protección integral de datos' },
            { title: 'Análisis de Datos', description: 'Inteligencia de negocio avanzada' },
            { title: 'Automatización', description: 'Procesos eficientes y automatizados' },
            { title: 'Soporte Técnico', description: 'Asistencia especializada 24/7' },
            { title: 'Capacitación', description: 'Formación en nuevas tecnologías' }
        ];
        this.init();
    }

    init() {
        this.createBannerStructure();
        this.setupEventListeners();
        this.preloadImages();
        this.startAutoSlide();
    }

    createBannerStructure() {
        this.bannerContainer = document.querySelector('.banner-container');
        if (!this.bannerContainer) {
            console.error('Banner container not found');
            return;
        }

        // Clear existing content
        this.bannerContainer.innerHTML = '';

        // Create slides dynamically
        this.imageFiles.forEach((imageFile, index) => {
            const slide = document.createElement('div');
            slide.className = 'banner-slide';
            slide.style.transform = `translateX(${index * 100}%)`;

            const img = document.createElement('img');
            img.src = `images/${imageFile}`;
            img.alt = this.slideData[index]?.title || `Banner ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy'; // Load first image immediately
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';

            const overlay = document.createElement('div');
            overlay.className = 'banner-overlay';
            overlay.innerHTML = `
                <h3>${this.slideData[index]?.title || 'Navix Consulting'}</h3>
                <p>${this.slideData[index]?.description || 'Soluciones tecnológicas avanzadas'}</p>
            `;

            slide.appendChild(img);
            slide.appendChild(overlay);
            this.bannerContainer.appendChild(slide);
            this.slides.push(slide);
        });
    }

    setupEventListeners() {
        const prevBtn = document.querySelector('.prev-slide');
        const nextBtn = document.querySelector('.next-slide');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPrevSlide());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToNextSlide());
        }

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        this.bannerContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.bannerContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.goToNextSlide();
                } else {
                    this.goToPrevSlide();
                }
            }
        });

        // Pause auto-slide on hover
        this.bannerContainer.addEventListener('mouseenter', () => {
            this.pauseAutoSlide();
        });

        this.bannerContainer.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    goToNextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlidePosition();
    }

    goToPrevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        this.slides.forEach((slide, index) => {
            const offset = (index - this.currentSlide) * 100;
            slide.style.transform = `translateX(${offset}%)`;
            slide.style.opacity = index === this.currentSlide ? '1' : '0.7';
        });
    }

    preloadImages() {
        // Preload next few images for smooth transitions
        const preloadCount = Math.min(3, this.imageFiles.length);
        for (let i = 1; i <= preloadCount; i++) {
            const nextIndex = (this.currentSlide + i) % this.imageFiles.length;
            const img = new Image();
            img.src = `images/${this.imageFiles[nextIndex]}`;
        }
    }

    startAutoSlide() {
        this.pauseAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.goToNextSlide();
            this.preloadImages();
        }, 4000); // 4 seconds per slide
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    // Method to add new images dynamically
    addImage(imageFile, title, description) {
        this.imageFiles.push(imageFile);
        this.slideData.push({ title, description });
        this.createBannerStructure(); // Recreate with new image
    }

    // Method to remove image
    removeImage(index) {
        if (index >= 0 && index < this.imageFiles.length) {
            this.imageFiles.splice(index, 1);
            this.slideData.splice(index, 1);
            this.createBannerStructure();
        }
    }
}

// Initialize banner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const banner = new DynamicBanner();
    
    // Make banner globally available for debugging
    window.dynamicBanner = banner;
});

// CSS optimization for images
const style = document.createElement('style');
style.textContent = `
    .banner-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.3s ease;
        will-change: transform;
    }

    .banner-slide {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
        will-change: transform, opacity;
    }

    /* Optimize for different screen sizes */
    @media (max-width: 768px) {
        .banner-slide img {
            object-position: center top;
        }
    }

    /* Preload optimization */
    .banner-slide img[loading="lazy"] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .banner-slide img[loading="lazy"].loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
