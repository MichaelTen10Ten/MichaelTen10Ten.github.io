// --- Mobile Menu Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('active'); // Optional: for X icon animation
        });

        // Close menu when a link is clicked (for mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // Initialize IntersectionObserver for skills section
    initSkillAnimation();
});

// --- Smooth Scrolling for Navigation ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// --- Skill Progress Bar Animation using IntersectionObserver ---
function initSkillAnimation() {
    const skillBars = document.querySelectorAll('.progress-bar');
    if (skillBars.length === 0) return;

    // Options for the observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // trigger when 50% of the target is visible
    };

    // Callback function to execute when a target element intersects
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percentage = bar.getAttribute('data-progress');
                // Animate the width from 0 to the target percentage
                bar.style.width = `${percentage}%`;
                
                // Stop observing after the animation has been triggered
                observer.unobserve(bar);
            }
        });
    };

    // Create the observer and attach it to all skill bars
    const skillObserver = new IntersectionObserver(observerCallback, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}
