#!/bin/bash

# 📱 Agies Mobile App Setup Script
# Comprehensive setup for React Native iOS and Android development

echo "🛡️ Setting up Agies Password Manager Mobile App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the mobile app directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    print_warning "React Native CLI not found. Installing..."
    npm install -g react-native-cli
fi

# Install dependencies
print_status "Installing npm dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# iOS Setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_status "Setting up iOS dependencies..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        print_warning "CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi
    
    # Install iOS pods
    if [ -d "ios" ]; then
        print_status "Installing iOS CocoaPods..."
        cd ios
        pod install
        cd ..
        print_success "iOS setup completed"
    else
        print_warning "iOS directory not found. Run 'react-native init' first."
    fi
else
    print_warning "macOS not detected. Skipping iOS setup."
fi

# Android Setup
print_status "Checking Android setup..."

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    print_warning "ANDROID_HOME environment variable not set."
    print_warning "Please set up Android Studio and SDK."
else
    print_success "Android SDK found at: $ANDROID_HOME"
fi

# Create necessary directories
print_status "Creating project structure..."

mkdir -p src/{components,screens,services,context,utils,types,hooks,navigation}
mkdir -p src/components/{common,forms,vault,security}
mkdir -p src/services/{api,storage,crypto,sync}
mkdir -p android/app/src/main/res/{drawable-hdpi,drawable-mdpi,drawable-xhdpi,drawable-xxhdpi,drawable-xxxhdpi}
mkdir -p ios/AgiesMobile/Images.xcassets/AppIcon.appiconset

print_success "Project structure created"

# Generate app icons (placeholder)
print_status "Setting up app icons..."

# You would typically use a tool like react-native-make or manually add icons
# For now, we'll just create the directory structure

# Metro configuration
print_status "Creating Metro configuration..."
cat > metro.config.js << 'EOF'
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'mp4', 'ttf', 'otf'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
EOF

# Babel configuration
print_status "Creating Babel configuration..."
cat > babel.config.js << 'EOF'
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@types': './src/types',
          '@context': './src/context',
          '@hooks': './src/hooks',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
EOF

# TypeScript configuration
print_status "Creating TypeScript configuration..."
cat > tsconfig.json << 'EOF'
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@context/*": ["src/context/*"],
      "@hooks/*": ["src/hooks/*"]
    },
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": [
    "src/**/*",
    "App.tsx",
    "index.js"
  ],
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
EOF

# ESLint configuration
print_status "Creating ESLint configuration..."
cat > .eslintrc.js << 'EOF'
module.exports = {
  root: true,
  extends: [
    '@react-native',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react-native/no-inline-styles': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
EOF

# Prettier configuration
print_status "Creating Prettier configuration..."
cat > .prettierrc.js << 'EOF'
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
};
EOF

# React Native configuration
print_status "Creating React Native configuration..."
cat > react-native.config.js << 'EOF'
module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          sourceDir: '../node_modules/react-native-vector-icons/RNVectorIcons.xcodeproj',
          projectPath: 'ios/AgiesMobile.xcodeproj',
        },
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import io.github.react_native_vector_icons.VectorIconsPackage;',
        },
      },
    },
  },
  assets: ['./src/assets/fonts/'],
};
EOF

# Create index.js entry point
print_status "Creating app entry point..."
cat > index.js << 'EOF'
/**
 * 🛡️ Agies Password Manager Mobile App
 * Entry Point
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
EOF

# Create app.json
print_status "Creating app configuration..."
cat > app.json << 'EOF'
{
  "name": "AgiesMobile",
  "displayName": "Agies Password Manager",
  "version": "1.0.0",
  "description": "The world's most secure password manager with Chakravyuham Maze Engine",
  "author": "Agies Security Team",
  "license": "MIT"
}
EOF

# Development scripts
print_status "Creating development scripts..."

# iOS run script
cat > run-ios.sh << 'EOF'
#!/bin/bash
echo "🍎 Starting Agies iOS app..."
react-native run-ios --simulator="iPhone 14 Pro"
EOF

# Android run script
cat > run-android.sh << 'EOF'
#!/bin/bash
echo "🤖 Starting Agies Android app..."
react-native run-android
EOF

# Make scripts executable
chmod +x run-ios.sh run-android.sh

# Create basic environment files
print_status "Creating environment configuration..."

cat > .env.development << 'EOF'
API_URL=http://localhost:3002
APP_ENV=development
DEBUG=true
LOG_LEVEL=debug
ENABLE_FLIPPER=true
EOF

cat > .env.production << 'EOF'
API_URL=https://agies-password-manager.onrender.com
APP_ENV=production
DEBUG=false
LOG_LEVEL=error
ENABLE_FLIPPER=false
EOF

# Git ignore for React Native
print_status "Creating .gitignore..."
cat > .gitignore << 'EOF'
# OSX
.DS_Store

# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
ios/.xcodebuild.plist

# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof

# Node.js
node_modules/
npm-debug.log
yarn-error.log

# React Native
.react-native/

# Metro
.metro-health-check*

# Environment
.env
.env.local

# Flipper
ios/Podfile.lock

# Buck
buck-out/
\.buckd/
android/app/libs
*.keystore
!debug.keystore

# Logs
*.log

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Temporary files
*.tmp
*.temp

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# Stores VSCode versions used for testing VSCode extensions
.vscode-test
EOF

print_success "Mobile app setup completed! 🎉"
echo
print_status "Next steps:"
echo "1. Run 'npm start' to start the Metro bundler"
echo "2. Run './run-ios.sh' for iOS development"
echo "3. Run './run-android.sh' for Android development"
echo "4. Configure your IDE with the TypeScript and ESLint settings"
echo
print_status "Development URLs:"
echo "📱 App: Will be launched on simulator/device"
echo "🔧 Metro: http://localhost:8081"
echo "📊 Flipper: Install Flipper desktop app for debugging"
echo
print_warning "Don't forget to:"
echo "- Set up Android Studio and SDK (if developing for Android)"
echo "- Set up Xcode (if developing for iOS on macOS)"
echo "- Configure environment variables in .env files"
echo "- Add app icons and splash screens"
echo
print_success "Happy coding! 🛡️✨"
