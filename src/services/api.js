import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
    // NO redirigir si el 401 viene de rutas de autenticación
    const isAuthRoute = error.config?.url?.includes('/auth/');

    if (error.response?.status === 401 && !isAuthRoute) {
      window.location.href = '/login';
    }

    // Manejar 403 (Forbidden)
    if (error.response?.status === 403) {
      const errorData = error.response?.data;

      // Verificar si es error de email no verificado
      if (errorData?.code === 'EMAIL_NOT_VERIFIED') {
        const isAlreadyOnVerify = window.location.pathname.includes('/verify-email');
        if (!isAlreadyOnVerify) {
          window.location.href = '/verify-email-pending';
        }
        return Promise.reject(error);
      }

      // Solo redirigir si el mensaje indica que es por subscripción expirada
      const isSubscriptionExpired =
        errorData?.code === 'SUBSCRIPTION_EXPIRED' ||
        errorData?.message?.toLowerCase().includes('subscri') ||
        errorData?.message?.toLowerCase().includes('trial');

      // No redirigir si ya estamos en la página de billing (evita loop infinito)
      const isAlreadyOnBilling = window.location.pathname.includes('/billing');

      if (isSubscriptionExpired && !isAlreadyOnBilling) {
        window.location.href = '/dashboard/billing?expired=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
