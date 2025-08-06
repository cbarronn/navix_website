// Fully Dynamic Banner - Auto-detects all images in the images folder
class AutoDynamicBanner {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.bannerContainer = null;
        this.autoSlideInterval = null;
        this.imageFiles = [];
        this.slideData = [];
        this.isLoading = true;
        
        this.init();
    }

    async init() {
        await this.loadImagesFromFolder();
        this.createBannerStructure();
        this.setupEventListeners();
        this.preloadImages();
        this.startAutoSlide();
        this.isLoading = false;
    }

    async loadImagesFromFolder() {
        try {
            // Try to get the list of images from the server
            const response = await fetch('images/');
            const text = await response.text();
            
            // Parse HTML directory listing to extract image files
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = doc.querySelectorAll('a[href]');
            
            this.imageFiles = [];
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && this.isImageFile(href) && !href.includes('..')) {
                    this.imageFiles.push(href);
                }
            });
            
            // If directory listing doesn't work, fallback to trying common image patterns
            if (this.imageFiles.length === 0) {
                await this.fallbackImageDetection();
            }
            
            // Sort images naturally (1, 2, 3... instead of 1, 10, 11, 2...)
            this.imageFiles.sort((a, b) => {
                const aNum = this.extractNumber(a);
                const bNum = this.extractNumber(b);
                return aNum - bNum;
            });
            
            // Generate slide data for each image
            this.generateSlideData();
            
            console.log(`Found ${this.imageFiles.length} images:`, this.imageFiles);
            
        } catch (error) {
            console.error('Error loading images from folder:', error);
            // Fallback to the images we know exist
            await this.fallbackImageDetection();
        }
    }
    
    async fallbackImageDetection() {
        // Try to detect images by attempting to load them
        const possibleImages = [
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
        
        this.imageFiles = [];
        
        for (const imageName of possibleImages) {
            try {
                const response = await fetch(`images/${imageName}`, { method: 'HEAD' });
                if (response.ok) {
                    this.imageFiles.push(imageName);
                }
            } catch (error) {
                // Image doesn't exist, skip it
                console.log(`Image not found: ${imageName}`);
            }
        }
        
        // If still no images found, try a more comprehensive search
        if (this.imageFiles.length === 0) {
            for (let i = 1; i <= 36; i++) {
                const imageName = `Diseño sin título.zip - ${i}.png`;
                try {
                    const response = await fetch(`images/${imageName}`, { method: 'HEAD' });
                    if (response.ok) {
                        this.imageFiles.push(imageName);
                    }
                } catch (error) {
                    // Continue checking other numbers
                }
            }
        }
    }

    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const lowerFilename = filename.toLowerCase();
        return imageExtensions.some(ext => lowerFilename.endsWith(ext)) && 
               !lowerFilename.includes('.ds_store');
    }
    
    extractNumber(filename) {
        const match = filename.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    
    generateSlideData() {
        const serviceTemplates = [
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
            { title: 'Navix Consulting', description: 'Tu socio tecnológico de confianza' }
        ];
        
        this.slideData = [];
        for (let i = 0; i < this.imageFiles.length; i++) {
            const template = serviceTemplates[i % serviceTemplates.length];
            this.slideData.push({
                title: template.title,
                description: template.description
            });
        }
    }

    createBannerStructure() {
        this.bannerContainer = document.querySelector('.banner-container');
        if (!this.bannerContainer) {
            console.error('Banner container not found');
            return;
        }

        // Clear existing content
        this.bannerContainer.innerHTML = '';
        
        // Show loading message if no images found
        if (this.imageFiles.length === 0) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'banner-loading';
            loadingDiv.innerHTML = '<p>Cargando imágenes...</p>';
            this.bannerContainer.appendChild(loadingDiv);
            return;
        }

        // Create slides dynamically for all found images
        this.imageFiles.forEach((imageFile, index) => {
            const slide = document.createElement('div');
            slide.className = 'banner-slide';
            slide.style.transform = `translateX(${index * 100}%)`;

            const img = document.createElement('img');
            img.src = `images/${imageFile}`;
            img.alt = this.slideData[index]?.title || `Banner Image ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            
            // Add error handling for individual images
            img.onerror = () => {
                console.warn(`Failed to load image: ${imageFile}`);
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
        
        // Create slide indicators after slides are created
        if (this.imageFiles.length > 1) {
            this.createSlideIndicators();
        }
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
        if (this.imageFiles.length === 0) return;
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlidePosition();
    }

    goToPrevSlide() {
        if (this.imageFiles.length === 0) return;
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        this.slides.forEach((slide, index) => {
            const offset = (index - this.currentSlide) * 100;
            slide.style.transform = `translateX(${offset}%)`;
            slide.style.opacity = index === this.currentSlide ? '1' : '0.7';
        });
        
        if (document.querySelector('.slide-indicators')) {
            this.updateSlideIndicators();
        }
    }

    preloadImages() {
        if (this.imageFiles.length === 0) return;
        
        const preloadCount = Math.min(3, this.imageFiles.length);
        for (let i = 1; i <= preloadCount; i++) {
            const nextIndex = (this.currentSlide + i) % this.imageFiles.length;
            const img = new Image();
            img.src = `images/${this.imageFiles[nextIndex]}`;
            
            img.onerror = () => {
                console.warn(`Failed to preload image: ${this.imageFiles[nextIndex]}`);
            };
        }
    }

    startAutoSlide() {
        if (this.imageFiles.length <= 1) return;
        
        this.pauseAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.goToNextSlide();
            this.preloadImages();
        }, 4000);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    createSlideIndicators() {
        const bannerFlash = document.querySelector('.banner-flash');
        let indicatorsContainer = document.querySelector('.slide-indicators');
        
        if (indicatorsContainer) {
            indicatorsContainer.remove();
        }
        
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slide-indicators';
        
        // For smaller sets of images, show all dots
        const maxDots = Math.min(this.imageFiles.length, 15);
        const step = Math.max(1, Math.floor(this.imageFiles.length / maxDots));
        
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
    
    updateSlideIndicators() {
        const dots = document.querySelectorAll('.slide-dot');
        const maxDots = Math.min(this.imageFiles.length, 15);
        const step = Math.max(1, Math.floor(this.imageFiles.length / maxDots));
        
        dots.forEach((dot, index) => {
            const slideIndex = index * step;
            dot.classList.toggle('active', 
                this.currentSlide >= slideIndex && 
                this.currentSlide < slideIndex + step
            );
        });
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlidePosition();
    }
    
    // Method to refresh images (useful if images are updated)
    async refreshImages() {
        this.pauseAutoSlide();
        await this.loadImagesFromFolder();
        this.createBannerStructure();
        this.setupEventListeners();
        this.preloadImages();
        this.startAutoSlide();
    }
}

// Initialize banner when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const banner = new AutoDynamicBanner();
    
    // Make banner globally available
    window.autoDynamicBanner = banner;
    
    // Optional: Add a refresh button for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development mode: Use window.autoDynamicBanner.refreshImages() to reload images');
    }
});

// Enhanced CSS for the auto-dynamic banner
const style = document.createElement('style');
style.textContent = `
    .banner-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
        background: linear-gradient(135deg, #2c3e50, #3498db);
        color: white;
        font-size: 1.2rem;
    }
    
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

    .slide-indicators {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 10;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 300px;
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
            max-width: 250px;
        }
        
        .slide-dot {
            width: 10px;
            height: 10px;
        }
    }
`;
document.head.appendChild(style);
