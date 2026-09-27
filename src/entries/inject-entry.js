let targetSpeed = 16;
let bypassActive = false;
let bypassInterval = null;
let currentVideoSrc = ''; 

let isNavigating = false; 
let lastSeekTime = 0;     

// 1. Prototype Hijack
try {
  const originalDesc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
  Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
    get: function() { return originalDesc ? originalDesc.get.call(this) : targetSpeed; },
    set: function(val) {
      if (bypassActive && originalDesc) {
        originalDesc.set.call(this, targetSpeed);
      } else if (originalDesc) {
        originalDesc.set.call(this, val);
      }
    },
    configurable: true
  });
} catch (e) {}

// Helper for guaranteed UI timing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2. ULTRA-LOW Quality Forcer (Async/Await)
async function forceUltraLowQuality() {
  try {
    const settingsBtn = document.querySelector('.vjs-cog-menu-button, button[aria-label="Settings"], button[title="Settings"]');
    if (!settingsBtn) return;

    // Open settings
    settingsBtn.click();
    await delay(300); // Wait for menu to animate

    // Find the Quality button (could say "Quality", "Auto", or "1080p")
    const menuItems = Array.from(document.querySelectorAll('.vjs-menu-item, button, li, span'));
    const qualityBtn = menuItems.find(el => /quality|auto|[0-9]{3,4}p/i.test(el.textContent) && el.textContent.length < 25);

    if (qualityBtn) {
      qualityBtn.click();
      await delay(300); // Wait for resolutions to render

      // Find all resolution options
      const options = Array.from(document.querySelectorAll('.vjs-menu-item, button, li, span[role="menuitemradio"]'))
        .filter(el => /[0-9]{3,4}p/.test(el.textContent));

      if (options.length > 0) {
        // Parse the numbers and sort from lowest to highest
        options.sort((a, b) => {
          const numA = parseInt(a.textContent.match(/\d+/)[0]);
          const numB = parseInt(b.textContent.match(/\d+/)[0]);
          return numA - numB;
        });
        
        // Click the absolute lowest resolution (e.g., 144p or 360p)
        options[0].click(); 
      }
      await delay(200);
      settingsBtn.click(); // Close menu
    } else {
      settingsBtn.click(); // Close if no quality found
    }
  } catch (e) {}
}

// 3. Aggressive Next Button Finder
function navigateToNext() {
  if (isNavigating) return;
  
  const nextBtn = document.querySelector(
    '[data-control-name="next_item"], button[aria-label*="Next" i], a[aria-label*="Next" i], .vjs-next-button'
  );
  
  const allBtns = Array.from(document.querySelectorAll('button, a'));
  const textBtn = allBtns.find(el => {
    const text = el.textContent.trim().toLowerCase();
    return text === 'next' || text === 'next item' || text === 'up next';
  });

  const target = nextBtn || textBtn;
  if (target) {
    isNavigating = true;
    target.click();
    setTimeout(() => { isNavigating = false; }, 3000); 
  }
}

// 4. Execution Engine
function startBypassEngine(speed = 16) {
  targetSpeed = speed;
  bypassActive = true;

  if (bypassInterval) clearInterval(bypassInterval);

  bypassInterval = setInterval(async () => {
    // A. Interruption Clearance
    const interruptBtns = Array.from(document.querySelectorAll("button, [role='button'], a, span")).filter(btn => {
      const text = btn.textContent.toLowerCase().trim();
      if (text.includes('skip to main') || text.includes('skip to content')) return false;

      return text === 'continue' || 
             text === 'skip' ||
             text === 'skip survey' ||
             text.includes('skip survey') || 
             text.includes('next video') || 
             text.includes('continue to next');
    });
    
    if (interruptBtns.length > 0 && !isNavigating) {
      isNavigating = true;
      interruptBtns[0].click();
      setTimeout(() => { isNavigating = false; }, 2000);
    }

    // B. Video Playback & Fallback
    const video = document.querySelector('video.vjs-tech') || document.querySelector('video');
    
    if (!video || video.offsetParent === null) {
      navigateToNext();
      return;
    }

    // --- NEW: PRE-EMPTIVE PAUSE & BANDWIDTH SAVER ---
    if (video.src && video.src !== currentVideoSrc) {
      currentVideoSrc = video.src;
      isNavigating = false;
      
      // Pause immediately to stop high-quality chunks from downloading
      video.pause(); 
      video.muted = true;
      
      // Await the quality forcing before resuming
      await forceUltraLowQuality();
      
      // Resume playback after quality is locked in
      video.play().catch(()=>{});
    }

    video.muted = true;
    if (video.playbackRate !== targetSpeed) video.playbackRate = targetSpeed;
    if (video.paused && !video.ended && !isNavigating && video.src === currentVideoSrc) {
      video.play().catch(() => {});
    }

    // Rate-Limited Anti-Buffering
    if (video.readyState < 3 && !video.ended && video.duration > 0) {
      const now = Date.now();
      if (now - lastSeekTime > 2000) {
        video.currentTime += 2; 
        lastSeekTime = now;
      }
    }

    if (!isNavigating) video.dispatchEvent(new Event('timeupdate'));

    // C. End of video detection
    if (video.ended || video.currentTime >= video.duration - 0.5) {
      navigateToNext();
    }
  }, 100);
}

window.addEventListener('message', (event) => {
  if (event.data?.type === 'WTF_START_BYPASS') {
    startBypassEngine(event.data.speed || 16);
  }
});