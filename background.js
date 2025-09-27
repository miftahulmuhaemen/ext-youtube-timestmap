// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === 'toggle-timestamp') {
    if (!tab.url.includes('youtube.com')) return;
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleTimestamp
      });
    } catch (error) {
      console.error('Error handling keyboard shortcut:', error);
    }
  }
});

// Handle extension icon click - toggle panel visibility
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab.url.includes('youtube.com')) {
      if (chrome.notifications) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          title: 'YouTube Timestamp Copier',
          message: 'Please navigate to a YouTube video first'
        });
      } else {
        console.log('YouTube Timestamp Copier: Please navigate to a YouTube video first');
      }
      return;
    }

    // Toggle panel visibility
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: togglePanel
    });
  } catch (error) {
    console.error('Error:', error);
  }
});

// Function to toggle panel (executed in content context)
function togglePanel() {
  window.dispatchEvent(new CustomEvent('togglePanel'));
}

// Function to toggle timestamp (executed in content context)
function toggleTimestamp() {
  // This will be handled by the content script
  window.dispatchEvent(new CustomEvent('timestampToggle'));
}

// Function to copy to clipboard (executed in content context)
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy: ', err);
  });
}
