import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Envía cookies automáticamente
});

// Interceptor para manejar errores de autenticación y subscripción
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // NO redirigir si el 401 viene de /auth/profile (es la verificación inicial)
    const isAuthProfileCheck = error.config?.url?.includes('/auth/profile');

    if (error.response?.status === 401 && !isAuthProfileCheck) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Manejar 403 (Forbidden) - Solo redirigir si es por subscripción expirada
    if (error.response?.status === 403) {
      const errorData = error.response?.data;
      // Solo redirigir si el mensaje indica que es por subscripción expirada
      const isSubscriptionExpired =
        errorData?.code === 'SUBSCRIPTION_EXPIRED' ||
        errorData?.message?.toLowerCase().includes('subscri') ||
        errorData?.message?.toLowerCase().includes('trial');

      if (isSubscriptionExpired) {
        console.warn('🚫 Subscription expired, redirecting to billing...');
        window.location.href = '/dashboard/billing?expired=true';
      } else {
        console.warn('⚠️ 403 Forbidden (not subscription related):', errorData?.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
