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
    } catch {
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

      // Verificar si es BUSINESS y no ha verificado email
      if (userData.role === 'BUSINESS' && !userData.isEmailVerified) {
        // No guardar en estado, redirigir a verificación
        return {
          success: false,
          requiresEmailVerification: true,
          error: 'Debes verificar tu email antes de continuar'
        };
      }

      // Solo guardar en estado, la cookie httpOnly maneja la sesión
      setUser(userData);

      return { success: true };
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';

      // Verificar si es error de email no verificado
      if (error.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        return {
          success: false,
          requiresEmailVerification: true,
          error: 'Debes verificar tu email antes de continuar'
        };
      }

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        errorMessage = Array.isArray(msg) ? msg[0] : msg;
      } else if (error.response?.status === 401) {
        errorMessage = 'Credenciales inválidas';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (email, password, role, businessName = null) => {
    try {
      // Paso 1: Registrar usuario
      const response = await api.post('/auth/register', { email, password, role });
      const { user: userData } = response.data;

      // Paso 2: Si es BUSINESS, requiere verificación de email
      if (role === 'BUSINESS') {
        // Guardar el nombre del negocio para usarlo después del onboarding
        if (businessName) {
          localStorage.setItem('pendingBusinessName', businessName.trim());
        }
        // No guardar en estado hasta que verifique email
        return {
          success: true,
          requiresEmailVerification: true
        };
      }

      // Para otros roles, guardar en estado
      setUser(userData);

      // Paso 3: Si es BUSINESS y tiene businessName, crear perfil del negocio automáticamente
      if (role === 'BUSINESS' && businessName) {
        try {
          await api.post('/business', {
            name: businessName,
            description: '',
            category: '',
            address: '',
            phone: '',
          });
        } catch {
          // No fallar el registro si falla la creación del negocio
          // El onboarding manejará la creación del negocio si no existe
        }
      }

      return { success: true };
    } catch (error) {
      // Manejar diferentes formatos de error del backend
      let errorMessage = 'Error al registrarse';

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        errorMessage = Array.isArray(msg) ? msg[0] : msg;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      // Llamar al backend para eliminar la cookie httpOnly
      await api.post('/auth/logout');
    } catch {
      // Ignorar errores de logout
    } finally {
      // Limpiar estado local
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
