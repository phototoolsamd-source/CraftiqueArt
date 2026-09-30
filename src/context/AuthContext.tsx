import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('creaftique_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const role: UserRole = user ? user.role : 'Customer';

  const login = (email: string, pass: string, assignedRole: UserRole = 'Admin') => {
    // Isolated secure check for prototype/demo environments
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: assignedRole
    };
    setUser(newUser);
    localStorage.setItem('creaftique_auth', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('creaftique_auth');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'Customer') {
      logout();
      return;
    }
    const updatedUser: User = {
      id: user?.id || `usr-${Date.now()}`,
      name: user?.name || 'Studio Admin',
      email: user?.email || 'admin@craftique.in',
      role: newRole
    };
    setUser(updatedUser);
    localStorage.setItem('creaftique_auth', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user && user.role !== 'Customer',
        login,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
