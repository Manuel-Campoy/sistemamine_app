import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axiosConfig'; 

interface User {
  id: string;
  nombre: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void; 
  logout: () => Promise<void>;     
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/logout'); 
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor", error);
    } finally {
      localStorage.removeItem('usuario');
      setUser(null);
      window.location.href = '/login';
    }
  };

  if (isLoading) return null; 

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};