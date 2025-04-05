// Cache Manager Script
document.addEventListener('DOMContentLoaded', function() {
    // Update the copyright year automatically
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Register service worker for better performance if not already registered by preloader.js
    if ('serviceWorker' in navigator && !window.serviceWorkerRegistered) {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful from cache-manager.js');
            window.serviceWorkerRegistered = true;
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
    
    // Setup clear cache button functionality
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', function() {
            // Show a small loading indicator or message
            const originalText = this.innerHTML;
            this.innerHTML = 'Clearing cache...';
            this.style.opacity = '0.7';
            this.disabled = true;
            
            // Function to handle the actual reload
            function performReload() {
                // Add a timestamp parameter to force a fresh load
                const reloadUrl = new URL(window.location.href);
                reloadUrl.searchParams.set('no-cache', Date.now());
                window.location.href = reloadUrl.toString();
            }
            
            // Try to clear browser cache through different methods
            if ('caches' in window) {
                // Clear all cache storage using Cache API
                caches.keys().then(function(cacheNames) {
                    return Promise.all(
                        cacheNames.map(function(cacheName) {
                            return caches.delete(cacheName);
                        })
                    );
                }).then(function() {
                    // If service worker exists, communicate with it to clear cache
                    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                        // Create a message channel
                        const messageChannel = new MessageChannel();
                        
                        // Handler for message channel response
                        messageChannel.port1.onmessage = function(event) {
                            console.log('Service Worker response:', event.data);
                            // Unregister service workers after cache is cleared
                            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                                return Promise.all(registrations.map(function(registration) {
                                    return registration.unregister();
                                }));
                            }).then(performReload);
                        };
                        
                        // Send message to service worker to clear cache
                        navigator.serviceWorker.controller.postMessage({
                            action: 'clearCache'
                        }, [messageChannel.port2]);
                        
                        // Set a timeout in case the service worker doesn't respond
                        setTimeout(function() {
                            performReload();
                        }, 3000);
                    } else {
                        // If no service worker controller, just reload
                        performReload();
                    }
                }).catch(function(error) {
                    console.error('Cache clearing failed:', error);
                    // Reset button state in case of error
                    clearCacheBtn.innerHTML = originalText;
                    clearCacheBtn.style.opacity = '1';
                    clearCacheBtn.disabled = false;
                    alert('Failed to clear cache. Please try again.');
                });
            } else {
                // If Cache API is not supported, just force reload
                performReload();
            }
        });
    }
}); 