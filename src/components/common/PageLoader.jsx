import { Loader2 } from 'lucide-react';

/**
 * Loader para contenido de página (mantiene el layout/sidebar visible)
 * Usa min-h para ocupar espacio sin forzar scroll
 */
export default function PageLoader({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

/**
 * Loader inline para secciones pequeñas
 */
export function InlineLoader({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center py-4">
      <Loader2 className={`${sizes[size]} text-primary-600 animate-spin`} />
    </div>
  );
}

/**
 * Skeleton loader para cards
 */
export function CardSkeleton({ count = 1 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
