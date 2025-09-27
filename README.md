# YouTube Timestamp Copier

A Chrome extension that helps you to record timestamp specifically for [yt-dlp](https://github.com/yt-dlp/yt-dlp). By utilizing `download-section` flag, we could clip faster on commmand line rather than cut the video on the editor.

## Features

- **Keyboard Shortcuts**: Use `SHIFT + CTRL + Z` to mark timestamps
- **Floating Panel**: Draggable panel that you can position anywhere on screen
- **Visual Feedback**: See current timestamps and accumulated sections
- **Individual Control**: Delete specific timestamps with × buttons
- **Copy to Clipboard**: One-click copy of complete download command
- **Reset Function**: Clear all data and start fresh
- **Toggle Visibility**: Show/hide panel with extension icon click

## How It Works

1. **Open any YouTube video**
2. **Click the extension icon** to show the floating panel
3. **Press `SHIFT + CTRL + Z`** to mark begin timestamp
4. **Press `SHIFT + CTRL + Z` again** to mark end timestamp
5. **Press `SHIFT + CTRL + Z` third time** to save section and reset
6. **Repeat steps 3-5** for multiple sections
7. **Click Copy button** to copy all sections to clipboard

## Example Output

```
--download-sections "*02:03:53-02:04:12" --download-sections "*02:07:39-02:08:21" --download-sections "*02:09:22-02:09:45"
```

## Installation

### From Chrome Web Store
*Coming soon...*

### Manual Installation (Developer Mode)

1. **Download the extension files**
   ```bash
   git clone https://github.com/yourusername/ext-youtube-timestmap.git
   cd ext-youtube-timestmap
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or go to Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the extension folder
   - Click "Select Folder"

5. **Verify Installation**
   - The extension should appear in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Usage

### Basic Workflow
1. Navigate to any YouTube video
2. Click the extension icon to show the floating panel
3. Use `SHIFT + CTRL + Z` to mark timestamps:
   - **First press**: Mark BEGIN timestamp
   - **Second press**: Mark END timestamp  
   - **Third press**: Save section and reset for next cycle
4. Click the Copy button to copy all sections to clipboard

### Panel Controls
- **Drag**: Click and drag the header to move the panel
- **Close**: Click the × button to hide the panel
- **Delete**: Click × on individual timestamps to remove them
- **Copy**: Click the green Copy button to copy template
- **Reset**: Click the orange Reset button to clear everything

## File Structure

```
ext-youtube-timestmap/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for keyboard shortcuts
├── content.js            # Main functionality and UI
├── styles.css            # Panel styling
├── README.md             # This file
└── LOADING_INSTRUCTIONS.md # Legacy loading instructions
```

## Permissions

- **activeTab**: Access current YouTube tab to read video timestamps
- **scripting**: Inject JavaScript for keyboard shortcuts and panel control
- **clipboardWrite**: Copy generated templates to clipboard
- **storage**: Save timestamp sections locally
- **notifications**: Show user feedback messages
- **Host Permission (youtube.com)**: Access YouTube video elements

## Development

### Prerequisites
- Chrome browser
- Basic understanding of Chrome extensions

### Building
No build process required - just load the extension files directly.

### Testing
1. Load the extension in developer mode
2. Navigate to any YouTube video
3. Test keyboard shortcuts and panel functionality
4. Verify clipboard copying works

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Troubleshooting

- **Extension not working**: Make sure you're on a YouTube page with a video playing
- **Keyboard shortcut not working**: Check Chrome keyboard shortcuts in `chrome://extensions/shortcuts`
- **No panel visible**: Click the extension icon to toggle panel visibility
- **Clipboard not working**: Ensure the site has clipboard permissions

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Note**: This extension is designed specifically for YouTube and requires host permissions to function properly.
