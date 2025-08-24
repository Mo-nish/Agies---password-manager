# Agies iOS App Setup

## Prerequisites
- Xcode 14+
- iOS 13+
- React Native CLI
- CocoaPods

## Setup Commands

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create React Native project
npx react-native init AgiesPasswordManager --template react-native-template-typescript

# Navigate to project
cd AgiesPasswordManager

# Install iOS dependencies
cd ios && pod install && cd ..

# Install required packages
npm install @react-native-async-storage/async-storage
npm install react-native-keychain
npm install react-native-biometrics
npm install @react-native-community/netinfo
npm install react-native-webview
npm install react-native-crypto-js
npm install react-native-vector-icons

# Install iOS-specific security packages
npm install react-native-touch-id
npm install react-native-secure-key-store
```

## Key Features to Implement

### 1. Biometric Authentication
- Touch ID / Face ID integration
- Secure enclave storage
- Biometric prompt for vault access

### 2. Secure Storage
- iOS Keychain integration
- AES-256 encryption
- Secure random key generation

### 3. Background Security
- App backgrounding protection
- Screenshot protection
- Jailbreak detection

### 4. Autofill Extension
- iOS Password AutoFill provider
- Safari extension integration
- System-wide autofill

## Project Structure
```
AgiesPasswordManager/
├── src/
│   ├── components/
│   │   ├── VaultList.tsx
│   │   ├── PasswordEntry.tsx
│   │   ├── BiometricAuth.tsx
│   │   └── AutofillProvider.tsx
│   ├── services/
│   │   ├── EncryptionService.ts
│   │   ├── BiometricService.ts
│   │   ├── KeychainService.ts
│   │   └── SyncService.ts
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── VaultScreen.tsx
│   │   ├── PasswordScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── utils/
│       ├── ChakravyuhamEngine.ts
│       ├── SecurityUtils.ts
│       └── Constants.ts
├── ios/
│   ├── AgiesPasswordManager/
│   ├── AgiesAutofillExtension/
│   └── AgiesShareExtension/
└── android/
```

## Build Commands
```bash
# Development build
npx react-native run-ios

# Production build
npx react-native run-ios --configuration Release

# Build for App Store
xcodebuild -workspace ios/AgiesPasswordManager.xcworkspace \
           -scheme AgiesPasswordManager \
           -configuration Release \
           -archivePath build/AgiesPasswordManager.xcarchive \
           archive
```
