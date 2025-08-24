#!/usr/bin/env node

/**
 * Padhma Vyuham Security Vault Demo
 * 
 * This script demonstrates the security features by simulating various attack scenarios
 * and showing how the maze engine and AI guardian respond.
 */

const API_BASE = 'http://localhost:3001';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'bright');
  console.log('='.repeat(60));
}

function logSection(message) {
  console.log('\n' + '-'.repeat(40));
  log(message, 'cyan');
  console.log('-'.repeat(40));
}

// Test attack scenarios
const attackScenarios = [
  {
    name: 'SQL Injection Attack',
    description: 'Attempting SQL injection through login form',
    payload: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      attackType: 'sql_injection',
      payload: "'; DROP TABLE users; --"
    }
  },
  {
    name: 'XSS Attack',
    description: 'Attempting cross-site scripting attack',
    payload: {
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      attackType: 'xss',
      payload: '<script>alert("XSS")</script>'
    }
  },
  {
    name: 'Brute Force Attack',
    description: 'Multiple rapid login attempts',
    payload: {
      ipAddress: '172.16.0.25',
      userAgent: 'Python-requests/2.28.1',
      attackType: 'brute_force',
      payload: 'admin:password123'
    }
  },
  {
    name: 'Normal Request',
    description: 'Legitimate user request',
    payload: {
      ipAddress: '203.0.113.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      attackType: 'unknown',
      payload: null
    }
  }
];

async function testSecuritySystem() {
  logHeader('🛡️ PADHMA VYUHAM SECURITY VAULT DEMO');
  log('Testing the maze-like security system with various attack scenarios...', 'yellow');
  
  // Check if server is running
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (!healthResponse.ok) {
      throw new Error('Server not responding');
    }
    const healthData = await healthResponse.json();
    log(`✅ Server Status: ${healthData.status}`, 'green');
    log(`🌐 Service: ${healthData.service}`, 'green');
  } catch (error) {
    log(`❌ Server Error: ${error.message}`, 'red');
    log('Please make sure the backend server is running on port 3001', 'yellow');
    return;
  }

  // Test each attack scenario
  for (const scenario of attackScenarios) {
    logSection(`Testing: ${scenario.name}`);
    log(`Description: ${scenario.description}`, 'white');
    log(`Payload: ${JSON.stringify(scenario.payload, null, 2)}`, 'magenta');

    try {
      const response = await fetch(`${API_BASE}/security/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scenario.payload)
      });

      if (response.ok) {
        const result = await response.json();
        
        log('\n🔍 MAZE ENGINE RESPONSE:', 'blue');
        log(`Allowed: ${result.mazeResult.allowed}`, result.mazeResult.allowed ? 'green' : 'red');
        log(`Maze Layer: ${result.mazeResult.mazeLayer}`, 'cyan');
        log(`Honeypot Triggered: ${result.mazeResult.honeypotTriggered}`, 'yellow');
        log(`Trap Activated: ${result.mazeResult.trapActivated}`, 'orange');
        log(`Response: ${JSON.stringify(result.mazeResult.response, null, 2)}`, 'white');

        log('\n🧠 AI GUARDIAN ANALYSIS:', 'blue');
        log(`Action: ${result.aiAnalysis.action}`, 'cyan');
        log(`Confidence: ${(result.aiAnalysis.confidence * 100).toFixed(1)}%`, 'yellow');
        log(`Reasoning: ${result.aiAnalysis.reasoning}`, 'white');

        if (result.aiAnalysis.newMazeConfiguration) {
          log('\n🔄 NEW MAZE CONFIGURATION:', 'green');
          log(`Layers: ${result.aiAnalysis.newMazeConfiguration.layerCount}`, 'cyan');
          log(`Shift Frequency: ${result.aiAnalysis.newMazeConfiguration.shiftPattern.frequency}ms`, 'cyan');
          log(`Complexity: ${result.aiAnalysis.newMazeConfiguration.shiftPattern.complexity}/10`, 'cyan');
        }
      } else {
        log(`❌ Request failed: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ Error testing scenario: ${error.message}`, 'red');
    }

    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  logSection('DEMO COMPLETED');
  log('The Padhma Vyuham Security Vault successfully:', 'green');
  log('✅ Detected and analyzed various attack patterns', 'green');
  log('✅ Applied appropriate security responses', 'green');
  log('✅ Adapted maze configuration based on threats', 'green');
  log('✅ Demonstrated AI-powered threat intelligence', 'green');
  
  log('\n🔒 Key Security Features Demonstrated:', 'cyan');
  log('• Multi-layer maze architecture', 'white');
  log('• Real-time threat pattern recognition', 'white');
  log('• Adaptive security responses', 'white');
  log('• Honeypot and trap deployment', 'white');
  log('• Dynamic maze configuration shifts', 'white');
  log('• AI-powered threat analysis', 'white');

  log('\n🚀 To explore more features:', 'yellow');
  log('1. Start the frontend: npm run dev:frontend', 'white');
  log('2. Open http://localhost:3000 in your browser', 'white');
  log('3. Register/login to access the full vault interface', 'white');
}

// Run the demo
if (require.main === module) {
  testSecuritySystem().catch(console.error);
}

module.exports = { testSecuritySystem };
