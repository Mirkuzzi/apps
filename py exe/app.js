// Store the current active page and theme
let currentPage = 'home';
let isDarkMode = false;

// Function to save dark mode state with error handling
function saveDarkModeState() {
    try {
        localStorage.setItem('isDarkMode', isDarkMode);
    } catch (error) {
        console.error('Failed to save dark mode state:', error);
    }
}

// Function to load dark mode state with error handling
function loadDarkModeState() {
    try {
        const savedState = localStorage.getItem('isDarkMode');
        isDarkMode = savedState === 'true';
        document.body.classList.toggle('dark-mode', isDarkMode);
        const toggle = document.querySelector('.ios-toggle');
        if (toggle) {
            toggle.setAttribute('data-active', isDarkMode);
        }
    } catch (error) {
        console.error('Failed to load dark mode state:', error);
        // Fallback to default state
        isDarkMode = false;
        document.body.classList.remove('dark-mode');
    }
}

// Content for different pages
const pageContent = {
    home: `
        <h1>Welcome Home</h1>
        <p>This is the home page of our application.</p>
    `,
    settings: `
        <div class="settings-container">
            <h1>Settings</h1>
            <div class="settings-item">
                <span>Dark Mode</span>
                <button class="ios-toggle" onclick="toggleDarkMode()">
                    <div class="toggle-handle"></div>
                </button>
            </div>
        </div>
    `
};

// Function to handle navigation with smooth transitions
function navigate(page) {
    // Prevent navigation to the same page
    if (currentPage === page) return;

    // Update current page
    currentPage = page;
    
    // Create smooth transition effect
    const contentDiv = document.getElementById('content');
    contentDiv.style.opacity = '0';
    contentDiv.style.transform = 'translateX(30px)';
    contentDiv.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';

    // Store the current scroll position
    const scrollPosition = window.scrollY;
    
    // Use requestAnimationFrame for smooth 120Hz animations
    requestAnimationFrame(() => {
        setTimeout(() => {
            // Update content
            contentDiv.innerHTML = pageContent[page];
            
            // If navigating to settings page, update the toggle state
            if (page === 'settings') {
                const toggle = document.querySelector('.ios-toggle');
                if (toggle) {
                    toggle.setAttribute('data-active', isDarkMode);
                }
            }
            
            // Add animation classes to text elements
            const textElements = contentDiv.querySelectorAll('h1, p');
            textElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateX(20px)';
                el.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
                el.style.transitionDelay = `${index * 100}ms`;
            });
            
            // Trigger smooth entrance animation
            requestAnimationFrame(() => {
                contentDiv.style.opacity = '1';
                contentDiv.style.transform = 'translateX(0)';
                
                // Animate text elements
                textElements.forEach(el => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateX(0)';
                    }, 50);
                });
            });
        }, 50);
    });
    
    // Update active button with smooth color transition
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase() === page) {
            button.classList.add('active');
        }
    });
}

// Function to toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    saveDarkModeState();
    
    // Add transition class before changing dark mode
    document.body.classList.add('transitioning');
    
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
        // Apply dark mode changes
        document.body.classList.toggle('dark-mode', isDarkMode);
        const toggle = document.querySelector('.ios-toggle');
        toggle.setAttribute('data-active', isDarkMode);
        
        // Ensure all elements transition smoothly with synchronized timing
        document.querySelectorAll('h1, p, .settings-item, .nav-bar, .nav-button, body').forEach(el => {
            el.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('transitioning');
            // Reset transitions
            document.querySelectorAll('h1, p, .settings-item, .nav-bar, .nav-button, body').forEach(el => {
                el.style.transition = '';
            });
        }, 300);
    });
}

// Initialize styles for smooth transitions
document.addEventListener('DOMContentLoaded', () => {
    try {
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.style.transition = 'opacity 8.33ms ease, transform 8.33ms ease';
            // Ensure dark mode is loaded before navigation
            loadDarkModeState();
            // Initialize navigation after dark mode is set
            setTimeout(() => navigate('home'), 0);
        }
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
});
