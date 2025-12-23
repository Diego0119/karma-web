import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  User,
  CreditCard,
  Award,
  Gift,
  Tag,
  Plus,
  ArrowRight,
  Store
} from 'lucide-react';

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState(null);
  const [stats, setStats] = useState({
    cards: 0,
    points: 0,
    rewards: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Cargar perfil del cliente
      try {
        const customerRes = await api.get('/customers/me');
        setCustomer(customerRes.data);

        // Si el cliente existe, cargar sus datos
        if (customerRes.data) {
          // Cargar tarjetas de sellos
          const cardsRes = await api.get(`/loyalty/stamp-cards/customer/${customerRes.data.id}`);

          // Cargar recompensas canjeadas
          const rewardsRes = await api.get(`/rewards/customer/${customerRes.data.id}`);

          setStats({
            cards: cardsRes.data.length,
            points: 0, // Por ahora, se puede calcular después
            rewards: rewardsRes.data.length,
          });
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setCustomer(null);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <User className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a Karma!
          </h2>
          <p className="text-gray-600 mb-6">
            Para comenzar, completa tu perfil
          </p>
          <Link
            to="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Completar perfil
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tarjetas de Sellos',
      value: stats.cards,
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-500',
      link: '/dashboard/cards'
    },
    {
      title: 'Puntos Totales',
      value: stats.points,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      link: '/dashboard/points'
    },
    {
      title: 'Recompensas Canjeadas',
      value: stats.rewards,
      icon: Gift,
      color: 'from-orange-500 to-red-500',
      link: '/dashboard/my-rewards'
    },
  ];

  const quickActions = [
    {
      title: 'Explorar Negocios',
      description: 'Descubre negocios cerca de ti',
      icon: Store,
      link: '/dashboard/businesses',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Mis Tarjetas',
      description: 'Ver mis tarjetas de sellos',
      icon: CreditCard,
      link: '/dashboard/cards',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Mis Puntos',
      description: 'Ver balance de puntos',
      icon: Award,
      link: '/dashboard/points',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Promociones',
      description: 'Ver promociones activas',
      icon: Tag,
      link: '/dashboard/promotions',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Hola, {customer.firstName}!
        </h1>
        <p className="text-gray-600">
          Gestiona tus recompensas y puntos de fidelización
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Información del cliente */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Tu Perfil</h2>
            <p className="text-gray-600">Información personal</p>
          </div>
          <Link
            to="/dashboard/profile"
            className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1"
          >
            Editar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Nombre completo:</span>
            <span className="ml-2 text-gray-900 font-medium">
              {customer.firstName} {customer.lastName}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Teléfono:</span>
            <span className="ml-2 text-gray-900 font-medium">{customer.phone || 'No especificado'}</span>
          </div>
          {customer.birthDate && (
            <div>
              <span className="text-gray-500">Fecha de nacimiento:</span>
              <span className="ml-2 text-gray-900 font-medium">
                {new Date(customer.birthDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
