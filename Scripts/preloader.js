// Preloader Management Script
// This script handles displaying and hiding the preloader
// It also applies dark mode to the preloader if needed

// Execute immediately to show the preloader as early as possible
(function() {
    // Create and add preloader styles if they don't already exist
    if (!document.getElementById('preloader-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'preloader-styles';
        styleSheet.textContent = `
            .preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #f8f9fa;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.5s ease;
            }
            
            .preloader.dark {
                background-color: #121212;
            }
            
            .preloader-spinner {
                display: inline-block;
                width: 80px;
                height: 80px;
                position: relative;
            }
            
            .preloader-spinner:after {
                content: " ";
                display: block;
                border-radius: 50%;
                width: 0;
                height: 0;
                margin: 8px;
                box-sizing: border-box;
                border: 32px solid #2a4290;
                border-color: #2a4290 transparent #2a4290 transparent;
                animation: preloader-spinner 1.2s infinite;
            }
            
            @keyframes preloader-spinner {
                0% {
                    transform: rotate(0);
                    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
                }
                50% {
                    transform: rotate(180deg);
                    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            
            .preloader-logo {
                position: absolute;
                width: 40px;
                height: auto;
            }
        `;
        
        // Add styles to head immediately
        document.head.appendChild(styleSheet);
    }

    // Check for dark mode preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDarkMode);
    
    // Function to create and add preloader to document
    function createPreloader() {
        if (document.getElementById('preloader')) {
            return; // Already exists
        }
        
        // Create preloader elements
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        preloader.className = 'preloader';
        if (isDarkMode) {
            preloader.classList.add('dark');
        }
        
        const spinnerDiv = document.createElement('div');
        spinnerDiv.className = 'preloader-spinner';
        
        const logoImg = document.createElement('img');
        
        // Determine correct path for logo based on page location
        const isSubPage = window.location.pathname.includes('/Pages/');
        logoImg.src = isSubPage ? '../Assets/goma-ec.png' : 'Assets/goma-ec.png';
        logoImg.alt = 'Loading';
        logoImg.className = 'preloader-logo';
        
        // Assemble preloader DOM structure
        spinnerDiv.appendChild(logoImg);
        preloader.appendChild(spinnerDiv);
        
        // Add preloader to document
        if (document.body) {
            document.body.insertBefore(preloader, document.body.firstChild);
        }
    }
    
    // Create preloader immediately if document.body exists
    if (document.body) {
        createPreloader();
    } else {
        // If body isn't available yet, use DOMContentLoaded
        document.addEventListener('DOMContentLoaded', createPreloader);
    }
    
    // For really early loading, also try with a small delay
    setTimeout(createPreloader, 0);
    
    // Function to hide preloader
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }
    
    // Register service worker if available and not already registered from cache-manager.js
    if ('serviceWorker' in navigator && !window.serviceWorkerRegistered) {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful from preloader.js');
            window.serviceWorkerRegistered = true;
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
    
    // Hide preloader after page loads
    window.addEventListener('load', hidePreloader);
    
    // Fallback - hide preloader after 5 seconds even if page hasn't finished loading
    setTimeout(hidePreloader, 5000);
})(); 