<div align="center">
  <img src="icon/icon128.png" width="100" height="100" alt="WTF LinkedIn Learning Icon" />
  <h1>WTF LinkedIn Learning</h1>
  <p><b>Video tracking automation and dialog auto-dismissal for LinkedIn Learning</b></p>

  [![Release](https://img.shields.io/github/v/release/chrollovale/WTF-LinkedIn-Learning?style=flat-square&color=38bdf8)](https://github.com/chrollovale/WTF-LinkedIn-Learning/releases/latest)
  [![Manifest V3](https://img.shields.io/badge/Manifest-V3-34A853?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)
  [![Browser](https://img.shields.io/badge/Chromium-Chrome%20%7C%20Edge%20%7C%20Brave-4285F4?style=flat-square)](https://github.com/chrollovale/WTF-LinkedIn-Learning)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

  <br />
  <a href="https://github.com/chrollovale/WTF-LinkedIn-Learning/releases/latest"><b>📥 Download WTF-LinkedIn-Learning Extension (.zip)</b></a>
</div>

---

A clean, open-source Chrome extension that automates LinkedIn Learning video tracking — mark videos and readings as complete instantly without sitting through them or leaving a tab playing in the background.

<p align="center">
  <img src="./Preview.jpeg" alt="WTF LinkedIn Learning Preview" width="80%" />
</p>

---

## Features

- **Instant Completion:** Instantly registers the current video as watched.
- **Auto-Dismiss:** Automatically dismisses popups that would otherwise interrupt playback ("are you still watching?" prompts).
- **Telemetry HUD:** Live status panel (playhead time, playback state) in the popup.
- **Resource Friendly:** No background tabs left running.
- **Manifest V3:** Works across Chrome, Edge, Brave, Arc, and all Chromium browsers.

---

## Known Limitations

Quizzes and a few other popup types can still appear. You don't need to interact with them, though — they auto-redirect into the next video on their own, so the course still completes without you touching anything.

<p align="center">
  <img src="./Preview2.jpeg" alt="Extension In Action" width="80%" />
</p>

---

## Installation

### Quick Install (Prebuilt)
1. Download **[wtf-linkedin-learning-v1.1.0.zip](https://github.com/chrollovale/WTF-LinkedIn-Learning/releases/latest)**.
2. Unzip the file.
3. In Chrome, navigate to `chrome://extensions`.
4. Turn on **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the unzipped folder.

### Build from Source
```bash
git clone https://github.com/chrollovale/WTF-LinkedIn-Learning.git
cd WTF-LinkedIn-Learning
npm install
node build.js
```
Load the generated `dist/` folder via `chrome://extensions`.

---

## Usage

1. Open any LinkedIn Learning course or video page.
2. Click the extension icon in your toolbar.
3. Click **Initialize Video** to detect the active player.
4. Click **Start Bypass**.

---

## Disclaimer

This project is shared for educational purposes. Using it may violate LinkedIn Learning's Terms of Service. Use at your own risk.

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

### ⭐ Support the Project
If this tool saved you hours or helped complete your learning goals, please consider giving it a **Star** on GitHub!