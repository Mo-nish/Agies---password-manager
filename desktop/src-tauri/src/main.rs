// 🛡️ Agies Password Manager - Desktop Application
// High-performance Rust backend with advanced security features

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{
    api::{dialog, notification::Notification, path::config_dir, shell},
    AppHandle, CustomMenuItem, Manager, Menu, MenuItem, State, Submenu, SystemTray, SystemTrayEvent,
    SystemTrayMenu, SystemTrayMenuItem, WindowBuilder, WindowUrl,
};

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use uuid::Uuid;
use log::{error, info, warn};

mod crypto;
mod database;
mod security;
mod sync;
mod biometric;
mod backup;
mod utils;

use crypto::{CryptoManager, EncryptionConfig};
use database::{DatabaseManager, Vault, Password, User};
use security::{SecurityManager, ThreatLevel, SecurityEvent};
use sync::SyncManager;

// Application state
#[derive(Default)]
struct AppState {
    crypto_manager: Arc<Mutex<Option<CryptoManager>>>,
    database_manager: Arc<Mutex<Option<DatabaseManager>>>,
    security_manager: Arc<Mutex<SecurityManager>>,
    sync_manager: Arc<Mutex<Option<SyncManager>>>,
    user_session: Arc<Mutex<Option<UserSession>>>,
    is_locked: Arc<Mutex<bool>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct UserSession {
    user_id: String,
    email: String,
    created_at: u64,
    last_activity: u64,
    biometric_enabled: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthRequest {
    email: String,
    password: String,
    remember_me: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthResponse {
    success: bool,
    message: String,
    user_id: Option<String>,
    session_token: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct VaultRequest {
    name: String,
    description: Option<String>,
    icon: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct PasswordRequest {
    vault_id: String,
    title: String,
    username: String,
    password: String,
    url: Option<String>,
    notes: Option<String>,
    tags: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct SecurityCheckResult {
    weak_passwords: u32,
    reused_passwords: u32,
    old_passwords: u32,
    breached_passwords: u32,
    overall_score: u8,
    recommendations: Vec<String>,
}

// Tauri commands
#[tauri::command]
async fn authenticate_user(
    request: AuthRequest,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<AuthResponse, String> {
    info!("Authentication attempt for: {}", request.email);
    
    let mut security_manager = state.security_manager.lock().unwrap();
    
    // Check for brute force attempts
    if security_manager.check_brute_force(&request.email) {
        security_manager.log_security_event(SecurityEvent {
            event_type: "authentication_blocked".to_string(),
            severity: ThreatLevel::High,
            description: format!("Brute force attempt blocked for: {}", request.email),
            user_id: None,
            timestamp: get_current_timestamp(),
        });
        
        return Ok(AuthResponse {
            success: false,
            message: "Too many failed attempts. Please try again later.".to_string(),
            user_id: None,
            session_token: None,
        });
    }
    
    // Initialize database if not already done
    let db_manager = {
        let mut db_guard = state.database_manager.lock().unwrap();
        if db_guard.is_none() {
            let config_path = config_dir()
                .ok_or("Failed to get config directory")?
                .join("agies");
            
            *db_guard = Some(DatabaseManager::new(&config_path).await
                .map_err(|e| format!("Database initialization failed: {}", e))?);
        }
        db_guard.as_ref().unwrap().clone()
    };
    
    // Authenticate user
    match db_manager.authenticate_user(&request.email, &request.password).await {
        Ok(user) => {
            info!("User authenticated successfully: {}", user.email);
            
            // Create user session
            let session = UserSession {
                user_id: user.id.clone(),
                email: user.email.clone(),
                created_at: get_current_timestamp(),
                last_activity: get_current_timestamp(),
                biometric_enabled: user.biometric_enabled,
            };
            
            *state.user_session.lock().unwrap() = Some(session.clone());
            *state.is_locked.lock().unwrap() = false;
            
            // Initialize crypto manager with user's master key
            let mut crypto_guard = state.crypto_manager.lock().unwrap();
            *crypto_guard = Some(CryptoManager::new(&request.password, &user.salt)
                .map_err(|e| format!("Crypto initialization failed: {}", e))?);
            
            // Initialize sync manager
            let mut sync_guard = state.sync_manager.lock().unwrap();
            *sync_guard = Some(SyncManager::new(&user.id, "https://agies-password-manager.onrender.com").await
                .map_err(|e| format!("Sync initialization failed: {}", e))?);
            
            // Log successful authentication
            security_manager.log_security_event(SecurityEvent {
                event_type: "authentication_success".to_string(),
                severity: ThreatLevel::Info,
                description: format!("User logged in: {}", user.email),
                user_id: Some(user.id.clone()),
                timestamp: get_current_timestamp(),
            });
            
            // Show welcome notification
            Notification::new(&app_handle.config().tauri.bundle.identifier)
                .title("Welcome to Agies")
                .body(&format!("Welcome back, {}!", user.email))
                .show()
                .map_err(|e| format!("Notification failed: {}", e))?;
            
            Ok(AuthResponse {
                success: true,
                message: "Authentication successful".to_string(),
                user_id: Some(user.id),
                session_token: Some(Uuid::new_v4().to_string()),
            })
        }
        Err(e) => {
            warn!("Authentication failed for {}: {}", request.email, e);
            
            security_manager.record_failed_attempt(&request.email);
            security_manager.log_security_event(SecurityEvent {
                event_type: "authentication_failed".to_string(),
                severity: ThreatLevel::Medium,
                description: format!("Failed login attempt: {}", request.email),
                user_id: None,
                timestamp: get_current_timestamp(),
            });
            
            Ok(AuthResponse {
                success: false,
                message: "Invalid credentials".to_string(),
                user_id: None,
                session_token: None,
            })
        }
    }
}

#[tauri::command]
async fn register_user(
    request: AuthRequest,
    state: State<'_, AppState>,
) -> Result<AuthResponse, String> {
    info!("Registration attempt for: {}", request.email);
    
    // Initialize database if not already done
    let db_manager = {
        let mut db_guard = state.database_manager.lock().unwrap();
        if db_guard.is_none() {
            let config_path = config_dir()
                .ok_or("Failed to get config directory")?
                .join("agies");
            
            *db_guard = Some(DatabaseManager::new(&config_path).await
                .map_err(|e| format!("Database initialization failed: {}", e))?);
        }
        db_guard.as_ref().unwrap().clone()
    };
    
    // Create new user
    match db_manager.create_user(&request.email, &request.password).await {
        Ok(user) => {
            info!("User registered successfully: {}", user.email);
            
            // Log successful registration
            let mut security_manager = state.security_manager.lock().unwrap();
            security_manager.log_security_event(SecurityEvent {
                event_type: "user_registered".to_string(),
                severity: ThreatLevel::Info,
                description: format!("New user registered: {}", user.email),
                user_id: Some(user.id.clone()),
                timestamp: get_current_timestamp(),
            });
            
            Ok(AuthResponse {
                success: true,
                message: "Registration successful".to_string(),
                user_id: Some(user.id),
                session_token: None,
            })
        }
        Err(e) => {
            warn!("Registration failed for {}: {}", request.email, e);
            
            Ok(AuthResponse {
                success: false,
                message: format!("Registration failed: {}", e),
                user_id: None,
                session_token: None,
            })
        }
    }
}

#[tauri::command]
async fn lock_application(state: State<'_, AppState>) -> Result<(), String> {
    info!("Locking application");
    
    *state.is_locked.lock().unwrap() = true;
    *state.crypto_manager.lock().unwrap() = None;
    
    // Clear sensitive data from memory
    if let Some(session) = state.user_session.lock().unwrap().as_ref() {
        let mut security_manager = state.security_manager.lock().unwrap();
        security_manager.log_security_event(SecurityEvent {
            event_type: "application_locked".to_string(),
            severity: ThreatLevel::Info,
            description: "Application locked by user".to_string(),
            user_id: Some(session.user_id.clone()),
            timestamp: get_current_timestamp(),
        });
    }
    
    Ok(())
}

#[tauri::command]
async fn get_vaults(state: State<'_, AppState>) -> Result<Vec<Vault>, String> {
    let session = state.user_session.lock().unwrap();
    let session = session.as_ref().ok_or("Not authenticated")?;
    
    let db_manager = state.database_manager.lock().unwrap();
    let db_manager = db_manager.as_ref().ok_or("Database not initialized")?;
    
    db_manager.get_user_vaults(&session.user_id).await
        .map_err(|e| format!("Failed to get vaults: {}", e))
}

#[tauri::command]
async fn create_vault(
    request: VaultRequest,
    state: State<'_, AppState>,
) -> Result<Vault, String> {
    let session = state.user_session.lock().unwrap();
    let session = session.as_ref().ok_or("Not authenticated")?;
    
    let db_manager = state.database_manager.lock().unwrap();
    let db_manager = db_manager.as_ref().ok_or("Database not initialized")?;
    
    let vault = db_manager.create_vault(&session.user_id, &request.name, 
        request.description.as_deref(), request.icon.as_deref()).await
        .map_err(|e| format!("Failed to create vault: {}", e))?;
    
    info!("Vault created: {} for user: {}", vault.name, session.user_id);
    
    Ok(vault)
}

#[tauri::command]
async fn get_vault_passwords(
    vault_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<Password>, String> {
    let session = state.user_session.lock().unwrap();
    let session = session.as_ref().ok_or("Not authenticated")?;
    
    let db_manager = state.database_manager.lock().unwrap();
    let db_manager = db_manager.as_ref().ok_or("Database not initialized")?;
    
    let crypto_manager = state.crypto_manager.lock().unwrap();
    let crypto_manager = crypto_manager.as_ref().ok_or("Crypto not initialized")?;
    
    // Get encrypted passwords
    let encrypted_passwords = db_manager.get_vault_passwords(&vault_id).await
        .map_err(|e| format!("Failed to get passwords: {}", e))?;
    
    // Decrypt passwords
    let mut passwords = Vec::new();
    for mut password in encrypted_passwords {
        // Decrypt sensitive fields
        password.password = crypto_manager.decrypt(&password.password)
            .map_err(|e| format!("Failed to decrypt password: {}", e))?;
        
        if let Some(notes) = &password.notes {
            password.notes = Some(crypto_manager.decrypt(notes)
                .map_err(|e| format!("Failed to decrypt notes: {}", e))?);
        }
        
        passwords.push(password);
    }
    
    Ok(passwords)
}

#[tauri::command]
async fn add_password(
    request: PasswordRequest,
    state: State<'_, AppState>,
) -> Result<Password, String> {
    let session = state.user_session.lock().unwrap();
    let session = session.as_ref().ok_or("Not authenticated")?;
    
    let db_manager = state.database_manager.lock().unwrap();
    let db_manager = db_manager.as_ref().ok_or("Database not initialized")?;
    
    let crypto_manager = state.crypto_manager.lock().unwrap();
    let crypto_manager = crypto_manager.as_ref().ok_or("Crypto not initialized")?;
    
    // Encrypt sensitive data
    let encrypted_password = crypto_manager.encrypt(&request.password)
        .map_err(|e| format!("Failed to encrypt password: {}", e))?;
    
    let encrypted_notes = if let Some(notes) = &request.notes {
        Some(crypto_manager.encrypt(notes)
            .map_err(|e| format!("Failed to encrypt notes: {}", e))?)
    } else {
        None
    };
    
    let password = db_manager.create_password(
        &request.vault_id,
        &request.title,
        &request.username,
        &encrypted_password,
        request.url.as_deref(),
        encrypted_notes.as_deref(),
        &request.tags,
    ).await.map_err(|e| format!("Failed to create password: {}", e))?;
    
    info!("Password added: {} to vault: {}", password.title, request.vault_id);
    
    Ok(password)
}

#[tauri::command]
async fn generate_secure_password(
    length: usize,
    include_symbols: bool,
    include_numbers: bool,
    include_uppercase: bool,
    include_lowercase: bool,
) -> Result<String, String> {
    use rand::Rng;
    
    let mut charset = String::new();
    
    if include_lowercase {
        charset.push_str("abcdefghijklmnopqrstuvwxyz");
    }
    if include_uppercase {
        charset.push_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if include_numbers {
        charset.push_str("0123456789");
    }
    if include_symbols {
        charset.push_str("!@#$%^&*()_+-=[]{}|;:,.<>?");
    }
    
    if charset.is_empty() {
        return Err("No character types selected".to_string());
    }
    
    let charset: Vec<char> = charset.chars().collect();
    let mut rng = rand::thread_rng();
    
    let password: String = (0..length)
        .map(|_| charset[rng.gen_range(0..charset.len())])
        .collect();
    
    Ok(password)
}

#[tauri::command]
async fn run_security_check(state: State<'_, AppState>) -> Result<SecurityCheckResult, String> {
    let session = state.user_session.lock().unwrap();
    let session = session.as_ref().ok_or("Not authenticated")?;
    
    let db_manager = state.database_manager.lock().unwrap();
    let db_manager = db_manager.as_ref().ok_or("Database not initialized")?;
    
    let security_manager = state.security_manager.lock().unwrap();
    
    // Run comprehensive security analysis
    let result = security_manager.run_security_check(db_manager, &session.user_id).await
        .map_err(|e| format!("Security check failed: {}", e))?;
    
    info!("Security check completed for user: {}", session.user_id);
    
    Ok(result)
}

#[tauri::command]
async fn enable_biometric_auth(state: State<'_, AppState>) -> Result<bool, String> {
    let session = state.user_session.lock().unwrap();
    let session = session.as_ref().ok_or("Not authenticated")?;
    
    #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
    {
        let result = biometric::enable_biometric_auth(&session.user_id).await
            .map_err(|e| format!("Failed to enable biometric auth: {}", e))?;
        
        if result {
            info!("Biometric authentication enabled for user: {}", session.user_id);
        }
        
        Ok(result)
    }
    
    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    {
        Err("Biometric authentication not supported on this platform".to_string())
    }
}

#[tauri::command]
async fn export_vault_data(
    vault_id: String,
    format: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let session = state.user_session.lock().unwrap();
    let session = session.as_ref().ok_or("Not authenticated")?;
    
    // Get vault data
    let passwords = get_vault_passwords(vault_id.clone(), state).await?;
    
    match format.as_str() {
        "json" => {
            let json_data = serde_json::to_string_pretty(&passwords)
                .map_err(|e| format!("JSON serialization failed: {}", e))?;
            Ok(json_data)
        }
        "csv" => {
            let mut csv_data = String::from("Title,Username,Password,URL,Notes\n");
            for password in passwords {
                csv_data.push_str(&format!(
                    "{},{},{},{},{}\n",
                    password.title,
                    password.username,
                    password.password,
                    password.url.unwrap_or_default(),
                    password.notes.unwrap_or_default()
                ));
            }
            Ok(csv_data)
        }
        _ => Err("Unsupported export format".to_string()),
    }
}

// System tray
fn create_system_tray() -> SystemTray {
    let lock_app = CustomMenuItem::new("lock_app".to_string(), "Lock App");
    let show_app = CustomMenuItem::new("show_app".to_string(), "Show Agies");
    let security_check = CustomMenuItem::new("security_check".to_string(), "Run Security Check");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    
    let tray_menu = SystemTrayMenu::new()
        .add_item(show_app)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(lock_app)
        .add_item(security_check)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    
    SystemTray::new().with_menu(tray_menu)
}

// Application menu
fn create_app_menu() -> Menu {
    let app_menu = Submenu::new("Agies", Menu::new()
        .add_native_item(MenuItem::About("Agies Password Manager".to_string(), 
            tauri::AboutMetadata::default()))
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Services)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Quit));
    
    let file_menu = Submenu::new("File", Menu::new()
        .add_item(CustomMenuItem::new("new_vault", "New Vault"))
        .add_item(CustomMenuItem::new("import_data", "Import Data"))
        .add_item(CustomMenuItem::new("export_data", "Export Data"))
        .add_native_item(MenuItem::Separator)
        .add_item(CustomMenuItem::new("lock_app", "Lock App")));
    
    let edit_menu = Submenu::new("Edit", Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste)
        .add_native_item(MenuItem::SelectAll));
    
    let security_menu = Submenu::new("Security", Menu::new()
        .add_item(CustomMenuItem::new("security_check", "Run Security Check"))
        .add_item(CustomMenuItem::new("generate_password", "Generate Password"))
        .add_item(CustomMenuItem::new("enable_biometric", "Enable Biometric Auth"))
        .add_native_item(MenuItem::Separator)
        .add_item(CustomMenuItem::new("security_settings", "Security Settings")));
    
    let window_menu = Submenu::new("Window", Menu::new()
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::Zoom));
    
    Menu::new()
        .add_submenu(app_menu)
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
        .add_submenu(security_menu)
        .add_submenu(window_menu)
}

// Utility functions
fn get_current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

fn main() {
    env_logger::init();
    info!("Starting Agies Password Manager Desktop");
    
    let app_state = AppState::default();
    
    tauri::Builder::default()
        .manage(app_state)
        .menu(create_app_menu())
        .system_tray(create_system_tray())
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show_app" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                "lock_app" => {
                    // Trigger lock command
                    let _ = app.emit_all("lock_requested", {});
                }
                "security_check" => {
                    // Open security check window
                    let _ = WindowBuilder::new(
                        app,
                        "security_check",
                        WindowUrl::App("security-check.html".into())
                    )
                    .title("Security Check")
                    .inner_size(600.0, 400.0)
                    .resizable(false)
                    .build();
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            authenticate_user,
            register_user,
            lock_application,
            get_vaults,
            create_vault,
            get_vault_passwords,
            add_password,
            generate_secure_password,
            run_security_check,
            enable_biometric_auth,
            export_vault_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
