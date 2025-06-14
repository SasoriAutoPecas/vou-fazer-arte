import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { Database } from '../lib/database.types';

type User = Database['public']['Tables']['users']['Row'] & {
  addresses?: Database['public']['Tables']['addresses']['Row'][];
  institutions?: Database['public']['Tables']['institutions']['Row'][];
};

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  userLocation: [number, number] | null;
  selectedInstitution: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUserLocation: (location: [number, number]) => void;
  setSelectedInstitution: (institution: any | null) => void;
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
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocationState] = useState<[number, number] | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);

  useEffect(() => {
    // Verificar se há usuário logado
    const initializeAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças no estado de autenticação
    const { data: { subscription } } = authService.onAuthStateChange((userData) => {
      setUser(userData);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await authService.signIn(email, password);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setSelectedInstitution(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const setUserLocation = (location: [number, number]) => {
    setUserLocationState(location);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        userLocation,
        selectedInstitution,
        login,
        logout,
        setUserLocation,
        setSelectedInstitution
      }}
    >
      {children}
    </AppContext.Provider>
  );
};