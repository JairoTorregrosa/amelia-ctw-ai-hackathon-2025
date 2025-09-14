'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profiles } from '@/models';
import type { Profile } from '@/models/profiles';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = sessionStorage.getItem('amelia_session');
        if (sessionData) {
          const { userId, phoneNumber } = JSON.parse(sessionData);
          
          // Verify the user still exists in the database by ID only
          const foundUser = await Profiles.getById(userId);
          
          if (foundUser && foundUser.phone && 
              foundUser.phone.replace(/\D/g, '') === phoneNumber.replace(/\D/g, '')) {
            setUser(foundUser);
          } else {
            // User no longer exists, clear session
            sessionStorage.removeItem('amelia_session');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        sessionStorage.removeItem('amelia_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const digits = phoneNumber.replace(/\D/g, '');
      
      // First check if a user exists with this phone number
      const userExists = await Profiles.existsByPhone(digits);

      if (userExists) {
        // User exists, now fetch the full profile
        const foundUser = await Profiles.getByPhone(digits);
        
        if (foundUser) {
          // Create session data
          const sessionData = {
            userId: foundUser.id,
            phoneNumber: phoneNumber,
            loginTime: new Date().toISOString(),
          };
          
          // Store in sessionStorage
          sessionStorage.setItem('amelia_session', JSON.stringify(sessionData));
          setUser(foundUser);
          
          return { success: true };
        }
      }
      
      return { 
        success: false, 
        error: 'No demo results found for this phone number. Please check your number or contact support.' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An error occurred while accessing your demo results. Please try again.' 
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('amelia_session');
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
