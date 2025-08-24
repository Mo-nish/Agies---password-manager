# Agies Android App Setup

## Prerequisites
- Android Studio
- Android SDK 23+
- Java 11+
- React Native CLI

## Setup Commands

```bash
# Use the same React Native project from iOS setup
cd AgiesPasswordManager

# Install Android-specific packages
npm install react-native-android-keystore
npm install react-native-fingerprint-scanner
npm install react-native-secure-storage

# Generate Android keystore
keytool -genkey -v -keystore android/app/agies-release-key.keystore \
        -alias agies-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

## Android Manifest Configuration

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.USE_FINGERPRINT" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    
    <!-- Prevent screenshots in recent apps -->
    <uses-permission android:name="android.permission.PREVENT_SCREENSHOTS" />
    
    <application
        android:name=".MainApplication"
        android:allowBackup="false"
        android:extractNativeLibs="false"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false">
        
        <!-- Main Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- Autofill Service -->
        <service
            android:name=".autofill.AgiesAutofillService"
            android:exported="true"
            android:permission="android.permission.BIND_AUTOFILL_SERVICE">
            <intent-filter>
                <action android:name="android.service.autofill.AutofillService" />
            </intent-filter>
            <meta-data
                android:name="android.autofill"
                android:resource="@xml/autofill_service" />
        </service>
        
        <!-- Accessibility Service for advanced autofill -->
        <service
            android:name=".accessibility.AgiesAccessibilityService"
            android:exported="false"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service" />
        </service>
    </application>
</manifest>
```

## Key Android Features

### 1. Autofill Framework
- Android Autofill Service
- Accessibility Service for legacy apps
- Overlay autofill for all apps

### 2. Biometric Security
- Fingerprint authentication
- Face unlock integration
- Hardware security module

### 3. Background Protection
- App lock on background
- Screenshot prevention
- Root detection

## Build Commands
```bash
# Development build
npx react-native run-android

# Production build
cd android
./gradlew assembleRelease

# Generate signed APK
./gradlew bundleRelease

# Install on device
adb install app/build/outputs/apk/release/app-release.apk
```
