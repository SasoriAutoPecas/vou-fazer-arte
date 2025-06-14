import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Institution, Donation } from '../types';
import { mockUser, mockDonations } from '../data/mockData';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  userLocation: [number, number] | null;
  selectedInstitution: Institution | null;
  donations: Donation[];
  login: (email: string, password: string, type: 'donor' | 'institution') => Promise<boolean>;
  logout: () => void;
  setUserLocation: (location: [number, number]) => void;
  setSelectedInstitution: (institution: Institution | null) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLocation, setUserLocationState] = useState<[number, number] | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [donations, setDonations] = useState<Donation[]>(mockDonations);

  const login = async (email: string, password: string, type: 'donor' | 'institution'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'donor@test.com' && password === '123456') {
      setUser(mockUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setSelectedInstitution(null);
  };

  const setUserLocation = (location: [number, number]) => {
    setUserLocationState(location);
  };

  const addDonation = (donation: Omit<Donation, 'id' | 'createdAt'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setDonations(prev => [newDonation, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userLocation,
        selectedInstitution,
        donations,
        login,
        logout,
        setUserLocation,
        setSelectedInstitution,
        addDonation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};