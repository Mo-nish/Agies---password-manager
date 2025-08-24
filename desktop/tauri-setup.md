# Agies Desktop App (Tauri) Setup

## Why Tauri?
- **Smaller Bundle Size**: ~10MB vs 150MB+ for Electron
- **Better Security**: Rust backend with minimal attack surface
- **Native Performance**: Direct system APIs
- **Cross-Platform**: Windows, macOS, Linux

## Prerequisites
- Rust 1.70+
- Node.js 18+
- Platform-specific dependencies:
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: webkit2gtk, libgtk-3-dev, libayatana-appindicator3-dev

## Setup Commands

```bash
# Install Tauri CLI
cargo install tauri-cli

# Initialize Tauri in existing project
cd /Users/monishreddy/Documents/MayaVault
npm install @tauri-apps/api @tauri-apps/cli

# Create Tauri configuration
npx tauri init
```

## Tauri Configuration

```json
// src-tauri/tauri.conf.json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:3002",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Agies Password Manager",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": true
      },
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "createDir": true,
        "removeDir": true,
        "removeFile": true,
        "scope": ["$APPDATA/agies/*", "$HOME/.agies/*"]
      },
      "clipboard": {
        "all": true
      },
      "globalShortcut": {
        "all": true
      },
      "notification": {
        "all": true
      },
      "os": {
        "all": true
      }
    },
    "bundle": {
      "active": true,
      "category": "Productivity",
      "copyright": "2024 Agies Security",
      "deb": {
        "depends": ["libwebkit2gtk-4.0-37"]
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.agies.passwordmanager",
      "longDescription": "Military-grade password manager with Chakravyuham Maze Engine",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "Agies Password Manager",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.agies.com"
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 800,
        "resizable": true,
        "title": "Agies Password Manager",
        "width": 1200,
        "minWidth": 800,
        "minHeight": 600,
        "center": true,
        "decorations": true,
        "transparent": false,
        "alwaysOnTop": false
      }
    ],
    "systemTray": {
      "iconPath": "icons/icon.png",
      "iconAsTemplate": true,
      "menuOnLeftClick": false
    }
  }
}
```

## Desktop Features

### 1. System Integration
- System tray integration
- Global hotkeys for quick access
- Native clipboard access
- Auto-lock on system sleep

### 2. Security Features
- Encrypted local storage
- Screen lock detection
- Process monitoring
- Secure memory management

### 3. Autofill Integration
- Browser extension communication
- System-wide autofill hooks
- Secure IPC for password data

## Rust Backend (src-tauri/src/main.rs)

```rust
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, SystemTray, SystemTrayMenu, SystemTrayMenuItem, CustomMenuItem};

#[tauri::command]
async fn secure_encrypt(data: String, key: String) -> Result<String, String> {
    // Implement Chakravyuham encryption
    Ok(format!("encrypted:{}", data))
}

#[tauri::command]
async fn secure_decrypt(encrypted: String, key: String) -> Result<String, String> {
    // Implement Chakravyuham decryption
    Ok(encrypted.replace("encrypted:", ""))
}

#[tauri::command]
async fn check_security_status() -> Result<String, String> {
    // Implement security monitoring
    Ok("secure".to_string())
}

fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show", "Show Agies"))
        .add_item(CustomMenuItem::new("lock", "Lock Vault"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| {
            match event {
                tauri::SystemTrayEvent::LeftClick { .. } => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                tauri::SystemTrayEvent::MenuItemClick { id, .. } => {
                    match id.as_str() {
                        "quit" => {
                            std::process::exit(0);
                        }
                        "show" => {
                            let window = app.get_window("main").unwrap();
                            window.show().unwrap();
                        }
                        "lock" => {
                            // Implement vault locking
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            secure_encrypt,
            secure_decrypt,
            check_security_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Build Commands
```bash
# Development
npm run tauri dev

# Production builds
npm run tauri build

# Platform-specific builds
npm run tauri build -- --target x86_64-pc-windows-msvc     # Windows
npm run tauri build -- --target x86_64-apple-darwin        # macOS Intel
npm run tauri build -- --target aarch64-apple-darwin       # macOS Apple Silicon
npm run tauri build -- --target x86_64-unknown-linux-gnu   # Linux
```
