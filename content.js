// Content script for YouTube timestamp extraction
// This script runs in the context of YouTube pages

let beginTimestamp = null;
let endTimestamp = null;
let timestampDisplay = null;
let downloadSections = [];
let isPanelVisible = false;

// Initialize when page loads
function init() {
  createTimestampDisplay();
  setupEventListeners();
}

// Create visual timestamp display
function createTimestampDisplay() {
  // Remove existing display if any
  const existing = document.getElementById('yt-timestamp-sidebar');
  if (existing) existing.remove();

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'yt-timestamp-sidebar';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'timestamp-header';
  
  const headerText = document.createElement('span');
  headerText.textContent = 'Download Sections';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '×';
  closeButton.onclick = hidePanel;
  
  header.appendChild(headerText);
  header.appendChild(closeButton);
  
  // Create current timestamp display
  const currentDisplay = document.createElement('div');
  currentDisplay.id = 'yt-current-timestamp';
  currentDisplay.className = 'current-timestamp';
  currentDisplay.textContent = '- to -';
  
  // Create sections list
  const sectionsList = document.createElement('div');
  sectionsList.id = 'yt-sections-list';
  sectionsList.className = 'sections-list';
  
  // Create template output container
  const templateContainer = document.createElement('div');
  templateContainer.className = 'template-container';
  
  const templateOutput = document.createElement('div');
  templateOutput.id = 'yt-template-output';
  templateOutput.className = 'template-output';
  templateOutput.textContent = 'No sections yet';
  
  // Create copy button
  const copyButton = document.createElement('button');
  copyButton.id = 'yt-copy-button';
  copyButton.className = 'copy-button';
  copyButton.innerHTML = '📋 Copy';
  copyButton.onclick = copyTemplateToClipboard;
  
  // Create reset button
  const resetButton = document.createElement('button');
  resetButton.id = 'yt-reset-button';
  resetButton.className = 'reset-button';
  resetButton.innerHTML = '🔄 Reset';
  resetButton.onclick = resetAll;
  
  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
  buttonContainer.appendChild(copyButton);
  buttonContainer.appendChild(resetButton);
  
  templateContainer.appendChild(templateOutput);
  templateContainer.appendChild(buttonContainer);
  
  // Assemble sidebar
  sidebar.appendChild(header);
  sidebar.appendChild(currentDisplay);
  sidebar.appendChild(sectionsList);
  sidebar.appendChild(templateContainer);
  
  // Insert as floating draggable panel
  document.body.appendChild(sidebar);
  
  // Make it draggable
  makeDraggable(sidebar);
  
  // Initially hide the panel
  sidebar.style.display = 'none';
  isPanelVisible = false;
  
  timestampDisplay = currentDisplay;
}

// Setup event listeners
function setupEventListeners() {
  // Listen for keyboard shortcut events
  window.addEventListener('timestampToggle', handleTimestampToggle);
  
  // Listen for toggle panel events from background script
  window.addEventListener('togglePanel', togglePanel);
}

// Handle timestamp toggle (SHIFT+CTRL+Z)
function handleTimestampToggle() {
  const video = document.querySelector('video');
  if (!video) return;

  const currentTime = video.currentTime;
  if (isNaN(currentTime) || currentTime < 0) return;

  const timestamp = formatTimestamp(currentTime);

  if (beginTimestamp === null) {
    // First click: set begin timestamp
    beginTimestamp = timestamp;
    endTimestamp = null;
    updateDisplay();
  } else if (endTimestamp === null) {
    // Second click: set end timestamp
    endTimestamp = timestamp;
    updateDisplay();
  } else {
    // Third click: save section and reset
    saveDownloadSection();
    resetTimestamps();
  }
}

// Format timestamp to HH:MM:SS
function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update visual display
function updateDisplay() {
  if (!timestampDisplay) return;
  
  if (beginTimestamp && endTimestamp) {
    timestampDisplay.textContent = `${beginTimestamp} to ${endTimestamp}`;
  } else if (beginTimestamp) {
    timestampDisplay.textContent = `${beginTimestamp} to -`;
  } else {
    timestampDisplay.textContent = '- to -';
  }
  
  // Update sections list and template
  updateSectionsList();
  updateTemplateOutput();
}

// Update sections list display
function updateSectionsList() {
  const sectionsList = document.getElementById('yt-sections-list');
  if (!sectionsList) return;
  
  sectionsList.innerHTML = '';
  
  downloadSections.forEach((section, index) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section-item';
    
    const sectionText = document.createElement('span');
    sectionText.textContent = `${index + 1}. ${section}`;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '×';
    deleteButton.onclick = () => deleteSection(index);
    
    sectionDiv.appendChild(sectionText);
    sectionDiv.appendChild(deleteButton);
    sectionsList.appendChild(sectionDiv);
  });
}

// Update template output display
function updateTemplateOutput() {
  const templateOutput = document.getElementById('yt-template-output');
  if (!templateOutput) return;
  
  if (downloadSections.length > 0) {
    const template = downloadSections.map(section => `--download-sections "${section}"`).join(' ');
    templateOutput.textContent = template;
  } else {
    templateOutput.textContent = 'No sections yet';
  }
}

// Save download section and generate template
function saveDownloadSection() {
  if (beginTimestamp && endTimestamp) {
    const section = `*${beginTimestamp}-${endTimestamp}`;
    downloadSections.push(section);
    
    // Generate template
    const template = downloadSections.map(section => `--download-sections "${section}"`).join(' ');
    
    // Save to storage
    chrome.storage.local.set({ downloadTemplate: template });
    
    // Update UI
    updateSectionsList();
    updateTemplateOutput();
  }
}

// Reset timestamps for next cycle
function resetTimestamps() {
  beginTimestamp = null;
  endTimestamp = null;
  updateDisplay();
}

// Delete a specific section
function deleteSection(index) {
  if (index >= 0 && index < downloadSections.length) {
    downloadSections.splice(index, 1);
    
    // Update storage
    const template = downloadSections.map(section => `--download-sections "${section}"`).join(' ');
    chrome.storage.local.set({ downloadTemplate: template });
    
    // Update UI
    updateSectionsList();
    updateTemplateOutput();
  }
}

// Copy template to clipboard
function copyTemplateToClipboard() {
  const templateOutput = document.getElementById('yt-template-output');
  if (!templateOutput) return;
  
  const template = templateOutput.textContent;
  if (template && template !== 'No sections yet') {
    // Focus the document first to ensure clipboard access
    window.focus();
    document.body.focus();
    
    // Use a more reliable clipboard method
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(template).then(() => {
        showCopyFeedback();
      }).catch(err => {
        console.error('Clipboard API failed, trying fallback:', err);
        fallbackCopyToClipboard(template);
      });
    } else {
      // Fallback for non-secure contexts
      fallbackCopyToClipboard(template);
    }
  }
}

// Fallback copy method
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopyFeedback();
    } else {
      console.error('Fallback copy failed');
    }
  } catch (err) {
    console.error('Fallback copy error:', err);
  } finally {
    document.body.removeChild(textArea);
  }
}

// Show copy feedback
function showCopyFeedback() {
  const copyButton = document.getElementById('yt-copy-button');
  const originalText = copyButton.innerHTML;
  copyButton.innerHTML = '✅ Copied!';
  copyButton.style.background = '#4CAF50';
  
  setTimeout(() => {
    copyButton.innerHTML = originalText;
    copyButton.style.background = '';
  }, 1500);
}

// Make element draggable
function makeDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  // Add drag handle to header
  const header = element.querySelector('.timestamp-header');
  header.style.cursor = 'move';
  header.style.userSelect = 'none';

  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === header || header.contains(e.target)) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      element.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }
}

// Toggle panel visibility
function togglePanel() {
  const sidebar = document.getElementById('yt-timestamp-sidebar');
  if (!sidebar) return;
  
  if (isPanelVisible) {
    hidePanel();
  } else {
    showPanel();
  }
}

// Show panel
function showPanel() {
  const sidebar = document.getElementById('yt-timestamp-sidebar');
  if (sidebar) {
    sidebar.style.display = 'block';
    isPanelVisible = true;
  }
}

// Hide panel
function hidePanel() {
  const sidebar = document.getElementById('yt-timestamp-sidebar');
  if (sidebar) {
    sidebar.style.display = 'none';
    isPanelVisible = false;
  }
}

// Reset all data
function resetAll() {
  // Clear all timestamps
  beginTimestamp = null;
  endTimestamp = null;
  downloadSections = [];
  
  // Clear storage
  chrome.storage.local.set({ downloadTemplate: '' });
  
  // Update UI
  updateDisplay();
  
  // Show feedback
  const resetButton = document.getElementById('yt-reset-button');
  const originalText = resetButton.innerHTML;
  resetButton.innerHTML = '✅ Reset!';
  resetButton.style.background = '#4CAF50';
  
  setTimeout(() => {
    resetButton.innerHTML = originalText;
    resetButton.style.background = '';
  }, 1500);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
