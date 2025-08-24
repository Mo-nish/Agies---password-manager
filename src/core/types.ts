export interface SecurityLevel {
  id: string;
  name: string;
  description: string;
  encryptionStrength: number; // 1-10
  mazeDepth: number;
  honeypotCount: number;
  trapComplexity: number;
}

export interface VaultEntry {
  id: string;
  userId: string;
  title: string;
  encryptedData: string;
  metadata: VaultMetadata;
  securityLevel: SecurityLevel;
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

export interface VaultMetadata {
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  expirationDate?: Date;
  autoRotate: boolean;
  darkWebMonitoring: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  hashedPassword: string;
  salt: string;
  twoFactorSecret?: string;
  biometricData?: string;
  hardwareKeyId?: string;
  securityLevel: SecurityLevel;
  lastLogin: Date;
  failedAttempts: number;
  lockedUntil?: Date;
}

export interface AttackAttempt {
  id: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  attackType: 'brute_force' | 'sql_injection' | 'xss' | 'unknown';
  target: string;
  payload: string | undefined;
  blocked: boolean;
  mazeLayer: number;
  honeypotTriggered: boolean;
  aiResponse: AIResponse;
}

export interface AIResponse {
  action: 'block' | 'redirect' | 'honeypot' | 'maze_shift' | 'trap_set';
  confidence: number;
  reasoning: string;
  newMazeConfiguration: MazeConfiguration | undefined;
}

export interface MazeConfiguration {
  layerCount: number;
  encryptionZones: EncryptionZone[];
  honeypotPositions: HoneypotPosition[];
  trapPositions: TrapPosition[];
  shiftPattern: ShiftPattern;
}

export interface EncryptionZone {
  id: string;
  layer: number;
  algorithm: string;
  keyRotationInterval: number;
  lastRotation: Date;
  complexity: number;
}

export interface HoneypotPosition {
  id: string;
  layer: number;
  position: number;
  fakeData: string;
  triggerConditions: string[];
  responseDelay: number;
}

export interface TrapPosition {
  id: string;
  layer: number;
  position: number;
  trapType: 'data_corruption' | 'endless_loop' | 'fake_success' | 'timeout';
  activationConditions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ShiftPattern {
  frequency: number; // milliseconds
  algorithm: 'random' | 'time_based' | 'attack_based' | 'ai_driven';
  complexity: number;
  lastShift: Date;
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  eventType: 'intrusion' | 'maze_shift' | 'honeypot_triggered' | 'trap_activated' | 'ai_response' | 'decoy_triggered';
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  metadata: Record<string, any>;
  userId?: string;
  ipAddress: string | undefined;
}

export interface DarkWebAlert {
  id: string;
  timestamp: Date;
  credentialType: 'password' | 'email' | 'username' | 'api_key';
  value: string;
  source: string;
  confidence: number;
  actionTaken: 'auto_rotate' | 'notify_user' | 'trap_set' | 'none';
  status: 'active' | 'resolved' | 'investigating';
}

export interface DecoyVault {
  id: string;
  vaultId: string; // Links to real vault ID for confusion
  decoyData: {
    passwords: Array<{ title: string; username: string; password: string; url: string }>;
    notes: Array<{ title: string; content: string }>;
    creditCards: Array<{ name: string; number: string; expiry: string; cvv: string }>;
  };
  triggerMechanism: 'time_based' | 'access_pattern' | 'ip_based' | 'ai_detected';
  activationThreshold: number;
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AIThreatLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-100
  confidence: number; // 0-1
  reasoning: string;
  recommendedActions: string[];
  timestamp: Date;
}

export interface MazeLayer {
  id: string;
  layerNumber: number;
  encryptionAlgorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'Twofish' | 'Serpent' | 'Camellia';
  keyRotationInterval: number; // milliseconds
  complexityLevel: number; // 1-10
  honeypotDensity: number; // 0-1 (percentage of fake entries)
  trapComplexity: number; // 1-10
  isActive: boolean;
  lastAccessed: Date;
  accessCount: number;
}

export interface OneWayEntryConfig {
  entryVerificationLevels: number; // Number of verification steps for entry
  exitVerificationLevels: number; // Number of verification steps for exit
  maxEntryAttempts: number;
  maxExitAttempts: number;
  entryCooldown: number; // milliseconds
  exitCooldown: number; // milliseconds
  biometricRequired: boolean;
  hardwareKeyRequired: boolean;
  timeWindow: number; // milliseconds - valid time window for exit
}
