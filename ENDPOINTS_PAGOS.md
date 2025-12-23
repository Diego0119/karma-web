# 💳 Sistema de Pagos - Endpoints Implementados

## ✅ Implementación Completada

### 📁 Archivos Creados/Modificados

**Nuevas Entidades:**
- `src/subscriptions/entities/checkout-session.entity.ts` - Sesiones de checkout
- `migrations/007_create_checkout_sessions_table.sql` - Tabla de sesiones

**Nuevos DTOs:**
- `src/subscriptions/dto/create-checkout.dto.ts` - Crear sesión de pago
- `src/subscriptions/dto/change-plan.dto.ts` - Cambiar plan
- `src/subscriptions/dto/plan-info.dto.ts` - Info de planes

**Controladores:**
- `src/subscriptions/subscriptions.controller.ts` - Actualizado con nuevos endpoints
- `src/subscriptions/webhooks.controller.ts` - **NUEVO** - Recibe webhooks de pasarela

**Servicios:**
- `src/subscriptions/subscriptions.service.ts` - Actualizado con lógica de pagos

---

## 🔐 Endpoints Disponibles

### 1️⃣ **Obtener Planes Disponibles** (Público para BUSINESS)
```
GET /api/subscription/plans
```
**Auth:** Requiere JWT + rol BUSINESS

**Response:**
```json
[
  {
    "plan": "FREE",
    "name": "Free",
    "price": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "features": ["Hasta 100 clientes", "..."],
    "maxCustomers": 100,
    "maxPrograms": 2,
    "maxPromotions": 3,
    "hasAnalytics": false
  },
  {
    "plan": "PRO",
    "name": "Pro",
    "price": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "features": ["Hasta 1,000 clientes", "Analytics avanzado", "..."],
    "maxCustomers": 1000,
    "maxPrograms": 10,
    "maxPromotions": 20,
    "hasAnalytics": true,
    "isPopular": true
  },
  {
    "plan": "ENTERPRISE",
    "name": "Enterprise",
    "price": 99,
    "currency": "USD",
    "billingPeriod": "month",
    "features": ["Clientes ilimitados", "API personalizada", "..."],
    "maxCustomers": 999999,
    "maxPrograms": 999,
    "maxPromotions": 999,
    "hasAnalytics": true
  }
]
```

---

### 2️⃣ **Crear Sesión de Checkout** (Iniciar Pago)
```
POST /api/subscription/create-checkout
```
**Auth:** Requiere JWT + rol BUSINESS

**Body:**
```json
{
  "plan": "PRO"  // "PRO" o "ENTERPRISE" (no FREE)
}
```

**Response:**
```json
{
  "sessionId": "cs_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "checkoutUrl": "http://localhost:5173/checkout/cs_a1b2c3d4...",
  "expiresAt": "2024-12-19T10:30:00.000Z"
}
```

**Errores:**
- `400` - "Cannot create checkout for FREE plan"
- `400` - "You are already subscribed to this plan"
- `404` - "Business not found"

---

### 3️⃣ **Obtener Sesión de Checkout**
```
GET /api/subscription/checkout/:sessionId
```
**Auth:** Requiere JWT + rol BUSINESS

**Response:**
```json
{
  "id": "uuid",
  "sessionId": "cs_...",
  "plan": "PRO",
  "amount": 29,
  "currency": "USD",
  "status": "PENDING",
  "expiresAt": "2024-12-19T10:30:00.000Z",
  "createdAt": "2024-12-18T09:30:00.000Z"
}
```

---

### 4️⃣ **Webhook de Pago** (NO requiere auth - viene de pasarela)
```
POST /api/webhooks/payment
```
**Auth:** NINGUNA (público - viene de la pasarela de pagos)

**Headers:**
```
x-webhook-signature: [firma de la pasarela]
```

**Body:**
```json
{
  "type": "payment.succeeded",  // o "payment.failed", "checkout.session.completed"
  "sessionId": "cs_a1b2c3d4...",
  "paymentId": "pi_1234567890",  // opcional
  "paymentMethod": "STRIPE",     // opcional: STRIPE, PAYPAL, MERCADO_PAGO
  "reason": "Card declined"      // solo si falló
}
```

**Tipos de eventos soportados:**
- `payment.succeeded` - Pago exitoso
- `checkout.session.completed` - Sesión completada
- `payment.failed` - Pago fallido
- `checkout.session.expired` - Sesión expiró

**Response:**
```json
{
  "success": true,
  "message": "Subscription upgraded to PRO successfully"
}
```

---

### 5️⃣ **Simular Pago Exitoso** (Solo para testing/sandbox)
```
POST /api/webhooks/payment/simulate-success
```
**Auth:** NINGUNA

**Body:**
```json
{
  "sessionId": "cs_a1b2c3d4..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription upgraded to PRO successfully"
}
```

**⚠️ IMPORTANTE:** Este endpoint es solo para testing. Elimínalo o protégelo en producción.

---

### 6️⃣ **Simular Pago Fallido** (Solo para testing/sandbox)
```
POST /api/webhooks/payment/simulate-failure
```
**Auth:** NINGUNA

**Body:**
```json
{
  "sessionId": "cs_a1b2c3d4..."
}
```

**Response:**
```json
{
  "success": false,
  "message": "Payment failed"
}
```

---

## 🔄 Flujo Completo de Pago

### Para el Frontend:

1. **Usuario hace clic en "Upgrade to PRO"**
   ```typescript
   const response = await fetch('http://localhost:3000/api/subscription/create-checkout', {
     method: 'POST',
     credentials: 'include',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ plan: 'PRO' })
   });

   const { sessionId, checkoutUrl } = await response.json();
   ```

2. **Redirigir al usuario a la página de checkout**
   ```typescript
   // Para sandbox/testing (sin pasarela real):
   window.location.href = `/checkout/${sessionId}`;

   // Para pasarela real (cuando la integres):
   // window.location.href = checkoutUrl; // URL de Stripe/MercadoPago/etc
   ```

3. **En la página de checkout (sandbox), mostrar:**
   - Plan seleccionado
   - Precio
   - Botones: "Simular Pago Exitoso" y "Simular Pago Fallido"

4. **Usuario simula el pago (o paga real en producción)**
   ```typescript
   // Simular pago exitoso (solo testing):
   await fetch('http://localhost:3000/api/webhooks/payment/simulate-success', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ sessionId })
   });

   // En producción, la pasarela enviará el webhook automáticamente
   ```

5. **Backend procesa el pago:**
   - ✅ Actualiza suscripción a ACTIVE
   - ✅ Cambia el plan (FREE → PRO)
   - ✅ Extiende expiración por 30 días
   - ✅ Crea factura con estado PAID
   - ✅ Actualiza límites del plan

6. **Redirigir al usuario de vuelta al dashboard**
   ```typescript
   window.location.href = '/dashboard?payment=success';
   ```

---

## 📊 Base de Datos

### Nueva Tabla: `checkout_sessions`

Debes ejecutar esta migración:

```sql
-- migrations/007_create_checkout_sessions_table.sql
CREATE TABLE checkout_sessions (
  id VARCHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  businessId VARCHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  sessionId VARCHAR(255) COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
  plan ENUM('FREE', 'PRO', 'ENTERPRISE') COLLATE utf8mb4_unicode_ci NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  status ENUM('PENDING', 'COMPLETED', 'EXPIRED', 'CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  paymentId VARCHAR(255) COLLATE utf8mb4_unicode_ci NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_checkout_sessions_business FOREIGN KEY (businessId) REFERENCES businesses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔐 Seguridad

### Para Producción (cuando integres pasarela real):

1. **Verificar firma de webhooks:**
   ```typescript
   // En webhooks.controller.ts, descomentar y configurar:
   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
   // Verificar firma según la pasarela
   ```

2. **Variables de entorno necesarias:**
   ```env
   # Pasarela de pagos
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # O para MercadoPago:
   MERCADO_PAGO_ACCESS_TOKEN=...
   MERCADO_PAGO_WEBHOOK_SECRET=...

   # Frontend URL para redirecciones
   FRONTEND_URL=https://tudominio.com
   ```

3. **Eliminar o proteger endpoints de testing:**
   - `POST /webhooks/payment/simulate-success`
   - `POST /webhooks/payment/simulate-failure`

---

## 🧪 Probar el Flujo en Sandbox

### Opción 1: Sin pasarela real (solo simulación)

1. Crear checkout:
   ```bash
   curl -X POST http://localhost:3000/api/subscription/create-checkout \
     -H "Content-Type: application/json" \
     -H "Cookie: token=YOUR_JWT" \
     -d '{"plan":"PRO"}'
   ```

2. Simular pago exitoso:
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/payment/simulate-success \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"cs_..."}'
   ```

3. Verificar suscripción actualizada:
   ```bash
   curl http://localhost:3000/api/subscription \
     -H "Cookie: token=YOUR_JWT"
   ```

### Opción 2: Con pasarela real en modo sandbox

Cuando integres Stripe/MercadoPago/etc:
1. Configura las credenciales de sandbox/test
2. El `checkoutUrl` será la URL real de la pasarela
3. Usa tarjetas de prueba de la pasarela
4. Los webhooks llegarán automáticamente

---

## 📝 Notas Importantes

1. **Sesiones expiran en 1 hora** - Si el usuario no completa el pago en 1 hora, debe crear una nueva sesión

2. **Precios hardcoded** - Los precios están definidos en el servicio:
   - FREE: $0
   - PRO: $29/mes
   - ENTERPRISE: $99/mes

3. **Moneda:** Actualmente solo USD

4. **Billing:** Suscripciones mensuales (30 días)

5. **Webhooks sin auth:** El endpoint `/webhooks/payment` NO requiere autenticación porque viene de servicios externos

---

## 🚀 Próximos Pasos

1. ✅ **Ejecutar migración SQL** (007_create_checkout_sessions_table.sql)
2. ✅ **Probar flujo con endpoints de simulación**
3. ⏳ **Integrar pasarela de pagos real** (Stripe, MercadoPago, etc)
4. ⏳ **Configurar webhooks en la pasarela**
5. ⏳ **Implementar verificación de firmas**
6. ⏳ **Agregar emails de confirmación de pago**
7. ⏳ **Dashboard de administración de pagos**
