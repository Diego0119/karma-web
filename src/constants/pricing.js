// Precios centralizados - Deben coincidir con el backend
// En producción, considera obtener estos valores desde una API
export const PRICING = {
  PRO: {
    price: 24990,
    currency: 'CLP',
    interval: 'month',
    label: 'PRO',
    formatted: '$24.990',
    formattedWithInterval: '$24.990/mes',
    formattedWithTax: '$24.990/mes + IVA',
  },
};

export const formatPrice = (amount, currency = 'CLP') => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};
