// Tab functionality
function changeTab(selectedButton, tabIndex) {
    // Get all tab buttons and contents
    const tabButtons = selectedButton.parentElement.querySelectorAll('.tab-button');
    const tabContents = selectedButton.parentElement.parentElement.querySelectorAll('.tab-content');

    // Remove active class from all buttons and contents
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected button and content
    selectedButton.classList.add('active');
    tabContents[tabIndex].classList.add('active');
}

// Initialize tabs
document.addEventListener('DOMContentLoaded', function () {
    const tabContainers = document.querySelectorAll('.tab-container');

    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-button');

        buttons.forEach((button, index) => {
            button.addEventListener('click', function () {
                changeTab(this, index);
            });
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation for metrics counters
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate metrics when in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metricElements = entry.target.querySelectorAll('.number');
            metricElements.forEach(element => {
                const value = element.textContent;
                const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
                const suffix = value.replace(/[0-9.-]+/g, '');

                element.textContent = '0';
                element.dataset.suffix = suffix;

                animateValue(element, 0, numericValue, 1500);
            });

            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function () {
    const metricsGrids = document.querySelectorAll('.metrics-grid');
    metricsGrids.forEach(grid => observer.observe(grid));
});