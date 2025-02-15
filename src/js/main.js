// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Form validation and submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(this);
        const bookingData = Object.fromEntries(formData);
        
        // Validate dates
        const pickupDate = new Date(bookingData.pickupDate);
        const dropDate = new Date(bookingData.dropDate);
        
        if (pickupDate >= dropDate) {
            alert('Drop date must be after pickup date');
            return;
        }
        
        // Validate age
        if (bookingData.age === 'no') {
            alert('You must be 18 or older to rent a bike');
            return;
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success animation
        submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Success!';
        submitBtn.classList.remove('btn-success');
        submitBtn.classList.add('btn-success', 'pulse');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('pulse');
            submitBtn.disabled = false;
        }, 2000);
        
        this.reset();
    } catch (error) {
        submitBtn.innerHTML = '<i class="bi bi-x-circle-fill me-2"></i>Error';
        submitBtn.classList.add('btn-danger');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('btn-danger');
            submitBtn.disabled = false;
        }, 2000);
    }
});

// Navbar scroll behavior
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Initialize any Bootstrap components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Add animation classes
    document.querySelectorAll('.card, .booking-card, .section-title').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    animateOnScroll();

    // Ensure text slides are properly sized
    function adjustTextSlideHeight() {
        const textSlides = document.querySelectorAll('.text-slide');
        const carousel = document.querySelector('.text-carousel');
        let maxHeight = 0;

        // Reset carousel height
        carousel.style.height = 'auto';

        // Find the tallest slide
        textSlides.forEach(slide => {
            const height = slide.offsetHeight;
            maxHeight = Math.max(maxHeight, height);
        });

        // Set carousel height to match tallest slide
        carousel.style.height = `${maxHeight}px`;
    }

    // Run on load and resize
    adjustTextSlideHeight();
    window.addEventListener('resize', adjustTextSlideHeight);

    // Text Carousel functionality
    const carousel = document.querySelector('.text-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.text-slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        let currentSlide = 0;

        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev');
                if (index === currentSlide) {
                    slide.classList.add('active');
                } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                    slide.classList.add('prev');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlides();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlides();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Auto advance (optional)
        let autoAdvance = setInterval(nextSlide, 5000);

        // Pause auto-advance on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoAdvance));
        carousel.addEventListener('mouseleave', () => {
            autoAdvance = setInterval(nextSlide, 5000);
        });

        // Initial setup
        updateSlides();
    }

    // Parallax scrolling effect
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5; // Adjust this value to control parallax speed
        
        if (window.innerWidth > 768) { // Only apply on desktop
            hero.style.backgroundPositionY = `${rate}px`;
        }
    });

    // Number animation for statistics
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // Animation duration in milliseconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateNumber = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            
            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    }

    // Initialize number animation
    animateNumbers();

    // Hero Slider Functionality
    const slider = {
        container: document.querySelector('.hero-slider'),
        slides: document.querySelectorAll('.hero-slide'),
        prevBtn: document.querySelector('.slider-arrow.prev'),
        nextBtn: document.querySelector('.slider-arrow.next'),
        indicators: document.querySelector('.slider-indicators'),
        currentSlide: 0,
        slideCount: document.querySelectorAll('.hero-slide').length,
        interval: null,

        init() {
            // Create indicators
            this.createIndicators();
            
            // Set up initial slide
            this.showSlide(0);
            
            // Add event listeners
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Start autoplay
            this.startAutoplay();
            
            // Pause on hover
            this.container.addEventListener('mouseenter', () => this.stopAutoplay());
            this.container.addEventListener('mouseleave', () => this.startAutoplay());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });
        },

        createIndicators() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('indicator');
                dot.addEventListener('click', () => this.showSlide(index));
                this.indicators.appendChild(dot);
            });
        },

        showSlide(index) {
            // Remove active class from all slides
            this.slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.display = 'none';
            });
            
            // Remove active class from all indicators
            const dots = this.indicators.querySelectorAll('.indicator');
            dots.forEach(dot => dot.classList.remove('active'));

            // Show current slide with fade effect
            this.currentSlide = index;
            this.slides[index].style.display = 'block';
            setTimeout(() => {
                this.slides[index].style.opacity = '1';
                this.slides[index].classList.add('active');
            }, 50);
            
            // Update indicator
            dots[index].classList.add('active');
        },

        nextSlide() {
            const next = (this.currentSlide + 1) % this.slideCount;
            this.showSlide(next);
        },

        prevSlide() {
            const prev = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
            this.showSlide(prev);
        },

        startAutoplay() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.interval = setInterval(() => this.nextSlide(), 1000); // Changed to 1 second
        },

        stopAutoplay() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    };

    // Initialize slider
    slider.init();

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    const pickupTime = document.querySelector('.time-select-wrapper:first-child .time-select');
    const dropTime = document.querySelector('.time-select-wrapper:last-child .time-select');
    
    pickupTime.addEventListener('change', function() {
        const selectedTime = this.value;
        const selectedIndex = this.selectedIndex;
        
        // Reset drop time
        dropTime.value = '';
        
        // Enable all options first
        Array.from(dropTime.options).forEach(option => {
            option.disabled = false;
        });
        
        if (selectedIndex > 0) {
            // Disable times before pickup time
            Array.from(dropTime.options).forEach((option, index) => {
                if (index !== 0 && index <= selectedIndex) {
                    option.disabled = true;
                }
            });
            
            // Select next available time slot (30 mins after pickup)
            if (selectedIndex < dropTime.options.length - 1) {
                dropTime.value = dropTime.options[selectedIndex + 1].value;
            }
        }
    });
    
    // Validate minimum rental duration (e.g., 1 hour)
    dropTime.addEventListener('change', function() {
        const pickupIndex = pickupTime.selectedIndex;
        const dropIndex = this.selectedIndex;
        
        if (dropIndex <= pickupIndex + 1) { // Less than 1 hour
            alert('Minimum rental duration is 1 hour');
            this.value = dropTime.options[pickupIndex + 2].value; // Set to 1 hour after pickup
        }
    });

    // Navbar menu functionality
    const menuBtn = document.getElementById('navMenuBtn');
    const popupMenu = document.getElementById('navPopupMenu');
    
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        popupMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!popupMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            popupMenu.classList.remove('active');
        }
    });
    
    // Prevent menu from closing when clicking inside
    popupMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        menuBtn.classList.remove('active');
        popupMenu.classList.remove('active');
    });
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic bike selection
const bikeCards = document.querySelectorAll('.card');
const bikeSelect = document.querySelector('select[name="bikeModel"]');

bikeCards.forEach(card => {
    card.addEventListener('click', function() {
        const bikeName = this.querySelector('.card-title').textContent;
        bikeSelect.value = bikeName;
        document.querySelector('#booking').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Date picker initialization and configuration
$(document).ready(function() {
    const today = new Date();
    
    $("#pick, #drop").datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: today,
        maxDate: '+6M',
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        beforeShow: function(input, inst) {
            // Ensure the calendar appears below the input
            inst.dpDiv.css({
                marginTop: '10px',
                marginLeft: input.offsetWidth < 250 ? '-50px' : '0'
            });
        },
        onSelect: function(dateText, inst) {
            $(this).trigger('change');
            
            // If this is the pickup date, update drop date minimum
            if (this.id === 'pick') {
                const selectedDate = $(this).datepicker('getDate');
                $("#drop").datepicker('option', 'minDate', selectedDate);
                
                // Clear drop date if it's before pickup date
                const dropDate = $("#drop").datepicker('getDate');
                if (dropDate && dropDate < selectedDate) {
                    $("#drop").val('');
                }
            }
        }
    });
    
    // Add custom classes for styling
    $('.ui-datepicker').addClass('custom-datepicker');
    
    // Handle calendar icon click
    $('.bi-calendar3').click(function() {
        $(this).siblings('.date-picker').focus();
    });
});