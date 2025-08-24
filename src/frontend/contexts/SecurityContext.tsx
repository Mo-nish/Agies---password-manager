import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  severity: string;
  description: string;
  metadata: any;
}

interface SecurityContextType {
  securityEvents: SecurityEvent[];
  threatLevel: string;
  totalAttacks: number;
  blockedAttacks: number;
  honeypotsTriggered: number;
  trapsActivated: number;
  mazeShifts: number;
  refreshSecurityData: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [threatLevel, setThreatLevel] = useState('low');
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [blockedAttacks, setBlockedAttacks] = useState(0);
  const [honeypotsTriggered, setHoneypotsTriggered] = useState(0);
  const [trapsActivated, setTrapsActivated] = useState(0);
  const [mazeShifts, setMazeShifts] = useState(0);

  const refreshSecurityData = () => {
    // Simulate real-time security updates
    setTotalAttacks(prev => prev + Math.floor(Math.random() * 3));
    setBlockedAttacks(prev => prev + Math.floor(Math.random() * 2));
    setHoneypotsTriggered(prev => prev + Math.floor(Math.random() * 2));
    setTrapsActivated(prev => prev + Math.floor(Math.random() * 1));
    setMazeShifts(prev => prev + Math.floor(Math.random() * 1));
  };

  useEffect(() => {
    // Simulate real-time security monitoring
    const interval = setInterval(refreshSecurityData, 5000);
    return () => clearInterval(interval);
  }, []);

  const value: SecurityContextType = {
    securityEvents,
    threatLevel,
    totalAttacks,
    blockedAttacks,
    honeypotsTriggered,
    trapsActivated,
    mazeShifts,
    refreshSecurityData
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
