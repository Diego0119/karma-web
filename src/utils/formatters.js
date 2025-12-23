/**
 * Formatea un monto en pesos chilenos (CLP)
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado (ej: "$24.990")
 */
export const formatCLP = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formatea una fecha en español chileno
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';

  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

/**
 * Formatea una fecha corta
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada (ej: "19/12/2024")
 */
export const formatDateShort = (date) => {
  if (!date) return 'N/A';

  return new Intl.DateTimeFormat('es-CL').format(new Date(date));
};
