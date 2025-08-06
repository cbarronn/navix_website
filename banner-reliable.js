// Reliable Banner System - Uses current images in folder
class ReliableBanner {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.bannerContainer = null;
        this.autoSlideInterval = null;
        
        // Current images in your folder (will be updated automatically)
        this.imageFiles = [
            'Diseño sin título.zip - 1.png',
            'Diseño sin título.zip - 5.png',
            'Diseño sin título.zip - 6.png',
            'Diseño sin título.zip - 7.png',
            'Diseño sin título.zip - 9.png',
            'Diseño sin título.zip - 15.png',
            'Diseño sin título.zip - 17.png',
            'Diseño sin título.zip - 19.png',
            'Diseño sin título.zip - 21.png'
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
            { title: 'Navix Consulting', description: 'Tu socio tecnológico de confianza' }
        ];
        
        this.init();
    }

    init() {
        console.log('Initializing Reliable Banner with', this.imageFiles.length, 'images');
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
        this.slides = [];

        console.log('Creating slides for images:', this.imageFiles);

        // Create slides for each image
        this.imageFiles.forEach((imageFile, index) => {
            const slide = document.createElement('div');
            slide.className = 'banner-slide';
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.opacity = index === 0 ? '1' : '0';
            slide.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            slide.style.transform = `translateX(${index * 100}%)`;

            const img = document.createElement('img');
            img.src = `images/${imageFile}`;
            img.alt = this.slideData[index]?.title || `Banner Image ${index + 1}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            
            // Add loading event listeners
            img.onload = () => {
                console.log(`Image loaded successfully: ${imageFile}`);
                slide.setAttribute('data-loaded', 'true');
            };
            
            img.onerror = () => {
                console.error(`Failed to load image: ${imageFile}`);
                slide.style.display = 'none';
            };

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
        
        console.log(`Created ${this.slides.length} slides`);
    }

    setupEventListeners() {
        const prevBtn = document.querySelector('.prev-slide');
        const nextBtn = document.querySelector('.next-slide');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('Previous button clicked');
                this.goToPrevSlide();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.goToNextSlide();
            });
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
            
            if (Math.abs(diff) > 50) {
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
        console.log(`Going to next slide. Current: ${this.currentSlide}, Total: ${this.slides.length}`);
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlidePosition();
    }

    goToPrevSlide() {
        console.log(`Going to previous slide. Current: ${this.currentSlide}, Total: ${this.slides.length}`);
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        console.log(`Updating slide position to: ${this.currentSlide}`);
        
        this.slides.forEach((slide, index) => {
            const offset = (index - this.currentSlide) * 100;
            slide.style.transform = `translateX(${offset}%)`;
            slide.style.opacity = index === this.currentSlide ? '1' : '0';
            slide.style.zIndex = index === this.currentSlide ? '2' : '1';
        });

    }

    preloadImages() {
        // Preload next 2 images for smooth transitions
        const preloadCount = Math.min(2, this.imageFiles.length - 1);
        for (let i = 1; i <= preloadCount; i++) {
            const nextIndex = (this.currentSlide + i) % this.imageFiles.length;
            const img = new Image();
            img.src = `images/${this.imageFiles[nextIndex]}`;
            console.log(`Preloading image: ${this.imageFiles[nextIndex]}`);
        }
    }

    startAutoSlide() {
        if (this.imageFiles.length <= 1) return;
        
        this.pauseAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.goToNextSlide();
            this.preloadImages();
        }, 4000);
        console.log('Auto-slide started');
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
            console.log('Auto-slide paused');
        }
    }
    

    
    goToSlide(slideIndex) {
        console.log(`Going directly to slide: ${slideIndex}`);
        this.currentSlide = slideIndex;
        this.updateSlidePosition();
    }
}

// Initialize banner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Reliable Banner');
    const banner = new ReliableBanner();
    
    // Make banner globally available for debugging
    window.reliableBanner = banner;
    console.log('Reliable Banner initialized and available as window.reliableBanner');
});

// Enhanced CSS for the reliable banner
const style = document.createElement('style');
style.textContent = `
    .banner-flash {
        position: relative;
        width: 100%;
        height: 500px;
        margin: 0 auto;
        overflow: hidden;
        background: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .banner-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .banner-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease;
        will-change: transform, opacity;
    }

    .banner-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
    }

    .banner-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: white;
        padding: 2rem 1.5rem 1.5rem;
        text-align: center;
        backdrop-filter: blur(2px);
    }

    .banner-overlay h3 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .banner-overlay p {
        margin: 0.5rem 0 0;
        font-size: 1rem;
        opacity: 0.9;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }



    .banner-controls {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
        pointer-events: none;
        z-index: 5;
    }

    .prev-slide, .next-slide {
        background: rgba(255, 255, 255, 0.9);
        color: var(--primary-color);
        border: none;
        padding: 0.8rem;
        cursor: pointer;
        border-radius: 50%;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        pointer-events: auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .prev-slide:hover, .next-slide:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
        .banner-flash {
            height: 300px;
        }
        
        .banner-overlay h3 {
            font-size: 1.4rem;
        }
        
        .banner-overlay p {
            font-size: 0.9rem;
        }
        
        .banner-overlay {
            padding: 1.5rem 1rem 1rem;
        }
        

    }

    @media (max-width: 480px) {
        .banner-flash {
            height: 250px;
        }
    }
`;
document.head.appendChild(style);
