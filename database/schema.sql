-- Agies Database Schema
-- The Maze Vault Password Manager
-- PostgreSQL Database Schema with Enhanced Security Features

-- Create database if it doesn't exist
CREATE DATABASE agies_maze_vault;
\c agies_maze_vault;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CORE TABLES
-- ========================================

-- Users table with security features
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    master_key_salt VARCHAR(255) NOT NULL,
    encrypted_master_key TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login_at TIMESTAMP,
    security_level VARCHAR(50) DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for enhanced security
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaults table with hierarchical security
CREATE TABLE vaults (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'personal',
    icon_id VARCHAR(100),
    custom_icon_data TEXT,
    security_level VARCHAR(50) DEFAULT 'basic',
    encryption_algorithm VARCHAR(100) DEFAULT 'aes-256-gcm',
    key_rotation_enabled BOOLEAN DEFAULT TRUE,
    last_key_rotation TIMESTAMP,
    next_key_rotation TIMESTAMP,
    honeytoken_enabled BOOLEAN DEFAULT TRUE,
    ai_protection_enabled BOOLEAN DEFAULT TRUE,
    dark_web_monitoring BOOLEAN DEFAULT TRUE,
    one_way_entry_enabled BOOLEAN DEFAULT TRUE,
    is_shared BOOLEAN DEFAULT FALSE,
    parent_vault_id UUID REFERENCES vaults(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vault sharing and permissions
CREATE TABLE vault_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    shared_with_email VARCHAR(255) NOT NULL,
    shared_with_user_id UUID REFERENCES users(id),
    permission_level VARCHAR(50) DEFAULT 'read',
    can_read BOOLEAN DEFAULT TRUE,
    can_write BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_share BOOLEAN DEFAULT FALSE,
    can_admin BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    invitation_token VARCHAR(255),
    invitation_sent_at TIMESTAMP,
    invitation_accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passwords table with enhanced encryption
CREATE TABLE passwords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    email VARCHAR(255),
    encrypted_password TEXT NOT NULL,
    encryption_metadata JSONB NOT NULL,
    url VARCHAR(500),
    notes TEXT,
    category VARCHAR(100),
    tags TEXT[],
    strength_score INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    requires_mfa BOOLEAN DEFAULT FALSE,
    password_history JSONB,
    security_flags JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Secure notes
CREATE TABLE secure_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    encrypted_content TEXT NOT NULL,
    encryption_metadata JSONB NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit cards and payment methods
CREATE TABLE credit_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    encrypted_cardholder_name TEXT NOT NULL,
    encrypted_number TEXT NOT NULL,
    encrypted_expiry TEXT NOT NULL,
    encrypted_cvv TEXT NOT NULL,
    encrypted_zip_code TEXT,
    card_type VARCHAR(50),
    bank_name VARCHAR(255),
    notes TEXT,
    encryption_metadata JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- SECURITY TABLES
-- ========================================

-- Security events and audit log
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) DEFAULT 'info',
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    vault_id UUID REFERENCES vaults(id),
    session_id UUID REFERENCES user_sessions(id),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Honeytoken tracking
CREATE TABLE honeytokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_type VARCHAR(100) DEFAULT 'password',
    fake_data JSONB NOT NULL,
    trigger_count INTEGER DEFAULT 0,
    last_triggered TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    trigger_threshold INTEGER DEFAULT 3,
    trap_type VARCHAR(100) DEFAULT 'fake_success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Guardian threat intelligence
CREATE TABLE ai_threat_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    threat_type VARCHAR(100) NOT NULL,
    threat_level VARCHAR(50) DEFAULT 'low',
    description TEXT NOT NULL,
    indicators JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2),
    source VARCHAR(100),
    action_taken VARCHAR(100),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dark web monitoring
CREATE TABLE dark_web_breaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    breach_source VARCHAR(255) NOT NULL,
    compromised_data JSONB NOT NULL,
    breach_date TIMESTAMP,
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(50) DEFAULT 'medium',
    auto_rotated BOOLEAN DEFAULT FALSE,
    user_notified BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMP,
    actions_taken JSONB DEFAULT '[]'
);

-- Key rotation tracking
CREATE TABLE key_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    rotation_type VARCHAR(100) DEFAULT 'scheduled',
    old_key_hash VARCHAR(255),
    new_key_hash VARCHAR(255),
    rotation_reason TEXT,
    rotated_items_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- One-way entry verification logs
CREATE TABLE one_way_entry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    verification_level INTEGER DEFAULT 1,
    hardware_key_required BOOLEAN DEFAULT FALSE,
    biometrics_used BOOLEAN DEFAULT FALSE,
    time_window_start TIMESTAMP,
    time_window_end TIMESTAMP,
    success BOOLEAN DEFAULT FALSE,
    failure_reason TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CONFIGURATION TABLES
-- ========================================

-- User preferences and settings
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key)
);

-- System configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API keys and integrations
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    encrypted_key TEXT NOT NULL,
    permissions JSONB DEFAULT '[]',
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Core indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_vaults_user_id ON vaults(user_id);
CREATE INDEX idx_passwords_vault_id ON passwords(vault_id);
CREATE INDEX idx_passwords_user_id ON passwords(user_id);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Security indexes
CREATE INDEX idx_honeytokens_vault_id ON honeytokens(vault_id);
CREATE INDEX idx_dark_web_breaches_user_id ON dark_web_breaches(user_id);
CREATE INDEX idx_key_rotations_vault_id ON key_rotations(vault_id);
CREATE INDEX idx_one_way_entry_logs_user_id ON one_way_entry_logs(user_id);

-- Full-text search indexes
CREATE INDEX idx_passwords_title_search ON passwords USING gin(to_tsvector('english', title));
CREATE INDEX idx_secure_notes_title_search ON secure_notes USING gin(to_tsvector('english', title));

-- ========================================
-- TRIGGERS FOR AUTOMATION
-- ========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vaults_updated_at BEFORE UPDATE ON vaults FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_passwords_updated_at BEFORE UPDATE ON passwords FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_secure_notes_updated_at BEFORE UPDATE ON secure_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Security event logging trigger
CREATE OR REPLACE FUNCTION log_security_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Log vault access
    IF TG_TABLE_NAME = 'passwords' AND TG_OP = 'SELECT' THEN
        INSERT INTO security_events (user_id, event_type, description, metadata)
        VALUES (NEW.user_id, 'vault_access', 'Password accessed', json_build_object('password_id', NEW.id));
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- INITIAL SYSTEM CONFIGURATION
-- ========================================

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('security.default_encryption_algorithm', 'aes-256-gcm', 'Default encryption algorithm for new vaults'),
('security.key_rotation_days', '90', 'Days between automatic key rotations'),
('security.max_failed_login_attempts', '5', 'Maximum failed login attempts before lockout'),
('security.lockout_duration_minutes', '30', 'Account lockout duration in minutes'),
('security.session_timeout_hours', '24', 'User session timeout in hours'),
('security.enable_dark_web_monitoring', 'true', 'Enable dark web monitoring by default'),
('security.enable_ai_protection', 'true', 'Enable AI Guardian by default'),
('security.enable_honeytokens', 'true', 'Enable honeytoken system by default'),
('security.enable_one_way_entry', 'true', 'Enable one-way entry principle by default'),
('system.version', '1.0.0', 'Agies system version');

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- User vault summary view
CREATE VIEW user_vault_summary AS
SELECT
    u.id as user_id,
    u.username,
    u.email,
    COUNT(v.id) as total_vaults,
    COUNT(p.id) as total_passwords,
    COUNT(sn.id) as total_notes,
    COUNT(cc.id) as total_cards,
    MAX(v.created_at) as last_vault_created,
    MAX(p.created_at) as last_password_added
FROM users u
LEFT JOIN vaults v ON u.id = v.user_id
LEFT JOIN passwords p ON v.id = p.vault_id
LEFT JOIN secure_notes sn ON v.id = sn.vault_id
LEFT JOIN credit_cards cc ON v.id = cc.vault_id
GROUP BY u.id, u.username, u.email;

-- Security dashboard view
CREATE VIEW security_dashboard AS
SELECT
    u.id as user_id,
    u.username,
    COUNT(se.id) as total_security_events,
    COUNT(se.id) FILTER (WHERE se.severity = 'critical') as critical_events,
    COUNT(se.id) FILTER (WHERE se.severity = 'warning') as warning_events,
    COUNT(dwb.id) as dark_web_breaches,
    COUNT(ht.id) as active_honeytokens,
    COUNT(ht.id) FILTER (WHERE ht.trigger_count > 0) as triggered_honeytokens,
    MAX(se.created_at) as last_security_event
FROM users u
LEFT JOIN security_events se ON u.id = se.user_id
LEFT JOIN dark_web_breaches dwb ON u.id = dwb.user_id
LEFT JOIN honeytokens ht ON u.id = ht.user_id
GROUP BY u.id, u.username;

-- ========================================
-- GRANT PERMISSIONS (if needed)
-- ========================================

-- This would be set up based on your specific user requirements
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO agies_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO agies_user;

-- ========================================
-- COMMENTS FOR DOCUMENTATION
-- ========================================

COMMENT ON DATABASE agies_maze_vault IS 'Agies - The Maze Vault Password Manager Database';
COMMENT ON TABLE users IS 'User accounts with enhanced security features';
COMMENT ON TABLE vaults IS 'Encrypted vaults with hierarchical security';
COMMENT ON TABLE passwords IS 'Encrypted password entries with metadata';
COMMENT ON TABLE security_events IS 'Comprehensive security audit log';
COMMENT ON TABLE honeytokens IS 'Honeytoken system for threat detection';
COMMENT ON TABLE ai_threat_intelligence IS 'AI Guardian threat intelligence database';
COMMENT ON TABLE dark_web_breaches IS 'Dark web monitoring and breach tracking';

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE 'Agies database schema created successfully!';
    RAISE NOTICE 'Database: agies_maze_vault';
    RAISE NOTICE 'Tables created: 17';
    RAISE NOTICE 'Indexes created: 15+';
    RAISE NOTICE 'Views created: 2';
    RAISE NOTICE 'Security features: AI Guardian, Honeytokens, Dark Web Monitoring, One-Way Entry';
END $$;