function getVideoElement() {
  return document.querySelector("video.vjs-tech") || document.querySelector("video");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const videoElement = getVideoElement();

  if (request.action === "setVideo") {
    if (!videoElement) {
      sendResponse({ action: "error", message: "Video player not found." });
      return false;
    }
    sendResponse({
      action: "telemetry",
      data: {
        currentTime: Math.floor(videoElement.currentTime || 0),
        isPlaying: !videoElement.paused
      }
    });
    return false;
  }

  if (request.action === "startBypass") {
    if (!videoElement) {
      sendResponse({ action: "error", message: "Video element not found." });
      return false;
    }

    // Post message into window context for inject.js to receive
    window.postMessage({ type: "WTF_START_BYPASS", speed: request.speed || 16 }, "*");

    sendResponse({
      action: "bypass_started",
      message: `Speed locked at ${request.speed || 16}x with stream auto-degradation!`
    });
    return false;
  }
});