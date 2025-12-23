# Karma API - Documentación para Frontend

**Base URL:** `http://localhost:3000/api`

**Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Roles de Usuario](#roles-de-usuario)
3. [Endpoints](#endpoints)
   - [Auth](#auth)
   - [Business](#business)
   - [Customers](#customers)
   - [Loyalty Programs](#loyalty-programs)
   - [Stamp Cards](#stamp-cards)
   - [Points](#points)
   - [Rewards](#rewards)
   - [Promotions](#promotions)
   - [Analytics](#analytics)
4. [Modelos de Datos](#modelos-de-datos)
5. [Códigos de Error](#códigos-de-error)
6. [Flujos Completos](#flujos-completos)

---

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación.

### Flujo de Autenticación

1. Registrarse o hacer login → Recibir `access_token`
2. Guardar el token (localStorage/sessionStorage)
3. Incluir el token en el header de todas las peticiones protegidas

### Header de Autenticación

```
Authorization: Bearer {access_token}
```

### Ejemplo

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 👤 Roles de Usuario

- **BUSINESS**: Negocios/comercios que ofrecen programas de fidelización
- **CUSTOMER**: Clientes que participan en programas de fidelización

---

## 📡 Endpoints

### Auth

#### POST `/auth/register`
Registrar un nuevo usuario (negocio o cliente)

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "role": "BUSINESS" // o "CUSTOMER"
}
```

**Response 201:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "role": "BUSINESS"
  }
}
```

**Errores:**
- `409`: Email ya existe
- `400`: Datos inválidos

---

#### POST `/auth/login`
Iniciar sesión

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "role": "BUSINESS"
  }
}
```

**Errores:**
- `401`: Credenciales inválidas

---

#### GET `/auth/profile`
Obtener perfil del usuario autenticado

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "role": "BUSINESS",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errores:**
- `401`: Token inválido o expirado

---

### Business

#### POST `/business`
Crear perfil de negocio (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "Café Central",
  "description": "El mejor café de la ciudad",
  "category": "Cafetería",
  "address": "Calle Principal 123",
  "phone": "+56912345678",
  "logo": "https://ejemplo.com/logo.png" // opcional
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Café Central",
  "description": "El mejor café de la ciudad",
  "category": "Cafetería",
  "address": "Calle Principal 123",
  "phone": "+56912345678",
  "logo": "https://ejemplo.com/logo.png",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Errores:**
- `401`: No autenticado
- `403`: Usuario no es BUSINESS
- `409`: Usuario ya tiene un negocio

---

#### GET `/business`
Listar todos los negocios

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "name": "Café Central",
    "description": "El mejor café de la ciudad",
    "category": "Cafetería",
    "address": "Calle Principal 123",
    "phone": "+56912345678",
    "logo": "https://ejemplo.com/logo.png",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

#### GET `/business/:id`
Obtener negocio por ID

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Café Central",
  "description": "El mejor café de la ciudad",
  "category": "Cafetería",
  "address": "Calle Principal 123",
  "phone": "+56912345678",
  "logo": "https://ejemplo.com/logo.png",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errores:**
- `404`: Negocio no encontrado

---

#### PATCH `/business/:id`
Actualizar negocio (solo propietario)

**Headers:** `Authorization: Bearer {token}`

**Body:** (todos los campos son opcionales)
```json
{
  "name": "Café Central Premium",
  "description": "Nueva descripción",
  "phone": "+56987654321"
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Café Central Premium",
  "description": "Nueva descripción",
  "category": "Cafetería",
  "address": "Calle Principal 123",
  "phone": "+56987654321",
  "logo": "https://ejemplo.com/logo.png",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

**Errores:**
- `403`: Solo el propietario puede actualizar
- `404`: Negocio no encontrado

---

#### DELETE `/business/:id`
Eliminar negocio (solo propietario)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "message": "Business deleted successfully"
}
```

**Errores:**
- `403`: Solo el propietario puede eliminar
- `404`: Negocio no encontrado

---

### Customers

#### POST `/customers`
Crear perfil de cliente (solo CUSTOMER)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56912345678",
  "birthDate": "1990-05-15" // formato YYYY-MM-DD, opcional
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56912345678",
  "birthDate": "1990-05-15",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errores:**
- `401`: No autenticado
- `403`: Usuario no es CUSTOMER
- `409`: Usuario ya tiene perfil de cliente

---

#### GET `/customers/me`
Obtener mi perfil de cliente (solo CUSTOMER)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56912345678",
  "birthDate": "1990-05-15",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### GET `/customers/:id`
Obtener cliente por ID

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56912345678",
  "birthDate": "1990-05-15"
}
```

---

#### PATCH `/customers/:id`
Actualizar perfil de cliente (solo propietario)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "phone": "+56987654321"
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56987654321",
  "birthDate": "1990-05-15"
}
```

---

#### GET `/customers/by-qr/:qrCode`
Buscar cliente por código QR (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56912345678",
  "qrCode": "abc-123-uuid",
  "createdAt": "2024-12-16T10:30:00Z",
  "updatedAt": "2024-12-16T10:30:00Z"
}
```

**Errores:**
- `404`: Cliente no encontrado
- `403`: Solo negocios pueden buscar por QR

---

### Loyalty Programs

#### POST `/loyalty/programs`
Crear programa de fidelización (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "10 cafés, 1 gratis",
  "type": "STAMPS", // "STAMPS" o "POINTS"
  "isActive": true,
  "stampsRequired": 10, // requerido si type = "STAMPS"
  "pointsPerPurchase": 100 // requerido si type = "POINTS"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "name": "10 cafés, 1 gratis",
  "type": "STAMPS",
  "isActive": true,
  "stampsRequired": 10,
  "pointsPerPurchase": null,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### GET `/loyalty/programs`
Listar todos los programas

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "businessId": "uuid",
    "name": "10 cafés, 1 gratis",
    "type": "STAMPS",
    "isActive": true,
    "stampsRequired": 10,
    "business": {
      "id": "uuid",
      "name": "Café Central"
    }
  }
]
```

---

#### GET `/loyalty/programs/business/:businessId`
Obtener programas de un negocio

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "businessId": "uuid",
    "name": "10 cafés, 1 gratis",
    "type": "STAMPS",
    "isActive": true,
    "stampsRequired": 10
  }
]
```

---

#### GET `/loyalty/programs/:id`
Obtener programa por ID

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "name": "10 cafés, 1 gratis",
  "type": "STAMPS",
  "isActive": true,
  "stampsRequired": 10
}
```

---

### Stamp Cards

#### POST `/loyalty/stamp-cards`
Crear tarjeta de sellos

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "customerId": "uuid",
  "programId": "uuid"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "programId": "uuid",
  "stampsCollected": 0,
  "isCompleted": false,
  "completedAt": null,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errores:**
- `400`: El programa no es de tipo STAMPS
- `409`: Ya existe una tarjeta activa para este cliente en este programa

---

#### GET `/loyalty/stamp-cards/customer/:customerId`
Obtener tarjetas de un cliente

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "customerId": "uuid",
    "programId": "uuid",
    "stampsCollected": 5,
    "isCompleted": false,
    "completedAt": null,
    "program": {
      "id": "uuid",
      "name": "10 cafés, 1 gratis",
      "stampsRequired": 10
    }
  }
]
```

---

#### GET `/loyalty/stamp-cards/:id`
Obtener tarjeta por ID

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "programId": "uuid",
  "stampsCollected": 5,
  "isCompleted": false,
  "completedAt": null
}
```

---

#### POST `/loyalty/stamp-cards/stamps`
Agregar sello a tarjeta (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "stampCardId": "uuid",
  "customerId": "uuid"
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "programId": "uuid",
  "stampsCollected": 6,
  "isCompleted": false,
  "completedAt": null
}
```

**Nota:** Si `stampsCollected` alcanza `stampsRequired`, la tarjeta se marca automáticamente como completada (`isCompleted: true`)

**Errores:**
- `400`: Tarjeta ya completada
- `403`: Solo negocios pueden agregar sellos

---

#### POST `/loyalty/scan`
**⭐ ENDPOINT PRINCIPAL DE ESCANEO QR**
Escanear código QR del cliente y obtener toda su información de lealtad (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "qrCode": "abc-123-uuid"
}
```

**Response 200:**
```json
{
  "customer": {
    "id": "uuid",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+56912345678"
  },
  "programs": [
    {
      "id": "program-points-uuid",
      "name": "Puntos Café Express",
      "type": "POINTS",
      "balance": 250,
      "pointsConversionRate": 10
    },
    {
      "id": "program-stamps-uuid",
      "name": "Tarjeta 10 Cafés",
      "type": "STAMPS",
      "stampCards": [
        {
          "id": "card-uuid",
          "stampsCollected": 7,
          "stampsRequired": 10,
          "isCompleted": false
        },
        {
          "id": "card-completed-uuid",
          "stampsCollected": 10,
          "stampsRequired": 10,
          "isCompleted": true
        }
      ]
    }
  ]
}
```

**Descripción de campos:**
- `customer`: Información básica del cliente
- `programs`: Array con todos los programas de lealtad del negocio
  - Para programas `POINTS`: incluye `balance` (puntos actuales) y `pointsConversionRate` (ej: 10 = $1 por cada $10)
  - Para programas `STAMPS`: incluye array `stampCards` con tarjetas activas y completadas

**Errores:**
- `404`: Cliente no encontrado
- `403`: Solo negocios pueden escanear códigos QR

**Uso recomendado:**
Este endpoint reemplaza múltiples llamadas individuales. Con una sola petición obtienes:
1. Información del cliente
2. Balance de puntos en todos tus programas de puntos
3. Estado de todas sus tarjetas de sellos
4. Todo listo para registrar una venta

---

### Points

#### POST `/loyalty/points/earn`
Otorgar puntos (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "customerId": "uuid",
  "points": 100,
  "description": "Compra de $10.000" // opcional
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "businessId": "uuid",
  "type": "EARN",
  "points": 100,
  "description": "Compra de $10.000",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errores:**
- `400`: Puntos inválidos (debe ser > 0)
- `403`: Solo negocios pueden otorgar puntos

---

#### POST `/loyalty/points/redeem`
Canjear/descontar puntos (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "customerId": "uuid",
  "points": 50,
  "description": "Canje por descuento" // opcional
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "businessId": "uuid",
  "type": "REDEEM",
  "points": -50,
  "description": "Canje por descuento",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errores:**
- `400`: Puntos insuficientes
- `403`: Solo negocios pueden canjear puntos

---

#### GET `/loyalty/points/balance/:customerId/:businessId`
Obtener balance de puntos de un cliente en un negocio

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
250
```

---

#### GET `/loyalty/points/transactions/:customerId`
Obtener historial de transacciones de puntos

**Headers:** `Authorization: Bearer {token}`

**Query Params (opcional):**
- `businessId`: Filtrar por negocio

**Response 200:**
```json
[
  {
    "id": "uuid",
    "customerId": "uuid",
    "businessId": "uuid",
    "type": "EARN",
    "points": 100,
    "description": "Compra de $10.000",
    "createdAt": "2024-01-15T10:30:00Z",
    "business": {
      "id": "uuid",
      "name": "Café Central"
    }
  },
  {
    "id": "uuid",
    "customerId": "uuid",
    "businessId": "uuid",
    "type": "REDEEM",
    "points": -50,
    "description": "Canje por descuento",
    "createdAt": "2024-01-15T11:00:00Z"
  }
]
```

---

### Rewards

#### POST `/rewards`
Crear recompensa (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "Café gratis",
  "description": "Un café de cualquier tamaño",
  "pointsCost": 100,
  "isActive": true
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "name": "Café gratis",
  "description": "Un café de cualquier tamaño",
  "pointsCost": 100,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### GET `/rewards`
Listar todas las recompensas

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "businessId": "uuid",
    "name": "Café gratis",
    "description": "Un café de cualquier tamaño",
    "pointsCost": 100,
    "isActive": true,
    "business": {
      "id": "uuid",
      "name": "Café Central"
    }
  }
]
```

---

#### GET `/rewards/business/:businessId`
Obtener recompensas de un negocio

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "businessId": "uuid",
    "name": "Café gratis",
    "description": "Un café de cualquier tamaño",
    "pointsCost": 100,
    "isActive": true
  }
]
```

---

#### GET `/rewards/customer/:customerId`
Obtener recompensas canjeadas por un cliente

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "customerId": "uuid",
    "rewardId": "uuid",
    "status": "PENDING",
    "redeemedAt": "2024-01-15T10:30:00Z",
    "reward": {
      "id": "uuid",
      "name": "Café gratis",
      "description": "Un café de cualquier tamaño",
      "pointsCost": 100
    }
  }
]
```

---

#### GET `/rewards/:id`
Obtener recompensa por ID

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "name": "Café gratis",
  "description": "Un café de cualquier tamaño",
  "pointsCost": 100,
  "isActive": true
}
```

---

#### PATCH `/rewards/:id`
Actualizar recompensa (solo propietario)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "pointsCost": 150,
  "isActive": false
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "name": "Café gratis",
  "description": "Un café de cualquier tamaño",
  "pointsCost": 150,
  "isActive": false
}
```

---

#### DELETE `/rewards/:id`
Eliminar recompensa (solo propietario)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "message": "Reward deleted successfully"
}
```

---

#### POST `/rewards/redeem`
Canjear recompensa (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "customerId": "uuid",
  "rewardId": "uuid"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "rewardId": "uuid",
  "status": "PENDING",
  "redeemedAt": "2024-01-15T10:30:00Z"
}
```

**Nota:** Descuenta automáticamente los puntos del cliente

**Errores:**
- `400`: Puntos insuficientes
- `400`: Recompensa no pertenece al negocio

---

### Promotions

#### POST `/promotions`
Crear promoción (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "title": "2x1 en cafés",
  "description": "Compra un café y lleva otro gratis",
  "discount": 50.00,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "isActive": true
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "title": "2x1 en cafés",
  "description": "Compra un café y lleva otro gratis",
  "discount": 50.00,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### GET `/promotions`
Listar todas las promociones

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "businessId": "uuid",
    "title": "2x1 en cafés",
    "description": "Compra un café y lleva otro gratis",
    "discount": 50.00,
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "isActive": true,
    "business": {
      "id": "uuid",
      "name": "Café Central"
    }
  }
]
```

---

#### GET `/promotions/active`
Obtener promociones activas (vigentes)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "businessId": "uuid",
    "title": "2x1 en cafés",
    "description": "Compra un café y lleva otro gratis",
    "discount": 50.00,
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "isActive": true
  }
]
```

**Nota:** Solo devuelve promociones donde `isActive = true` y la fecha actual esté entre `startDate` y `endDate`

---

#### GET `/promotions/business/:businessId`
Obtener promociones de un negocio

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "businessId": "uuid",
    "title": "2x1 en cafés",
    "description": "Compra un café y lleva otro gratis",
    "discount": 50.00,
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "isActive": true
  }
]
```

---

#### GET `/promotions/:id`
Obtener promoción por ID

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "title": "2x1 en cafés",
  "description": "Compra un café y lleva otro gratis",
  "discount": 50.00,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "isActive": true
}
```

---

#### PATCH `/promotions/:id`
Actualizar promoción (solo propietario)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "discount": 40.00,
  "isActive": false
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "title": "2x1 en cafés",
  "description": "Compra un café y lleva otro gratis",
  "discount": 40.00,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "isActive": false
}
```

---

#### DELETE `/promotions/:id`
Eliminar promoción (solo propietario)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "message": "Promotion deleted successfully"
}
```

---

### Analytics

#### GET `/analytics/dashboard`
Obtener dashboard completo del negocio (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
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

**Descripción de campos:**
- `totalCustomers`: Total de clientes únicos que han interactuado con el negocio
- `totalPointsGiven`: Total de puntos otorgados a todos los clientes
- `totalPointsRedeemed`: Total de puntos canjeados por clientes
- `totalRewardsRedeemed`: Total de recompensas canjeadas
- `activePromotions`: Promociones actualmente activas
- `completedStampCards`: Tarjetas de sellos completadas
- `averagePointsPerCustomer`: Promedio de puntos ganados por cliente

**Errores:**
- `404`: Negocio no encontrado para este usuario

---

#### GET `/analytics/dashboard/:businessId`
Obtener dashboard de un negocio específico (público)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
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

---

#### GET `/analytics/top-customers?limit=10`
Obtener top clientes con más puntos (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `limit` (opcional): Cantidad de clientes a retornar (default: 10)

**Response 200:**
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

**Nota:** Los puntos son la suma total (ganados - canjeados) de cada cliente

---

#### GET `/analytics/top-rewards?limit=10`
Obtener recompensas más canjeadas (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `limit` (opcional): Cantidad de recompensas a retornar (default: 10)

**Response 200:**
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

---

#### GET `/analytics/points-activity?days=30`
Obtener actividad de puntos por día (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `days` (opcional): Cantidad de días hacia atrás (default: 30)

**Response 200:**
```json
[
  {
    "date": "2024-01-15",
    "type": "EARN",
    "totalPoints": 450
  },
  {
    "date": "2024-01-15",
    "type": "REDEEM",
    "totalPoints": 200
  },
  {
    "date": "2024-01-16",
    "type": "EARN",
    "totalPoints": 600
  }
]
```

**Nota:** Útil para crear gráficas de actividad de puntos ganados vs canjeados

---

#### GET `/analytics/customer-growth`
Obtener crecimiento de clientes por mes (últimos 6 meses) (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "month": "2024-08",
    "newCustomers": 12
  },
  {
    "month": "2024-09",
    "newCustomers": 18
  },
  {
    "month": "2024-10",
    "newCustomers": 25
  }
]
```

**Nota:** Muestra clientes nuevos por mes basado en su primera transacción

---

#### GET `/analytics/programs-stats`
Obtener estadísticas de programas de fidelización (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "activeCards": 85,
  "completedCards": 42,
  "totalCards": 127,
  "completionRate": 33.07
}
```

**Descripción de campos:**
- `activeCards`: Tarjetas de sellos activas (no completadas)
- `completedCards`: Tarjetas de sellos completadas
- `totalCards`: Total de tarjetas (activas + completadas)
- `completionRate`: Porcentaje de completación (%)

---

#### GET `/analytics/promotions-stats`
Obtener estadísticas de promociones (solo BUSINESS)

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "total": 15,
  "active": 3,
  "expired": 8,
  "scheduled": 4
}
```

**Descripción de campos:**
- `total`: Total de promociones creadas
- `active`: Promociones actualmente vigentes (isActive=true y dentro de fechas)
- `expired`: Promociones que ya pasaron su fecha de fin
- `scheduled`: Promociones programadas para el futuro

---

## 📊 Modelos de Datos

### User
```typescript
{
  id: string;              // UUID
  email: string;           // Email único
  password: string;        // Hash bcrypt (no se devuelve en respuestas)
  role: "BUSINESS" | "CUSTOMER";
  createdAt: Date;
  updatedAt: Date;
}
```

### Business
```typescript
{
  id: string;
  userId: string;          // Relación con User
  name: string;
  description?: string;
  category?: string;
  address?: string;
  phone?: string;
  logo?: string;           // URL
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
{
  id: string;
  userId: string;          // Relación con User
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: Date;        // Formato: YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}
```

### LoyaltyProgram
```typescript
{
  id: string;
  businessId: string;
  name: string;
  type: "STAMPS" | "POINTS";
  isActive: boolean;
  stampsRequired?: number;      // Requerido si type = "STAMPS"
  pointsPerPurchase?: number;   // Requerido si type = "POINTS"
  createdAt: Date;
  updatedAt: Date;
}
```

### StampCard
```typescript
{
  id: string;
  customerId: string;
  programId: string;
  stampsCollected: number;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### PointsTransaction
```typescript
{
  id: string;
  customerId: string;
  businessId: string;
  type: "EARN" | "REDEEM";
  points: number;              // Positivo para EARN, negativo para REDEEM
  description?: string;
  createdAt: Date;
}
```

### Reward
```typescript
{
  id: string;
  businessId: string;
  name: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### CustomerReward
```typescript
{
  id: string;
  customerId: string;
  rewardId: string;
  status: "PENDING" | "USED";
  redeemedAt: Date;
}
```

### Promotion
```typescript
{
  id: string;
  businessId: string;
  title: string;
  description: string;
  discount: number;            // Porcentaje (0-100)
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos o faltantes |
| 401 | Unauthorized - Token inválido o no proporcionado |
| 403 | Forbidden - Sin permisos para esta acción |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Recurso ya existe (ej: email duplicado) |
| 500 | Internal Server Error - Error del servidor |

### Formato de Error
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

---

## 🔄 Flujos Completos

### Flujo 1: Registro y Creación de Negocio

```javascript
// 1. Registrar usuario como BUSINESS
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'negocio@ejemplo.com',
    password: 'password123',
    role: 'BUSINESS'
  })
});
const { access_token } = await registerResponse.json();

// 2. Crear perfil del negocio
const businessResponse = await fetch('/api/business', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Café Central',
    description: 'El mejor café',
    category: 'Cafetería',
    address: 'Calle 123',
    phone: '+56912345678'
  })
});
const business = await businessResponse.json();

// 3. Crear programa de fidelización
const programResponse = await fetch('/api/loyalty/programs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '10 cafés, 1 gratis',
    type: 'STAMPS',
    stampsRequired: 10
  })
});
const program = await programResponse.json();
```

### Flujo 2: Cliente Obtiene Sello

```javascript
// 1. Cliente se registra
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'cliente@ejemplo.com',
    password: 'password123',
    role: 'CUSTOMER'
  })
});
const { access_token, user } = await registerResponse.json();

// 2. Cliente crea su perfil
const customerResponse = await fetch('/api/customers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+56912345678'
  })
});
const customer = await customerResponse.json();

// 3. Cliente crea tarjeta de sellos (o la app lo hace automáticamente)
const cardResponse = await fetch('/api/loyalty/stamp-cards', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerId: customer.id,
    programId: 'program-uuid'
  })
});
const stampCard = await cardResponse.json();

// 4. Negocio agrega sello (cuando cliente compra)
// (El negocio debe estar autenticado)
const stampResponse = await fetch('/api/loyalty/stamp-cards/stamps', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${business_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    stampCardId: stampCard.id,
    customerId: customer.id
  })
});
const updatedCard = await stampResponse.json();
// updatedCard.stampsCollected será incrementado en 1
```

### Flujo 3: Sistema de Puntos

```javascript
// 1. Negocio otorga puntos al cliente
const earnResponse = await fetch('/api/loyalty/points/earn', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${business_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerId: 'customer-uuid',
    points: 100,
    description: 'Compra de $10.000'
  })
});

// 2. Ver balance del cliente
const balanceResponse = await fetch(
  `/api/loyalty/points/balance/${customerId}/${businessId}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const balance = await balanceResponse.json(); // ej: 250

// 3. Cliente canjea recompensa
const redeemResponse = await fetch('/api/rewards/redeem', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${business_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerId: 'customer-uuid',
    rewardId: 'reward-uuid'
  })
});
// Descuenta automáticamente los puntos necesarios
```

### Flujo 4: Ver Promociones Activas

```javascript
// 1. Obtener promociones activas
const promotionsResponse = await fetch('/api/promotions/active', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const activePromotions = await promotionsResponse.json();

// 2. Obtener promociones de un negocio específico
const businessPromotions = await fetch(
  `/api/promotions/business/${businessId}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const promotions = await businessPromotions.json();
```

### Flujo 5: Dashboard de Analytics

```javascript
// 1. Obtener dashboard general del negocio
const dashboardResponse = await fetch('/api/analytics/dashboard', {
  headers: { 'Authorization': `Bearer ${business_token}` }
});
const dashboard = await dashboardResponse.json();
/*
{
  totalCustomers: 150,
  totalPointsGiven: 45000,
  totalPointsRedeemed: 12000,
  totalRewardsRedeemed: 85,
  activePromotions: 3,
  completedStampCards: 42,
  averagePointsPerCustomer: 300
}
*/

// 2. Obtener top 10 clientes
const topCustomersResponse = await fetch(
  '/api/analytics/top-customers?limit=10',
  {
    headers: { 'Authorization': `Bearer ${business_token}` }
  }
);
const topCustomers = await topCustomersResponse.json();

// 3. Obtener actividad de puntos (últimos 30 días)
const activityResponse = await fetch(
  '/api/analytics/points-activity?days=30',
  {
    headers: { 'Authorization': `Bearer ${business_token}` }
  }
);
const pointsActivity = await activityResponse.json();
// Usar para crear gráfica de líneas con puntos ganados vs canjeados

// 4. Obtener crecimiento de clientes
const growthResponse = await fetch('/api/analytics/customer-growth', {
  headers: { 'Authorization': `Bearer ${business_token}` }
});
const customerGrowth = await growthResponse.json();
// Usar para crear gráfica de barras de crecimiento mensual

// 5. Estadísticas de programas
const programsStatsResponse = await fetch(
  '/api/analytics/programs-stats',
  {
    headers: { 'Authorization': `Bearer ${business_token}` }
  }
);
const programsStats = await programsStatsResponse.json();
// Mostrar tasa de completación de tarjetas de sellos

// 6. Estadísticas de promociones
const promotionsStatsResponse = await fetch(
  '/api/analytics/promotions-stats',
  {
    headers: { 'Authorization': `Bearer ${business_token}` }
  }
);
const promotionsStats = await promotionsStatsResponse.json();
// Mostrar promociones activas, expiradas y programadas
```

---

## 💡 Notas Importantes

1. **Todos los endpoints requieren autenticación** excepto `/auth/register` y `/auth/login`

2. **El token JWT expira en 7 días** (configurable en `.env`)

3. **Los IDs son UUIDs**, no números incrementales

4. **Las fechas están en formato ISO 8601**: `2024-01-15T10:30:00Z`

5. **Los puntos son enteros positivos**, las transacciones de tipo REDEEM se guardan con signo negativo automáticamente

6. **Las tarjetas de sellos se completan automáticamente** cuando `stampsCollected >= stampsRequired`

7. **Al canjear una recompensa**, los puntos se descuentan automáticamente del balance del cliente

8. **CORS está habilitado**, asegúrate de configurar la URL de tu frontend en el `.env` del backend

---

## 🧪 Testing Rápido con cURL

```bash
# Registrar negocio
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@business.com","password":"test123","role":"BUSINESS"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@business.com","password":"test123"}'

# Obtener perfil (reemplaza TOKEN)
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 📞 Contacto y Soporte

Si encuentras algún error o necesitas aclaraciones sobre algún endpoint, contacta al equipo de backend.

**Base URL de Producción:** TBD

**Versión actual:** 1.0.0

---

*Última actualización: Diciembre 2024 - Agregado módulo Analytics*
