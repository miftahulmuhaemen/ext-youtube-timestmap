I want to create a simple Chrome extension that copies the exact current timestamp of a YouTube video to the clipboard when I click the extension icon. Please help me generate the required files step by step. Follow Manifest V3 format and provide the code for the following:

manifest.json with Manifest V3 setup including permissions for scripting, activeTab, clipboardWrite, background service worker, and action button.

A background.js service worker script listening to the action button click.

A content script (content.js) that retrieves the current timestamp from the HTML5 video element on YouTube pages.

Modify the background script so when the extension icon is clicked, it injects the content script into the active tab, obtains the current playback time, converts it to HH:MM:SS format, copies that string to clipboard, and shows an alert or small notification confirming the timestamp copied.

Minimal and clean working code without complex UI, purely focusing on copying the timestamp with one click.

Instructions on how to load this as an unpacked extension in Chrome for testing.