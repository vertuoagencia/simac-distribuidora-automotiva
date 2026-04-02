
function initPromoSlider() {
    const sliderTrack = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dots = document.querySelectorAll('.slider-dot');

    if (!sliderTrack || !slides.length) return;

    let currentSlide = 0;
    let isAnimating = false;
    let autoSlideInterval;

    function updateSlider() {
        if (isAnimating) return;
        isAnimating = true;

        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Move slider track
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!isAnimating) {
                nextSlide();
                resetAutoSlide();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!isAnimating) {
                prevSlide();
                resetAutoSlide();
            }
        });
    }

    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating && index !== currentSlide) {
                goToSlide(index);
                resetAutoSlide();
            }
        });
    });

    // Auto-advance functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Start auto-advance
    startAutoSlide();

    // Initialize first slide
    updateSlider();
}

// ======================
// Brands Carousel
// ======================

function initBrandsCarousel() {
    const track = document.querySelector('.brands-track');
    const items = document.querySelectorAll('.brand-item');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track || !items.length || !dotsContainer) return;

    let currentSlide = 0;
    let itemsPerSlide = getItemsPerSlide();
    let totalSlides = Math.ceil(items.length / itemsPerSlide);
    let isAnimating = false;
    let autoAdvanceInterval;

    // Function to determine items per slide based on screen size
    function getItemsPerSlide() {
        const width = window.innerWidth;
        if (width <= 767) return 2;   // Mobile: 2 items
        if (width <= 1023) return 3;  // Tablet: 3 items
        return 5;                     // Desktop: 5 items
    }

    // Update layout based on screen size
    function updateLayout() {
        const newItemsPerSlide = getItemsPerSlide();
        const newTotalSlides = Math.ceil(items.length / newItemsPerSlide);

        if (newItemsPerSlide !== itemsPerSlide || newTotalSlides !== totalSlides) {
            itemsPerSlide = newItemsPerSlide;
            totalSlides = newTotalSlides;

            // Update item flex basis
            items.forEach(item => {
                item.style.flex = `0 0 ${100 / itemsPerSlide}%`;
            });

            // Recreate dots
            createDots();

            // Reset to first slide if current slide is out of bounds
            if (currentSlide >= totalSlides) {
                currentSlide = 0;
            }

            goToSlide(currentSlide);
        }
    }

    // Set initial item widths
    function initializeItems() {
        items.forEach(item => {
            item.style.flex = `0 0 ${100 / itemsPerSlide}%`;
        });
    }

    // Create dots function
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => {
                if (!isAnimating) goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(slideIndex) {
        if (isAnimating || slideIndex === currentSlide) return;

        isAnimating = true;
        currentSlide = slideIndex;
        const offset = -(slideIndex * 100);
        track.style.transform = `translateX(${offset}%)`;
        updateDots();

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!isAnimating) {
                prevSlide();
                resetAutoAdvance();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!isAnimating) {
                nextSlide();
                resetAutoAdvance();
            }
        });
    }

    // Auto advance functionality
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, 4000);
    }

    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }

    function resetAutoAdvance() {
        stopAutoAdvance();
        startAutoAdvance();
    }

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoAdvance);
    track.addEventListener('mouseleave', startAutoAdvance);

    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateLayout();
        }, 250);
    });

    // Initialize everything
    initializeItems();
    createDots();
    startAutoAdvance();
    goToSlide(0);
}

// ======================
// Initialize on DOM Ready
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page
    const isHomePage = document.querySelector('.promo-slider') !== null;

    if (isHomePage) {
        // Initialize promotional slider
        initPromoSlider();

        // Initialize brands carousel
        initBrandsCarousel();

        console.log('Home page elements initialized');
    }
});
