# 🔐 Agies Password Manager - Chrome Extension

## 🚀 Installation Instructions

### Method 1: Load Unpacked Extension (Recommended for Testing)

1. **Download the Extension**
   - Download this entire `chrome-extension` folder to your computer

2. **Open Chrome Extensions Page**
   - Open Chrome and go to `chrome://extensions/`
   - Or navigate to: Chrome Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `chrome-extension` folder you downloaded
   - The extension should now appear in your extensions list

5. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Agies Password Manager" and click the pin icon
   - The extension icon should now appear in your toolbar

### Method 2: Install from Chrome Web Store (When Available)

1. Visit the Chrome Web Store
2. Search for "Agies Password Manager"
3. Click "Add to Chrome"
4. Confirm the installation

## 🧪 Testing the Extension

### Test Page
We've included a test page to verify functionality:
- Open `chrome-extension/test-extension.html` in Chrome
- You should see login forms with "Agies Detected" indicators

### Manual Testing
1. **Visit any login page** (Gmail, GitHub, etc.)
2. **Right-click** on password fields to see context menu
3. **Use keyboard shortcuts**:
   - `Ctrl+Shift+L` - Smart Autofill
   - `Ctrl+\` - Quick Fill
4. **Click the extension icon** to open the vault

## 🔧 Features

### ✅ Working Features
- **Form Detection**: Automatically detects login forms
- **Context Menus**: Right-click options for password fields
- **Keyboard Shortcuts**: 1Password-style shortcuts
- **Password Generation**: Secure password generation
- **Password Capture**: Save passwords from forms
- **Visual Indicators**: Shows "Agies Detected" above forms

### 🚧 In Development
- **Real Password Storage**: Currently uses mock data
- **Backend Sync**: Will sync with Agies vault
- **Advanced Autofill**: Smart form matching

## 🐛 Troubleshooting

### Extension Not Working?
1. **Check Console**: Press F12 and look for errors
2. **Reload Extension**: Go to `chrome://extensions/` and click reload
3. **Check Permissions**: Ensure all permissions are granted
4. **Restart Chrome**: Sometimes needed after installation

### Icons Not Showing?
- The extension now uses SVG icons which should work in all Chrome versions
- If you see broken icons, try reloading the extension

### Autofill Not Working?
1. Make sure you're on a page with login forms
2. Check the browser console for error messages
3. Try the keyboard shortcuts: `Ctrl+Shift+L`
4. Right-click on password fields for context menu

## 📱 Integration

### With Agies Web App
- The extension connects to your Agies vault
- Passwords are synced across devices
- Secure end-to-end encryption

### Browser Compatibility
- **Chrome**: 88+ (Recommended)
- **Edge**: 88+ (Chromium-based)
- **Opera**: 74+ (Chromium-based)

## 🔒 Security Features

- **Zero-Knowledge**: Passwords never leave your device unencrypted
- **Local Storage**: Sensitive data stored locally first
- **Secure Communication**: All backend communication is encrypted
- **No Tracking**: We don't track your browsing or form data

## 🆘 Support

### Getting Help
1. **Check Console**: Look for error messages in browser console
2. **Test Page**: Use the included test page to verify functionality
3. **Documentation**: Visit our main website for detailed guides
4. **Community**: Join our user community for help

### Reporting Issues
When reporting issues, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Console error messages
- Screenshots if relevant

## 🔄 Updates

### Manual Updates
1. Download the latest version
2. Go to `chrome://extensions/`
3. Click "Load unpacked" and select the new folder
4. Chrome will replace the old version

### Automatic Updates
- When available on Chrome Web Store, updates will be automatic
- You'll see a notification when updates are available

## 📋 Development

### File Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for web pages
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── autofill.js           # Autofill engine
├── form-detector.js      # Form detection logic
├── agies-overlay.css     # Styling for overlays
├── icons/                # Extension icons
└── test-extension.html   # Test page for development
```

### Making Changes
1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the reload button on the extension
4. Test your changes

## 🎯 Roadmap

### Next Features
- [ ] Real password storage and sync
- [ ] Advanced form detection
- [ ] Password strength analysis
- [ ] Security breach alerts
- [ ] Team sharing features
- [ ] Mobile app integration

### Performance Goals
- [ ] Sub-100ms autofill response
- [ ] Minimal memory usage
- [ ] Fast startup time
- [ ] Smooth animations

---

**🔐 Agies Password Manager** - Making password security accessible to everyone.

For more information, visit: [https://agies-password-manager.vercel.app](https://agies-password-manager.vercel.app)
