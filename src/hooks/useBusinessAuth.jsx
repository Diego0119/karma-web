import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para validar que el usuario tenga un negocio asociado
 * y cargar los datos del negocio de forma segura.
 *
 * @returns {Object} { business, loading, error }
 */
export function useBusinessAuth() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar que el usuario tenga rol BUSINESS
      if (user?.role !== 'BUSINESS') {
        setError('unauthorized');
        setLoading(false);
        navigate('/');
        return;
      }

      // Cargar el perfil del negocio
      const res = await api.get('/business/me');

      // Validar que el usuario tenga un negocio asociado
      if (!res.data || !res.data.id) {
        
        setError('no_business');
        setBusiness(null);
        setLoading(false);
        return;
      }

      // Validar que el negocio pertenezca al usuario autenticado
      // El backend debe asegurar esto, pero validamos por seguridad
      if (res.data.userId && res.data.userId !== user.id) {
        setError('forbidden');
        setBusiness(null);
        setLoading(false);
        navigate('/');
        return;
      }

      setBusiness(res.data);
      setLoading(false);
    } catch (error) {
      // Si es 404, significa que no tiene perfil de negocio
      if (error.response?.status === 404) {
        setError('no_business');
        setBusiness(null);
      } else if (error.response?.status === 403) {
        setError('forbidden');
        setBusiness(null);
      } else {
        setError('network_error');
      }

      setLoading(false);
    }
  };

  return { business, loading, error };
}

/**
 * Componente de mensaje para cuando no hay negocio asociado
 */
export function NoBusinessMessage({ icon: Icon }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        {Icon && <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ⚠️ Perfil de Negocio Requerido
        </h2>
        <p className="text-gray-600 mb-4">
          No tienes un perfil de negocio asociado a tu cuenta.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Para acceder a esta sección, primero debes completar tu perfil de negocio.
        </p>
        <a
          href="/dashboard/business"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Configurar Perfil de Negocio
        </a>
      </div>
    </div>
  );
}
