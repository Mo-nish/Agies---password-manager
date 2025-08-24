# 🔐 Agies Password Manager - Mobile App

**Enterprise-grade password management for iOS and Android**

## 🚀 Features

### ✅ **Core Password Management**
- 🔑 Secure password storage with AES-256 encryption
- 🗄️ Multiple vaults (Personal, Family, Team, Work)
- 🔍 Advanced search and filtering
- 📱 Touch-optimized interface
- 🔄 Real-time sync across devices

### ✅ **Advanced Security**
- 🛡️ Biometric authentication (Face ID, Touch ID, Fingerprint)
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
- 📱 iOS 13+ (iPhone, iPad)
- 🤖 Android 8+ (Phone, Tablet)
- 🔄 Seamless sync with web and desktop apps
- ☁️ Cloud backup and restore

## 🛠️ Technology Stack

- **Framework**: React Native 0.72.6
- **Language**: JavaScript/TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Hooks + Context
- **Encryption**: React Native Crypto JS
- **Storage**: SQLite + AsyncStorage
- **Biometrics**: React Native Biometrics
- **UI Components**: Custom + Vector Icons

## 📱 Installation

### Prerequisites
- Node.js 16+
- React Native CLI
- Xcode 13+ (iOS)
- Android Studio (Android)
- CocoaPods (iOS)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/agies/password-manager-mobile.git
cd password-manager-mobile

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Building for Production

```bash
# Build iOS release
npm run build:ios

# Build Android release
npm run build:android

# Build both platforms
npm run build:all
```

## 🏗️ Project Structure

```
mobile-app/
├── src/
│   ├── screens/          # App screens
│   ├── components/       # Reusable components
│   ├── services/         # Business logic
│   ├── utils/           # Helper functions
│   ├── constants/       # App constants
│   └── assets/          # Images, fonts, etc.
├── android/              # Android native code
├── ios/                  # iOS native code
├── __tests__/           # Test files
└── package.json         # Dependencies
```

## 🔐 Security Features

### Encryption
- **AES-256-GCM** for password encryption
- **PBKDF2** for key derivation
- **Secure random** number generation
- **Hardware-backed** key storage

### Authentication
- **Biometric** authentication
- **PIN/Pattern** fallback
- **Session** management
- **Auto-lock** on inactivity

### Data Protection
- **App-level** encryption
- **Secure storage** APIs
- **Memory protection**
- **Network security**

## 📊 Performance

- **App Size**: < 50MB
- **Launch Time**: < 2 seconds
- **Memory Usage**: < 100MB
- **Battery Impact**: Minimal
- **Network**: Optimized sync

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=LoginScreen

# Run tests on device
npm run test:device
```

## 🚀 Deployment

### App Store (iOS)
1. Update version in `package.json`
2. Build release: `npm run build:ios`
3. Archive in Xcode
4. Upload to App Store Connect

### Google Play (Android)
1. Update version in `package.json`
2. Build release: `npm run build:android`
3. Sign APK with release key
4. Upload to Google Play Console

## 🔧 Configuration

### Environment Variables
```bash
# .env
API_BASE_URL=https://api.agies.com
ENCRYPTION_KEY=your_encryption_key
BIOMETRIC_ENABLED=true
DARK_MODE_ENABLED=true
```

### Build Configuration
- **iOS**: Configure in `ios/AgiesPasswordManager/Info.plist`
- **Android**: Configure in `android/app/src/main/AndroidManifest.xml`

## 📱 Supported Devices

### iOS
- iPhone 6s and newer
- iPad 5th generation and newer
- iOS 13.0+

### Android
- Android 8.0 (API 26) and newer
- 2GB RAM minimum
- ARM64 or x86_64 architecture

## 🔄 Sync & Backup

### Real-time Sync
- **WebSocket** connections
- **Conflict resolution**
- **Offline support**
- **Incremental updates**

### Backup Options
- **iCloud** (iOS)
- **Google Drive** (Android)
- **Local backup**
- **Encrypted export**

## 🚨 Troubleshooting

### Common Issues

**Build fails on iOS**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Build fails on Android**
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**Metro bundler issues**
```bash
npm start -- --reset-cache
```

### Debug Mode
```bash
# Enable debug logging
npm run debug

# View logs
npm run logs:ios
npm run logs:android
```

## 📚 API Reference

### Core Services
- `SecurityService` - Encryption and authentication
- `StorageService` - Data persistence
- `SyncService` - Cross-device synchronization
- `BiometricsService` - Biometric authentication

### Components
- `LoginScreen` - User authentication
- `DashboardScreen` - Main app interface
- `VaultsScreen` - Vault management
- `PasswordsScreen` - Password management
- `SecurityScreen` - Security settings

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
- **Issues**: [GitHub Issues](https://github.com/agies/password-manager-mobile/issues)
- **Email**: support@agies.com
- **Discord**: [Agies Community](https://discord.gg/agies)

## 🗺️ Roadmap

### v1.1.0 (Q2 2024)
- [ ] Apple Watch companion app
- [ ] Widget support
- [ ] Advanced biometrics

### v1.2.0 (Q3 2024)
- [ ] Dark web monitoring
- [ ] Password breach alerts
- [ ] Advanced reporting

### v2.0.0 (Q4 2024)
- [ ] AI-powered security
- [ ] Advanced analytics
- [ ] Enterprise features

---

**Built with ❤️ by the Agies Security Team**
