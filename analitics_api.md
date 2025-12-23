# Analytics API - Documentación para Frontend

**Base URL:** `http://localhost:3000/api/analytics`

**Autenticación:** Todos los endpoints requieren token JWT con rol **BUSINESS**

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📊 Endpoints Disponibles

### 1. Dashboard General

**GET** `/analytics/dashboard`

Obtiene las métricas principales del negocio autenticado.

**Response:**
```json
{
  "totalCustomers": 150,
  "totalPointsGiven": 45000,
  "totalPointsRedeemed": 12000,
  "totalRewardsRedeemed": 85,
  "activePromotions": 3,
  "completedStampCards": 42,
  "averagePointsPerCustomer": 300
}
```

**Campos:**
- `totalCustomers`: Clientes únicos que han interactuado
- `totalPointsGiven`: Total de puntos otorgados
- `totalPointsRedeemed`: Total de puntos canjeados
- `totalRewardsRedeemed`: Recompensas canjeadas
- `activePromotions`: Promociones activas
- `completedStampCards`: Tarjetas de sellos completadas
- `averagePointsPerCustomer`: Promedio de puntos por cliente

---

### 2. Dashboard de Negocio Específico

**GET** `/analytics/dashboard/:businessId`

Obtiene el dashboard de cualquier negocio (endpoint público).

**Parámetros:**
- `businessId`: UUID del negocio

**Response:** Igual que `/analytics/dashboard`

---

### 3. Top Clientes

**GET** `/analytics/top-customers?limit=10`

Obtiene los clientes con más puntos acumulados.

**Query Params:**
- `limit` (opcional): Cantidad de clientes a retornar (default: 10)

**Response:**
```json
[
  {
    "customerId": "uuid",
    "name": "Juan Pérez",
    "totalPoints": 1250
  },
  {
    "customerId": "uuid",
    "name": "María González",
    "totalPoints": 980
  }
]
```

**Uso sugerido:**
- Tabla o lista de mejores clientes
- Ranking de clientes frecuentes
- Programa de clientes VIP

---

### 4. Top Recompensas

**GET** `/analytics/top-rewards?limit=10`

Obtiene las recompensas más canjeadas.

**Query Params:**
- `limit` (opcional): Cantidad de recompensas a retornar (default: 10)

**Response:**
```json
[
  {
    "rewardId": "uuid",
    "name": "Café gratis",
    "pointsCost": 100,
    "timesRedeemed": 45
  },
  {
    "rewardId": "uuid",
    "name": "Descuento 20%",
    "pointsCost": 200,
    "timesRedeemed": 28
  }
]
```

**Uso sugerido:**
- Identificar recompensas más populares
- Ajustar inventario o costos
- Optimizar catálogo de recompensas

---

### 5. Actividad de Puntos

**GET** `/analytics/points-activity?days=30`

Obtiene la actividad de puntos ganados y canjeados por día.

**Query Params:**
- `days` (opcional): Días hacia atrás (default: 30)

**Response:**
```json
[
  {
    "date": "2024-12-01",
    "type": "EARN",
    "totalPoints": 450
  },
  {
    "date": "2024-12-01",
    "type": "REDEEM",
    "totalPoints": 200
  },
  {
    "date": "2024-12-02",
    "type": "EARN",
    "totalPoints": 600
  }
]
```

**Campos:**
- `date`: Fecha en formato YYYY-MM-DD
- `type`: `"EARN"` (ganados) o `"REDEEM"` (canjeados)
- `totalPoints`: Total de puntos para ese día y tipo

**Uso sugerido:**
- Gráfica de líneas mostrando tendencias
- Comparar puntos ganados vs canjeados
- Identificar días con más actividad

**Ejemplo de implementación (Chart.js):**
```javascript
const response = await fetch('/api/analytics/points-activity?days=30', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();

// Procesar datos para gráfica
const dates = [...new Set(data.map(d => d.date))];
const earnData = dates.map(date => {
  const item = data.find(d => d.date === date && d.type === 'EARN');
  return item ? item.totalPoints : 0;
});
const redeemData = dates.map(date => {
  const item = data.find(d => d.date === date && d.type === 'REDEEM');
  return item ? item.totalPoints : 0;
});

// Configurar Chart.js
const chartData = {
  labels: dates,
  datasets: [
    {
      label: 'Puntos Ganados',
      data: earnData,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
    {
      label: 'Puntos Canjeados',
      data: redeemData,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    }
  ]
};
```

---

### 6. Crecimiento de Clientes

**GET** `/analytics/customer-growth`

Obtiene el crecimiento de clientes nuevos por mes (últimos 6 meses).

**Response:**
```json
[
  {
    "month": "2024-07",
    "newCustomers": 12
  },
  {
    "month": "2024-08",
    "newCustomers": 18
  },
  {
    "month": "2024-09",
    "newCustomers": 25
  },
  {
    "month": "2024-10",
    "newCustomers": 30
  },
  {
    "month": "2024-11",
    "newCustomers": 35
  },
  {
    "month": "2024-12",
    "newCustomers": 20
  }
]
```

**Campos:**
- `month`: Mes en formato YYYY-MM
- `newCustomers`: Cantidad de clientes nuevos ese mes

**Uso sugerido:**
- Gráfica de barras de crecimiento mensual
- Identificar tendencias de adquisición
- Evaluar efectividad de campañas

**Ejemplo de implementación:**
```javascript
const response = await fetch('/api/analytics/customer-growth', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();

// Para Chart.js
const chartData = {
  labels: data.map(d => d.month),
  datasets: [{
    label: 'Clientes Nuevos',
    data: data.map(d => d.newCustomers),
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgb(54, 162, 235)',
    borderWidth: 1
  }]
};
```

---

### 7. Estadísticas de Programas

**GET** `/analytics/programs-stats`

Obtiene estadísticas de los programas de tarjetas de sellos.

**Response:**
```json
{
  "activeCards": 85,
  "completedCards": 42,
  "totalCards": 127,
  "completionRate": 33.07
}
```

**Campos:**
- `activeCards`: Tarjetas activas (en progreso)
- `completedCards`: Tarjetas completadas
- `totalCards`: Total de tarjetas
- `completionRate`: Porcentaje de completación

**Uso sugerido:**
- Mostrar tasa de éxito del programa
- KPI de engagement de clientes
- Gráfica de progreso (torta o dona)

**Ejemplo de implementación:**
```javascript
const response = await fetch('/api/analytics/programs-stats', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const stats = await response.json();

// Para mostrar en UI
return (
  <div className="stats-card">
    <h3>Programas de Fidelización</h3>
    <div className="metric">
      <span>Tarjetas Activas:</span>
      <strong>{stats.activeCards}</strong>
    </div>
    <div className="metric">
      <span>Tarjetas Completadas:</span>
      <strong>{stats.completedCards}</strong>
    </div>
    <div className="metric">
      <span>Tasa de Completación:</span>
      <strong>{stats.completionRate}%</strong>
    </div>
  </div>
);
```

---

### 8. Estadísticas de Promociones

**GET** `/analytics/promotions-stats`

Obtiene resumen de todas las promociones.

**Response:**
```json
{
  "total": 15,
  "active": 3,
  "expired": 8,
  "scheduled": 4
}
```

**Campos:**
- `total`: Total de promociones creadas
- `active`: Promociones actualmente vigentes
- `expired`: Promociones que ya terminaron
- `scheduled`: Promociones programadas (futuras)

**Uso sugerido:**
- Dashboard general de promociones
- Alerta de promociones próximas a vencer
- Gráfica de distribución de promociones

---

## 🎨 Ejemplos de UI Sugeridos

### Dashboard Principal
```javascript
import React, { useEffect, useState } from 'react';

function BusinessDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/api/analytics/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDashboard(data));
  }, []);

  if (!dashboard) return <div>Cargando...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard de Negocio</h1>

      <div className="metrics-grid">
        <MetricCard
          title="Total Clientes"
          value={dashboard.totalCustomers}
          icon="👥"
        />
        <MetricCard
          title="Puntos Otorgados"
          value={dashboard.totalPointsGiven.toLocaleString()}
          icon="⭐"
        />
        <MetricCard
          title="Puntos Canjeados"
          value={dashboard.totalPointsRedeemed.toLocaleString()}
          icon="🎁"
        />
        <MetricCard
          title="Recompensas Canjeadas"
          value={dashboard.totalRewardsRedeemed}
          icon="🏆"
        />
        <MetricCard
          title="Promociones Activas"
          value={dashboard.activePromotions}
          icon="🎉"
        />
        <MetricCard
          title="Tarjetas Completadas"
          value={dashboard.completedStampCards}
          icon="✅"
        />
      </div>

      <div className="average-metric">
        <h3>Promedio de Puntos por Cliente</h3>
        <p className="big-number">{dashboard.averagePointsPerCustomer}</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="metric-card">
      <div className="icon">{icon}</div>
      <div className="content">
        <h3>{title}</h3>
        <p className="value">{value}</p>
      </div>
    </div>
  );
}

export default BusinessDashboard;
```

### Componente de Top Clientes
```javascript
function TopCustomers() {
  const [customers, setCustomers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/api/analytics/top-customers?limit=10', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div className="top-customers">
      <h2>Top 10 Clientes</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.customerId}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.totalPoints.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## ⚠️ Errores Comunes

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Solución:** Verificar que el token JWT esté presente y sea válido.

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Solución:** El usuario no tiene rol BUSINESS. Solo negocios pueden acceder a analytics.

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Business not found"
}
```
**Solución:** El usuario BUSINESS no tiene un perfil de negocio creado.

---

## 📱 Tips de Implementación

### 1. Caché de Datos
Los datos de analytics pueden ser pesados. Considera implementar caché:

```javascript
// Usar React Query
import { useQuery } from 'react-query';

function useDashboard() {
  return useQuery('dashboard', fetchDashboard, {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}
```

### 2. Loading States
Siempre mostrar estados de carga:

```javascript
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;
```

### 3. Refresh Manual
Permitir al usuario refrescar los datos:

```javascript
<button onClick={() => refetch()}>
  Actualizar Datos
</button>
```

### 4. Periodicidad
Para dashboards en tiempo real, considera polling:

```javascript
useQuery('dashboard', fetchDashboard, {
  refetchInterval: 30000, // Refresh cada 30 segundos
});
```

### 5. Formato de Números
Usar formato local para números grandes:

```javascript
const formatted = totalPoints.toLocaleString('es-CL');
// 45000 → "45.000"
```

---

## 🎯 Casos de Uso por Pantalla

### Pantalla: Dashboard Principal
**Endpoints a usar:**
- `GET /analytics/dashboard` - Métricas principales
- `GET /analytics/points-activity?days=7` - Gráfica de la semana

### Pantalla: Clientes
**Endpoints a usar:**
- `GET /analytics/top-customers?limit=20` - Lista de clientes top
- `GET /analytics/customer-growth` - Gráfica de crecimiento

### Pantalla: Recompensas
**Endpoints a usar:**
- `GET /analytics/top-rewards?limit=10` - Recompensas populares
- `GET /analytics/dashboard` - Total de recompensas canjeadas

### Pantalla: Programas
**Endpoints a usar:**
- `GET /analytics/programs-stats` - Estadísticas de tarjetas
- `GET /analytics/dashboard` - Tarjetas completadas

### Pantalla: Promociones
**Endpoints a usar:**
- `GET /analytics/promotions-stats` - Resumen de promociones

---

## 📊 Librerías Recomendadas

### Para Gráficas
- **Chart.js** - Versátil y fácil de usar
- **Recharts** - Específico para React
- **Victory** - Altamente personalizable
- **ApexCharts** - Moderno y con muchas opciones

### Para Tablas
- **TanStack Table** (React Table v8) - Potente y flexible
- **AG Grid** - Enterprise-grade
- **Material-UI DataGrid** - Si usas MUI

### Para Formato
- **date-fns** - Manejo de fechas
- **numeral.js** - Formato de números
- **Intl API** - Nativo del navegador

---

## 🔗 URLs Completas

Todos los endpoints están bajo `/api/analytics`:

```
GET  /api/analytics/dashboard
GET  /api/analytics/dashboard/:businessId
GET  /api/analytics/top-customers?limit=10
GET  /api/analytics/top-rewards?limit=10
GET  /api/analytics/points-activity?days=30
GET  /api/analytics/customer-growth
GET  /api/analytics/programs-stats
GET  /api/analytics/promotions-stats
```

---

**Última actualización:** Diciembre 2024

**Versión:** 1.0.0

**Contacto:** Equipo Backend
