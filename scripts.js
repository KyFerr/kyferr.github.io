// Ensure all necessary functions are defined.
// The DOmContentLoaded listener should wrap the code that runs when the page loads.

// --- Helper Functions (Ensure these are present in your scripts.js) ---
function scrollToSection(id) {
    const section = document.getElementById(id);
    // Adjust offset to account for fixed navigation bar
    const navHeight = document.querySelector('nav').offsetHeight;
    if (section) {
        window.scrollTo({
            top: section.offsetTop - navHeight,
            behavior: 'smooth'
        });
    }
    // Update active nav link after scrolling completes
    setTimeout(updateActiveNavLink, 700); // Gives time for smooth scroll to finish
}

function handleScrollAnimations() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible

    fadeInElements.forEach(element => {
        // Only observe elements that aren't already visible (like the hero section)
        if (!element.classList.contains('visible')) {
            observer.observe(element);
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentActive = null;
    const navHeight = document.querySelector('nav').offsetHeight; // Get nav height once

    sections.forEach(section => {
        // Adjust sectionTop to account for the fixed nav bar
        const sectionTop = section.offsetTop - navHeight - 1; // Subtracting 1px for buffer
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentActive = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-blue-400', 'underline'); // Remove active styles
        if (link.getAttribute('href') === `#${currentActive}`) {
            link.classList.add('text-blue-400', 'underline'); // Add active styles
        }
    });
}

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // In a real application, you'd send this to a server or service (e.g., Formspree, Netlify Forms)
    console.log('Form Submitted!');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    alert('Thank you for your message, ' + name + '! I will get back to you soon.');
    form.reset(); // Clear the form
}

// --- Main DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', function() {

    // --- Loading screen logic ---
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    // After 3.5 seconds, start fading out the loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden'); // Add the 'hidden' class to trigger CSS fade-out

        // After the fade-out transition completes (0.5 seconds), hide it completely
        // and show the main content.
        setTimeout(() => {
            loadingScreen.style.display = 'none'; // Ensure it's fully gone from layout
            mainContent.classList.remove('hidden-content'); // Remove 'display: none;' from main content

            // Set focus to the main content for better accessibility after loading
            mainContent.focus();
            
            // Trigger initial fade-in for elements that are now visible
            // This ensures the hero section and initial elements animate in.
            document.querySelectorAll('.fade-in').forEach(fader => {
                fader.classList.add('visible');
            });

            // Re-initialize scroll animations, as content is now visible
            handleScrollAnimations(); // Re-run to observe new visible elements
            updateActiveNavLink(); // Re-run to set the active nav link based on scroll position

        }, 500); // This duration matches the CSS transition duration for opacity
    }, 3500); // The total time the loading screen is displayed (3.5 seconds)

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Add click handlers for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Stop default anchor jump
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);

            // Close mobile menu if open after clicking a link
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // --- Initial setup and scroll listener for animations and active nav links ---
    // These will handle animations and active links as you scroll after the initial load.
    window.addEventListener('scroll', () => {
        handleScrollAnimations();
        updateActiveNavLink();
    });
});