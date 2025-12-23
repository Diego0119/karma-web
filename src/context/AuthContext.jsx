import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión activa con la cookie httpOnly
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      // No hay sesión activa
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData } = response.data;

      // La cookie httpOnly se guarda automáticamente
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  };

  const register = async (email, password, role, businessName = null) => {
    try {
      // Paso 1: Registrar usuario
      const response = await api.post('/auth/register', { email, password, role });
      const { user: userData } = response.data;

      // La cookie httpOnly se guarda automáticamente
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Paso 2: Si es BUSINESS y tiene businessName, crear perfil del negocio automáticamente
      if (role === 'BUSINESS' && businessName) {
        try {
          await api.post('/business', {
            name: businessName,
            description: '',
            category: '',
            address: '',
            phone: '',
          });
          console.log('✅ Business profile created successfully during registration');
        } catch (businessError) {
          console.error('❌ Error creating business profile during registration:', businessError);
          console.error('Response:', businessError.response?.data);
          // No fallar el registro si falla la creación del negocio
          // El onboarding manejará la creación del negocio si no existe
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrarse',
      };
    }
  };

  const logout = async () => {
    try {
      // Llamar al backend para eliminar la cookie httpOnly
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar estado local
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
