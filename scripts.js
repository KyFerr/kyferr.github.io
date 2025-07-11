// JavaScript for loading screen, mobile menu, smooth scrolling, and fade-in animations

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.addEventListener('transitionend', () => {
            loadingScreen.remove();
            mainContent.classList.remove('hidden-content');
            mainContent.style.opacity = '1';
            mainContent.focus(); // Focus main content for accessibility
            observeSections(); // Start observing sections after content is visible
        });
    }, 1500); // Adjust loading time as needed

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu and scroll to section on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            const targetId = link.getAttribute('href');
            scrollToSection(targetId.substring(1)); // Remove '#'
        });
    });

    // Smooth scroll function
    window.scrollToSection = function(id) {
        const targetSection = document.getElementById(id);
        const navHeight = document.querySelector('nav').offsetHeight; // Get height of fixed navbar
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - navHeight, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
        // Update active nav link after scrolling completes
        setTimeout(updateActiveNavLink, 700); // Gives time for smooth scroll to finish
    };

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // Use 'active' class for fade-in
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    function observeSections() {
        sections.forEach(section => {
            const fadeInElement = section.querySelector('.fade-in');
            if (fadeInElement) {
                // Only observe elements that aren't already visible (like the hero section)
                if (!fadeInElement.classList.contains('active')) {
                    observer.observe(fadeInElement);
                }
            }
        });
    }

    // Function to update active navigation link based on scroll position
    function updateActiveNavLink() {
        const currentScroll = window.scrollY + document.querySelector('nav').offsetHeight + 10; // Add a small offset
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const id = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (correspondingNavLink) {
                if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                    correspondingNavLink.classList.add('text-blue-400'); // Highlight active link
                } else {
                    correspondingNavLink.classList.remove('text-blue-400');
                }
            }
        });
    }

    // Event listener for scroll to update active nav link
    window.addEventListener('scroll', updateActiveNavLink);
    // Initial call to set active link on load
    updateActiveNavLink();

    // Handle contact form submission
    window.handleFormSubmit = async function(event) {
        event.preventDefault(); // Prevent default form submission

        const form = event.target;
        const formData = new FormData(form);
        const formUrl = form.getAttribute('action');

        try {
            const response = await fetch(formUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Important for Formspree to return JSON
                }
            });

            if (response.ok) {
                // Show a success message (replace with a custom modal/toast if preferred)
                alert('Thank you for your message! I will get back to you soon.');
                form.reset(); // Clear the form
            } else {
                // Handle errors
                const data = await response.json();
                if (data.errors) {
                    // Display specific error messages from Formspree
                    alert('Error submitting form: ' + data.errors.map(error => error.message).join(', '));
                } else {
                    alert('There was an issue sending your message. Please try again.');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('An unexpected error occurred. Please check your internet connection and try again.');
        }
    };
});
