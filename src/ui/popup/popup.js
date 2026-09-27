function showAlert(type, message) {
  const el = document.getElementById('result-alert');
  el.style.display = 'block';
  el.style.background = type === 'error' ? 'var(--error-bg)' : 'var(--success-bg)';
  el.style.borderColor = type === 'error' ? 'var(--error)' : 'var(--success)';
  el.style.color = type === 'error' ? 'var(--error)' : 'var(--success)';
  el.textContent = message;
}

function hideAlert() {
  const el = document.getElementById('result-alert');
  el.style.display = 'none';
  el.textContent = '';
}

function setLoading(btnId, loading, text) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('loading', loading);
  btn.disabled = loading;
  if (text) btn.querySelector('.btn-text').textContent = text;
}

async function getActiveLinkedInTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.includes('linkedin.com/learning')) return null;
  return tab;
}

async function initializePopup() {
  const tab = await getActiveLinkedInTab();
  if (!tab) {
    document.getElementById('page-status').style.display = 'none';
    document.getElementById('action-buttons').style.display = 'none';
    document.getElementById('empty-msg').style.display = 'block';
    return;
  }

  document.getElementById('page-status').style.display = 'block';
  document.getElementById('action-buttons').style.display = 'block';
  document.getElementById('empty-msg').style.display = 'none';
}

document.getElementById('btn-set-video').addEventListener('click', async () => {
  hideAlert();
  setLoading('btn-set-video', true, 'Initializing...');

  try {
    const tab = await getActiveLinkedInTab();
    if (!tab) throw new Error('Please open a LinkedIn Learning video page.');

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'setVideo' });

    if (response && response.action === 'telemetry') {
      showAlert('success', '✅ Video element bound successfully!');
      document.getElementById('lbl-status').textContent = 'Active';
      document.getElementById('lbl-time').textContent = `${response.data.currentTime}s`;
      document.getElementById('lbl-playing').textContent = response.data.isPlaying ? 'Playing' : 'Paused';
    } else {
      throw new Error(response?.message || 'Failed to detect video element.');
    }
  } catch (error) {
    showAlert('error', error.message);
  } finally {
    setLoading('btn-set-video', false, 'Initialize Video');
  }
});

document.getElementById('btn-start-bypass').addEventListener('click', async () => {
  hideAlert();
  setLoading('btn-start-bypass', true, 'Bypassing...');

  try {
    const tab = await getActiveLinkedInTab();
    if (!tab) throw new Error('Please open a LinkedIn Learning video page.');

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'startBypass', speed: 16 });

    if (response && response.action === 'bypass_started') {
      showAlert('success', `⚡ ${response.message}`);
    } else {
      throw new Error(response?.message || 'Bypass failed to execute.');
    }
  } catch (error) {
    showAlert('error', error.message);
  } finally {
    setLoading('btn-start-bypass', false, 'Start Bypass');
  }
});

initializePopup();