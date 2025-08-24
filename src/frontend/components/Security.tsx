import React, { useState } from 'react';
import { Shield, AlertTriangle, Eye, Lock, Activity, Zap, Target, Clock } from 'lucide-react';

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock security data
  const [securityStats] = useState({
    totalThreats: 47,
    blockedAttacks: 42,
    activeThreats: 5,
    systemHealth: 'excellent',
    lastScan: new Date(),
    nextScan: new Date(Date.now() + 3600000) // 1 hour from now
  });

  const [recentEvents] = useState([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      type: 'intrusion_detected',
      severity: 'high',
      description: 'SQL injection attempt blocked',
      source: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000),
      type: 'honeypot_triggered',
      severity: 'medium',
      description: 'Attacker lured into honeypot',
      source: '10.0.0.50'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 900000),
      type: 'maze_shift',
      severity: 'low',
      description: 'Security maze configuration updated',
      source: 'system'
    }
  ]);

  const [threatLevels] = useState([
    { level: 'Critical', count: 2, color: 'text-red-400' },
    { level: 'High', count: 8, color: 'text-orange-400' },
    { level: 'Medium', count: 15, color: 'text-yellow-400' },
    { level: 'Low', count: 22, color: 'text-green-400' }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'intrusion_detected': return <AlertTriangle className="h-5 w-5" />;
      case 'honeypot_triggered': return <Target className="h-5 w-5" />;
      case 'maze_shift': return <Activity className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Security Center
        </h1>
        <p className="text-purple-200 text-lg">
          Monitor threats and manage security settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 mb-8">
        {['overview', 'events', 'threats', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-white">{securityStats.totalThreats}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Total Threats</h3>
              <p className="text-slate-300">Detected and analyzed</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <Lock className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">{securityStats.blockedAttacks}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Blocked Attacks</h3>
              <p className="text-slate-300">Successfully prevented</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-400" />
                <span className="text-2xl font-bold text-white">{securityStats.activeThreats}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Active Threats</h3>
              <p className="text-slate-300">Currently monitoring</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-green-400">{securityStats.systemHealth}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">System Health</h3>
              <p className="text-slate-300">Overall status</p>
            </div>
          </div>

          {/* Threat Levels */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-semibold text-white mb-6">Threat Level Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {threatLevels.map((threat) => (
                <div key={threat.level} className="text-center">
                  <div className={`text-3xl font-bold ${threat.color} mb-2`}>
                    {threat.count}
                  </div>
                  <div className="text-slate-300">{threat.level}</div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-semibold text-white mb-6">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">Last Security Scan</span>
                </div>
                <span className="text-white">{securityStats.lastScan.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">Next Scan</span>
                </div>
                <span className="text-white">{securityStats.nextScan.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-6">Recent Security Events</h2>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)} bg-opacity-20`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white">{event.description}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Source: {event.source}</span>
                    <span>{event.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Threats Tab */}
      {activeTab === 'threats' && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-6">Active Threat Analysis</h2>
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">Threat Analysis</h3>
            <p className="text-slate-500">Detailed threat analysis and response logs will appear here.</p>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-6">Security Settings</h2>
          <div className="text-center py-12">
            <Lock className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">Security Configuration</h3>
            <p className="text-slate-500">Security settings and configuration options will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
