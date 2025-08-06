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
            'Diseño sin título.zip - 10.png',
            'Diseño sin título.zip - 11.png',
            'Diseño sin título.zip - 12.png',
            'Diseño sin título.zip - 13.png',
            'Diseño sin título.zip - 14.png',
            'Diseño sin título.zip - 15.png',
            'Diseño sin título.zip - 16.png',
            'Diseño sin título.zip - 17.png',
            'Diseño sin título.zip - 18.png',
            'Diseño sin título.zip - 19.png',
            'Diseño sin título.zip - 20.png',
            'Diseño sin título.zip - 21.png',
            'Diseño sin título.zip - 22.png',
            'Diseño sin título.zip - 23.png',
            'Diseño sin título.zip - 24.png',
            'Diseño sin título.zip - 25.png',
            'Diseño sin título.zip - 26.png',
            'Diseño sin título.zip - 27.png',
            'Diseño sin título.zip - 28.png',
            'Diseño sin título.zip - 29.png',
            'Diseño sin título.zip - 30.png',
            'Diseño sin título.zip - 31.png',
            'Diseño sin título.zip - 32.png',
            'Diseño sin título.zip - 33.png',
            'Diseño sin título.zip - 34.png',
            'Diseño sin título.zip - 35.png',
            'Diseño sin título.zip - 36.png'
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
            { title: 'Capacitación', description: 'Formación en nuevas tecnologías' },
            { title: 'Gestión de Proyectos', description: 'Metodologías ágiles y eficientes' },
            { title: 'Migración de Sistemas', description: 'Transición segura a nuevas plataformas' },
            { title: 'Business Intelligence', description: 'Análisis inteligente de información' },
            { title: 'Integración de Sistemas', description: 'Conectividad total entre plataformas' },
            { title: 'Optimización de Procesos', description: 'Eficiencia operacional maximizada' },
            { title: 'Soluciones Móviles', description: 'Aplicaciones para dispositivos móviles' },
            { title: 'E-Commerce', description: 'Plataformas de comercio electrónico' },
            { title: 'CRM Solutions', description: 'Gestión integral de clientes' },
            { title: 'Backup y Recuperación', description: 'Protección y continuidad de datos' },
            { title: 'Monitoreo de Sistemas', description: 'Supervisión continua de infraestructura' },
            { title: 'Virtualización', description: 'Optimización de recursos tecnológicos' },
            { title: 'Redes y Comunicaciones', description: 'Conectividad empresarial avanzada' },
            { title: 'Auditoría IT', description: 'Evaluación integral de sistemas' },
            { title: 'Compliance y Normativas', description: 'Cumplimiento de estándares regulatorios' },
            { title: 'DevOps', description: 'Desarrollo y operaciones integradas' },
            { title: 'Inteligencia Artificial', description: 'Soluciones basadas en IA' },
            { title: 'IoT Solutions', description: 'Internet de las cosas empresarial' },
            { title: 'Blockchain', description: 'Tecnología de cadena de bloques' },
            { title: 'Ciberseguridad Avanzada', description: 'Protección contra amenazas digitales' },
            { title: 'Disaster Recovery', description: 'Planes de recuperación ante desastres' },
            { title: 'Performance Tuning', description: 'Optimización de rendimiento de sistemas' },
            { title: 'Digital Workplace', description: 'Espacios de trabajo digitales modernos' },
            { title: 'API Management', description: 'Gestión de interfaces de programación' },
            { title: 'Microservicios', description: 'Arquitecturas de software modulares' },
            { title: 'Quality Assurance', description: 'Aseguramiento de calidad en software' },
            { title: 'Navix Consulting', description: 'Tu socio tecnológico de confianza' }
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
        
        // Create slide indicators after slides are created
        this.createSlideIndicators();
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
        // Update indicators if they exist
        if (document.querySelector('.slide-indicators')) {
            this.updateSlideIndicators();
        }
    }

    preloadImages() {
        // Preload next few images for smooth transitions
        // For large image sets, only preload a few at a time to manage memory
        const preloadCount = Math.min(5, this.imageFiles.length);
        for (let i = 1; i <= preloadCount; i++) {
            const nextIndex = (this.currentSlide + i) % this.imageFiles.length;
            const img = new Image();
            img.src = `images/${this.imageFiles[nextIndex]}`;
            
            // Add error handling for failed image loads
            img.onerror = () => {
                console.warn(`Failed to load image: ${this.imageFiles[nextIndex]}`);
            };
        }
    }

    startAutoSlide() {
        this.pauseAutoSlide();
        // With 36 images, use a slightly longer interval to allow users to appreciate each image
        this.autoSlideInterval = setInterval(() => {
            this.goToNextSlide();
            this.preloadImages();
        }, 5000); // 5 seconds per slide for better UX with many images
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
    
    // Create slide indicators for navigation
    createSlideIndicators() {
        const bannerFlash = document.querySelector('.banner-flash');
        let indicatorsContainer = document.querySelector('.slide-indicators');
        
        if (indicatorsContainer) {
            indicatorsContainer.remove();
        }
        
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slide-indicators';
        
        // Create dots for navigation (show every 4th slide for 36 images)
        const step = Math.max(1, Math.floor(this.imageFiles.length / 9));
        
        for (let i = 0; i < this.imageFiles.length; i += step) {
            const dot = document.createElement('button');
            dot.className = 'slide-dot';
            dot.setAttribute('data-slide', i);
            dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            indicatorsContainer.appendChild(dot);
        }
        
        bannerFlash.appendChild(indicatorsContainer);
    }
    
    // Update slide indicators
    updateSlideIndicators() {
        const dots = document.querySelectorAll('.slide-dot');
        const step = Math.max(1, Math.floor(this.imageFiles.length / 9));
        
        dots.forEach((dot, index) => {
            const slideIndex = index * step;
            dot.classList.toggle('active', 
                this.currentSlide >= slideIndex && 
                this.currentSlide < slideIndex + step
            );
        });
    }
    
    // Go to specific slide
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlidePosition();
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

    /* Slide Indicators */
    .slide-indicators {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 10;
    }

    .slide-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.7);
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    }

    .slide-dot:hover {
        background: rgba(255, 255, 255, 0.6);
        transform: scale(1.2);
    }

    .slide-dot.active {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(255, 255, 255, 1);
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
        .slide-indicators {
            bottom: 15px;
            gap: 6px;
        }
        
        .slide-dot {
            width: 10px;
            height: 10px;
        }
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
