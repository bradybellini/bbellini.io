// scripts/unsplash-client.ts
// Client-side script for Unsplash image loading and attribution

const API_ENDPOINT = '/api/random-unsplash.json';
const REFRESH_INTERVAL = 120_000; // 2 minutes

interface UnsplashPhoto {
  src: string;
  alt: string;
  author: string;
  username: string;
  profile: string;
  download: string;
  photoUrl: string;
}

async function fetchAndDisplayPhoto(): Promise<void> {
  const imageEl = document.getElementById('unsplash-image') as HTMLImageElement;
  const titleEl = document.getElementById('title-bar') as HTMLElement;
  const loadingEl = document.getElementById('image-loading') as HTMLElement;
  const errorEl = document.getElementById('image-error') as HTMLElement;

  if (!imageEl || !titleEl || !loadingEl || !errorEl) return;

  try {
    // Show loading state
    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    imageEl.style.display = 'none';

    // Start loading animation if available
    if ((window as any).startLoadingAnimation) {
      (window as any).startLoadingAnimation();
    }

    const response = await fetch(API_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const photo: UnsplashPhoto = await response.json();

    // Update image
    imageEl.onload = () => {
      // Stop loading animation if available
      if ((window as any).stopLoadingAnimation) {
        (window as any).stopLoadingAnimation();
      }
      
      loadingEl.style.display = 'none';
      imageEl.style.display = 'block';
      
      // Trigger download endpoint (required by Unsplash)
      fetch(photo.download).catch(() => {
        // Silently fail if download tracking fails
      });
    };

    imageEl.onerror = () => {
      // Stop loading animation if available
      if ((window as any).stopLoadingAnimation) {
        (window as any).stopLoadingAnimation();
      }
      
      loadingEl.style.display = 'none';
      errorEl.style.display = 'flex';
    };

    imageEl.src = photo.src;
    imageEl.alt = photo.alt;
    imageEl.title = `Photo by ${photo.author} on Unsplash`;
    imageEl.style.cursor = 'pointer';
    
    // Add click handler to open image on Unsplash
    imageEl.onclick = () => {
      window.open(`${photo.photoUrl}?utm_source=bbellini.io&utm_medium=referral`, '_blank');
    };

    // Update title bar with proper attribution
    const minimizeButton = titleEl.querySelector('.minimize-button');
    titleEl.innerHTML = `
      <span class="attribution">
        Photo by <a href="${photo.profile}?utm_source=bbellini.io&utm_medium=referral" 
                   target="_blank" rel="noopener" 
                   class="text-accent hover:underline">${photo.author}</a> on
        <a href="https://unsplash.com/?utm_source=bbellini.io&utm_medium=referral" 
           target="_blank" rel="noopener" 
           class="text-accent hover:underline">Unsplash</a>
      </span>
    `;
    
    // Re-append minimize button
    if (minimizeButton) {
      titleEl.appendChild(minimizeButton);
    }

  } catch (error) {
    console.error('Failed to load Unsplash photo:', error);
    
    // Stop loading animation if available
    if ((window as any).stopLoadingAnimation) {
      (window as any).stopLoadingAnimation();
    }
    
    loadingEl.style.display = 'none';
    errorEl.style.display = 'flex';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayPhoto();
  
  // Refresh image every 2 minutes
  setInterval(fetchAndDisplayPhoto, REFRESH_INTERVAL);
});
