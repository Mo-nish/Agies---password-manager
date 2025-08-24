# 🖥️ Agies Password Manager - Desktop App

**Cross-platform desktop application for Windows, macOS, and Linux**

## 🚀 Features

### ✅ **Core Password Management**
- 🔑 Secure password storage with AES-256 encryption
- 🗄️ Multiple vaults (Personal, Family, Team, Work)
- 🔍 Advanced search and filtering
- 📋 Copy to clipboard with auto-clear
- 🔄 Real-time sync across devices

### ✅ **Advanced Security**
- 🛡️ Hardware-backed encryption
- 🔐 Two-factor authentication (TOTP, U2F)
- 🚨 Dark web monitoring
- 📊 Security score tracking
- 🚪 Auto-lock and session management

### ✅ **Enterprise Features**
- 👥 Team vault sharing and collaboration
- 🔐 SSO integration (SAML, OAuth2, Active Directory)
- 📊 Advanced reporting and analytics
- 🔍 Audit logging and compliance
- 🚀 REST API access

### ✅ **Cross-Platform**
- 🪟 Windows 10+ (x64)
- 🍎 macOS 10.15+ (Intel/Apple Silicon)
- 🐧 Linux (Ubuntu 20.04+, CentOS 8+)
- 🔄 Seamless sync with web and mobile apps
- ☁️ Cloud backup and restore

## 🛠️ Technology Stack

- **Framework**: Tauri 1.5
- **Frontend**: React 18 + TypeScript
- **Backend**: Rust (Tauri)
- **UI**: Tailwind CSS + Custom Components
- **Encryption**: Rust crypto libraries
- **Storage**: SQLite + Local filesystem
- **Build**: Vite + Rust toolchain

## 🖥️ Installation

### Prerequisites
- Node.js 16+
- Rust 1.70+
- Platform-specific tools:
  - **Windows**: Visual Studio Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: Build essentials + WebKit2GTK

### Quick Start

```bash
# Clone the repository
git clone https://github.com/agies/password-manager-desktop.git
cd password-manager-desktop

# Install dependencies
npm install

# Start development server
npm run tauri:dev

# Build for production
npm run tauri:build
```

### Building for Specific Platforms

```bash
# Build for Windows
npm run tauri:build:windows

# Build for macOS
npm run tauri:build:macos

# Build for Linux
npm run tauri:build:linux

# Build for all platforms
npm run tauri:build:all
```

## 🏗️ Project Structure

```
desktop-app/
├── src/                   # React frontend
│   ├── components/       # UI components
│   ├── pages/           # App pages
│   ├── hooks/           # Custom hooks
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── src-tauri/           # Rust backend
│   ├── src/             # Rust source code
│   ├── Cargo.toml       # Rust dependencies
│   └── tauri.conf.json  # Tauri configuration
├── dist/                 # Build output
└── package.json         # Node dependencies
```

## 🔐 Security Features

### Encryption
- **AES-256-GCM** for password encryption
- **ChaCha20-Poly1305** for high-performance encryption
- **PBKDF2** for key derivation (100,000+ iterations)
- **Hardware-backed** key storage (TPM, Secure Enclave)

### Authentication
- **System authentication** integration
- **Biometric** authentication (Windows Hello, Touch ID)
- **Smart card** support
- **Session** management with auto-lock

### Data Protection
- **Process isolation** with Rust
- **Memory protection** and secure cleanup
- **Secure storage** APIs
- **Network security** with certificate pinning

## 📊 Performance

- **App Size**: < 30MB
- **Launch Time**: < 1 second
- **Memory Usage**: < 80MB
- **CPU Impact**: Minimal
- **Battery Impact**: None (desktop)

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run Rust tests
npm run test:rust

# Run integration tests
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Windows
1. Update version in `package.json`
2. Build: `npm run tauri:build:windows`
3. Sign executable with code signing certificate
4. Create installer with WiX Toolset

### macOS
1. Update version in `package.json`
2. Build: `npm run tauri:build:macos`
3. Sign with Apple Developer certificate
4. Notarize with Apple
5. Create DMG installer

### Linux
1. Update version in `package.json`
2. Build: `npm run tauri:build:linux`
3. Create AppImage or package
4. Sign with GPG key

## 🔧 Configuration

### Tauri Configuration
```json
{
  "tauri": {
    "allowlist": {
      "fs": { "all": true, "scope": ["$APPDATA/*"] },
      "store": { "all": true },
      "notification": { "all": true }
    },
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'"
    }
  }
}
```

### Environment Variables
```bash
# .env
API_BASE_URL=https://api.agies.com
ENCRYPTION_KEY=your_encryption_key
UPDATE_SERVER=https://updates.agies.com
DEBUG_MODE=false
```

## 🖥️ Supported Platforms

### Windows
- Windows 10 (1903) and newer
- Windows 11
- x64 architecture
- 4GB RAM minimum

### macOS
- macOS 10.15 (Catalina) and newer
- Intel x64 and Apple Silicon (M1/M2)
- 4GB RAM minimum

### Linux
- Ubuntu 20.04+ / Debian 11+
- CentOS 8+ / RHEL 8+
- Fedora 33+
- x64 architecture, 4GB RAM minimum

## 🔄 Sync & Backup

### Real-time Sync
- **WebSocket** connections
- **Conflict resolution** with merge strategies
- **Offline support** with local caching
- **Incremental updates** for efficiency

### Backup Options
- **Local backup** to secure location
- **Cloud backup** (OneDrive, iCloud, Google Drive)
- **Encrypted export** (CSV, JSON, 1Password format)
- **Automatic backup** scheduling

## 🚨 Troubleshooting

### Common Issues

**Build fails on Windows**
```bash
# Install Visual Studio Build Tools
npm install -g windows-build-tools

# Clean and rebuild
npm run clean && npm run tauri:build:windows
```

**Build fails on macOS**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Clean and rebuild
npm run clean && npm run tauri:build:macos
```

**Build fails on Linux**
```bash
# Install dependencies
sudo apt-get install build-essential libwebkit2gtk-4.0-dev

# Clean and rebuild
npm run clean && npm run tauri:build:linux
```

### Debug Mode
```bash
# Enable debug logging
npm run debug

# View logs
npm run logs:desktop
```

## 📚 API Reference

### Frontend Services
- `PasswordService` - Password management
- `VaultService` - Vault operations
- `SecurityService` - Security features
- `SyncService` - Cross-device synchronization

### Rust Backend
- `encryption` - Cryptographic operations
- `storage` - Data persistence
- `sync` - Synchronization logic
- `security` - Security validation

## 🔌 Plugins & Extensions

### Built-in Plugins
- **File System** - Secure file operations
- **Store** - Persistent data storage
- **Notification** - System notifications
- **Global Shortcut** - Keyboard shortcuts

### Custom Plugins
- **Encryption** - Advanced crypto operations
- **Biometrics** - Platform authentication
- **Network** - Secure communications
- **Hardware** - TPM and security modules

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

- **Documentation**: [docs.agies.com](https://docs.agies.com)
- **Issues**: [GitHub Issues](https://github.com/agies/password-manager-desktop/issues)
- **Email**: support@agies.com
- **Discord**: [Agies Community](https://discord.gg/agies)

## 🗺️ Roadmap

### v1.1.0 (Q2 2024)
- [ ] Browser extension integration
- [ ] Advanced keyboard shortcuts
- [ ] Custom themes and skins

### v1.2.0 (Q3 2024)
- [ ] Plugin system
- [ ] Advanced reporting
- [ ] Enterprise features

### v2.0.0 (Q4 2024)
- [ ] AI-powered security
- [ ] Advanced analytics
- [ ] Multi-language support

---

**Built with ❤️ by the Agies Security Team**
