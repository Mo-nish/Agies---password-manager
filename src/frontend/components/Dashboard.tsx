import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Eye, AlertTriangle, Activity, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [securityStats, setSecurityStats] = useState({
    totalAttacks: 0,
    blockedAttacks: 0,
    honeypotsTriggered: 0,
    trapsActivated: 0,
    mazeShifts: 0,
    threatLevel: 'low'
  });

  useEffect(() => {
    // Simulate real-time security updates
    const interval = setInterval(() => {
      setSecurityStats(prev => ({
        ...prev,
        totalAttacks: prev.totalAttacks + Math.floor(Math.random() * 3),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 2),
        honeypotsTriggered: prev.honeypotsTriggered + Math.floor(Math.random() * 2),
        trapsActivated: prev.trapsActivated + Math.floor(Math.random() * 1),
        mazeShifts: prev.mazeShifts + Math.floor(Math.random() * 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to Padhma Vyuham
        </h1>
        <p className="text-purple-200 text-lg">
          Your impenetrable security vault with maze-like protection
        </p>
      </div>

      {/* Security Level Card */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 mb-8 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {user?.securityLevel.name}
            </h2>
            <p className="text-purple-200">{user?.securityLevel.description}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-purple-400">
              {user?.securityLevel.encryptionStrength}/10
            </div>
            <div className="text-purple-200">Encryption Strength</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{securityStats.totalAttacks}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Total Attacks</h3>
          <p className="text-slate-300">Attempts detected by our maze</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{securityStats.blockedAttacks}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Blocked Attacks</h3>
          <p className="text-slate-300">Successfully prevented intrusions</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{securityStats.honeypotsTriggered}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Honeypots</h3>
          <p className="text-slate-300">Attackers lured into traps</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">{securityStats.trapsActivated}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Traps Activated</h3>
          <p className="text-slate-300">Security measures triggered</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">{securityStats.mazeShifts}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Maze Shifts</h3>
          <p className="text-slate-300">Configuration changes</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className={`text-2xl font-bold ${getThreatLevelColor(securityStats.threatLevel)}`}>
              {securityStats.threatLevel.toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Threat Level</h3>
          <p className="text-slate-300">Current security status</p>
        </div>
      </div>

      {/* Maze Visualization */}
      <div className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 rounded-2xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-semibold text-white mb-6">Maze Security Layers</h2>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-2 border-2 border-purple-400/50">
                <span className="text-white font-bold text-lg">{i + 1}</span>
              </div>
              <div className="text-xs text-purple-200">Layer {i + 1}</div>
              <div className="text-xs text-slate-400">
                {i === 0 && 'Entry'}
                {i === 6 && 'Core'}
                {i > 0 && i < 6 && 'Maze'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm">
            🔒 Each layer represents a different security zone with shifting encryption, honeypots, and traps
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105">
          Add New Secret
        </button>
        <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105">
          Security Scan
        </button>
        <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105">
          Emergency Lockdown
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
