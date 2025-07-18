// scripts/unsplash-client.ts
// Client-side script for Unsplash image loading and attribution

const API_ENDPOINT = '/api/random-unsplash.json';
const REFRESH_INTERVAL = 120_000; // 2 minutes
const FALLBACK_IMAGE = '/img/brady-bellini-unsplash-fallback.jpg';
const FALLBACK_ATTRIBUTION = {
  author: 'Brady Bellini',
  username: 'brady_bellini',
  profile: 'https://unsplash.com/@brady_bellini',
  photoUrl: 'https://unsplash.com/photos/rk8Uz79PhV8'
};

interface UnsplashPhoto {
  src: string;
  alt: string;
  author: string;
  username: string;
  profile: string;
  download: string;
  photoUrl: string;
}

function useFallbackImage(
  imageEl: HTMLImageElement, 
  titleEl: HTMLElement, 
  loadingEl: HTMLElement, 
  errorEl: HTMLElement
): void {
  // Stop loading animation if available
  if ((window as any).stopLoadingAnimation) {
    (window as any).stopLoadingAnimation();
  }

  // Set up fallback image
  imageEl.onload = () => {
    loadingEl.style.display = 'none';
    imageEl.style.display = 'block';
  };

  imageEl.onerror = () => {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'flex';
  };

  imageEl.src = FALLBACK_IMAGE;
  imageEl.alt = 'Mountain landscape by Brady Bellini';
  imageEl.title = `Photo by ${FALLBACK_ATTRIBUTION.author} on Unsplash`;
  imageEl.style.cursor = 'pointer';
  
  // Add click handler to open image on Unsplash
  imageEl.onclick = () => {
    window.open(`${FALLBACK_ATTRIBUTION.photoUrl}?utm_source=bbellini.io&utm_medium=referral`, '_blank');
  };

  // Update title bar with fallback attribution
  const minimizeButton = titleEl.querySelector('.minimize-button');
  titleEl.innerHTML = `
    <span class="attribution">
      Photo by <a href="${FALLBACK_ATTRIBUTION.profile}?utm_source=bbellini.io&utm_medium=referral" 
                 target="_blank" rel="noopener" 
                 class="text-accent hover:underline">${FALLBACK_ATTRIBUTION.author}</a> on
      <a href="https://unsplash.com/?utm_source=bbellini.io&utm_medium=referral" 
         target="_blank" rel="noopener" 
         class="text-accent hover:underline">Unsplash</a>
    </span>
  `;
  
  // Re-append minimize button
  if (minimizeButton) {
    titleEl.appendChild(minimizeButton);
  }
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
    
    // Use fallback image instead of showing error
    useFallbackImage(imageEl, titleEl, loadingEl, errorEl);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayPhoto();
  
  // Remove auto-refresh - let user navigate/refresh manually
  // setInterval(fetchAndDisplayPhoto, REFRESH_INTERVAL);
});
