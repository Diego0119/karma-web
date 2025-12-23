# 🇨🇱 Integración Flow - Sandbox Configurado

## ✅ Implementación Completada

### 📁 Archivos Creados:

1. **src/subscriptions/services/flow.service.ts** - Servicio de integración con Flow
2. **src/subscriptions/flow-webhook.controller.ts** - Recibe webhooks de Flow
3. **.env** - Credenciales configuradas

### 🔑 Credenciales Configuradas (Sandbox):

```env
FLOW_API_KEY=3BAF4FC4-0E3C-4E65-9CCD-8BA68B71L547
FLOW_SECRET_KEY=679b91ec367a4b1c787f3a86b179d2907eefd647
FLOW_API_URL=https://sandbox.flow.cl/api
FLOW_RETURN_URL=http://localhost:5173/payment/return
FLOW_WEBHOOK_URL=http://localhost:3000/api/webhooks/flow
```

---

## 🔄 Cómo Funciona

### Flujo de Pago con Flow:

1. **Usuario hace clic en "Upgrade to PRO"** en el frontend

2. **Frontend llama al backend:**
   ```typescript
   POST /api/subscription/create-checkout
   Body: { "plan": "PRO" }
   ```

3. **Backend crea el pago en Flow:**
   - Convierte precio USD a CLP (PRO: $29 USD ≈ $27,550 CLP)
   - Genera firma HMAC-SHA256
   - Crea pago en Flow API
   - Retorna URL de pago

4. **Backend responde con:**
   ```json
   {
     "sessionId": "cs_a1b2c3d4...",
     "checkoutUrl": "https://sandbox.flow.cl/payment.php?token=xyz123",
     "expiresAt": "2024-12-19T10:30:00.000Z"
   }
   ```

5. **Frontend redirige al usuario a Flow:**
   ```typescript
   window.location.href = checkoutUrl;
   ```

6. **Usuario paga en el portal de Flow (sandbox)**

7. **Flow envía webhook al backend:**
   ```
   GET/POST /api/webhooks/flow?token=xyz123&s=firma...
   ```

8. **Backend procesa el webhook:**
   - Verifica firma HMAC-SHA256
   - Consulta estado del pago en Flow
   - Si pago exitoso (status=2):
     - Actualiza suscripción a ACTIVE
     - Cambia plan a PRO
     - Extiende expiración 30 días
     - Crea factura PAID

9. **Flow redirige al usuario de vuelta:**
   ```
   http://localhost:5173/payment/return?token=xyz123
   ```

10. **Frontend verifica estado:**
    ```typescript
    GET /api/subscription  // Ver suscripción actualizada
    ```

---

## 🧪 Probar en Sandbox

### 1. Ejecutar migración (si no lo hiciste):
```bash
mysql -h 127.0.0.1 -u root -p karma < migrations/007_create_checkout_sessions_table.sql
```

### 2. Iniciar el servidor:
```bash
npm run start:dev
```

### 3. Crear un checkout desde el frontend o Postman:

**Request:**
```bash
curl -X POST http://localhost:3000/api/subscription/create-checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_JWT_TOKEN" \
  -d '{"plan":"PRO"}'
```

**Response:**
```json
{
  "sessionId": "cs_12345...",
  "checkoutUrl": "https://sandbox.flow.cl/payment.php?token=abc123",
  "expiresAt": "2024-12-19T10:30:00.000Z"
}
```

### 4. Abrir la URL de checkout en el navegador:

Abre `checkoutUrl` en tu navegador. Verás el portal de pago de Flow en sandbox.

### 5. Usar tarjetas de prueba de Flow:

**Para probar pago exitoso:**
- Selecciona cualquier banco
- Usa las credenciales de prueba que Flow proporciona
- Completa el pago

**Para probar pago rechazado:**
- Selecciona "Simular rechazo" en el portal de Flow

### 6. Flow enviará el webhook automáticamente:

Flow enviará una petición GET/POST a:
```
http://localhost:3000/api/webhooks/flow?token=abc123&s=firma
```

**IMPORTANTE:** Para que Flow pueda enviar webhooks a tu localhost, necesitas:

**Opción A - ngrok (recomendado para testing):**
```bash
# Instalar ngrok
brew install ngrok  # macOS
# o descargar de https://ngrok.com

# Exponer tu puerto 3000
ngrok http 3000

# Actualizar FLOW_WEBHOOK_URL en .env:
FLOW_WEBHOOK_URL=https://tu-id-random.ngrok.io/api/webhooks/flow
```

**Opción B - Probar webhook manualmente:**
Si no quieres usar ngrok, puedes simular el webhook después de pagar:

```bash
# 1. Paga en Flow sandbox y obtén el token
# 2. Llama manualmente al webhook:

curl "http://localhost:3000/api/webhooks/flow?token=TU_TOKEN&s=FIRMA"
```

---

## 📊 Estados de Pago en Flow

| Status | Significado |
|--------|-------------|
| 1 | Pendiente de pago |
| 2 | **Pagado (exitoso)** |
| 3 | Rechazado |
| 4 | Anulado |

---

## 💰 Conversión de Precios

El backend convierte automáticamente USD a CLP:

| Plan | USD | CLP (aprox) |
|------|-----|-------------|
| PRO | $29 | $27,550 |
| ENTERPRISE | $99 | $94,050 |

**Tasa de cambio hardcoded:** 1 USD = 950 CLP

Para actualizar la tasa de cambio, edita `flow.service.ts`:
```typescript
convertUSDtoCLP(amountUSD: number): number {
  const exchangeRate = 950; // <-- Cambiar aquí
  return Math.round(amountUSD * exchangeRate);
}
```

---

## 🔐 Seguridad

### Verificación de Firmas:

El backend verifica automáticamente todas las firmas HMAC-SHA256 de Flow:

```typescript
// En flow.service.ts
verifySignature(params: Record<string, any>, receivedSignature: string): boolean {
  const calculatedSignature = this.generateSignature(params);
  return calculatedSignature === receivedSignature;
}
```

Si la firma no coincide → `400 Bad Request`

---

## 📝 Endpoints Disponibles

### 1. Crear Checkout (Inicia pago en Flow)
```
POST /api/subscription/create-checkout
```
**Auth:** JWT + BUSINESS role
**Body:** `{ "plan": "PRO" }`
**Response:**
```json
{
  "sessionId": "cs_...",
  "checkoutUrl": "https://sandbox.flow.cl/payment.php?token=...",
  "expiresAt": "..."
}
```

### 2. Webhook de Flow (recibe confirmación)
```
GET/POST /api/webhooks/flow?token=...&s=...
```
**Auth:** NINGUNA (público)
**Verifica:** Firma HMAC-SHA256
**Proceso:**
- Consulta estado en Flow API
- Actualiza suscripción si pago exitoso

---

## 🎨 Frontend - Página de Retorno

Crea una página en `/payment/return` en tu frontend:

```typescript
// /payment/return
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    // Verificar estado del pago
    fetch('/api/subscription', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.plan === 'PRO' && data.status === 'ACTIVE') {
          // Pago exitoso
          navigate('/dashboard?payment=success');
        } else {
          // Pago pendiente o fallido
          navigate('/dashboard?payment=failed');
        }
      });
  }, [token]);

  return <div>Procesando pago...</div>;
}
```

---

## 🚀 Pasar a Producción

Cuando estés listo para producción:

1. **Obtener credenciales de producción** en Flow:
   - Login en https://www.flow.cl
   - Panel de desarrollo → API Keys
   - Copiar API Key y Secret Key de **PRODUCCIÓN**

2. **Actualizar .env:**
   ```env
   FLOW_API_KEY=TU_API_KEY_PRODUCCION
   FLOW_SECRET_KEY=TU_SECRET_KEY_PRODUCCION
   FLOW_API_URL=https://www.flow.cl/api  # <-- Cambiar a producción
   FLOW_RETURN_URL=https://tudominio.com/payment/return
   FLOW_WEBHOOK_URL=https://tudominio.com/api/webhooks/flow
   ```

3. **Configurar webhook en Flow:**
   - Panel Flow → Configuración → Webhooks
   - Agregar: `https://tudominio.com/api/webhooks/flow`

4. **Usar tasa de cambio real:**
   - Integrar API de conversión (ej: exchangerate-api.com)
   - O actualizar manualmente la tasa en `flow.service.ts`

---

## 🔍 Logs y Debugging

El sistema registra todos los eventos importantes:

```bash
# Ver logs del servidor
npm run start:dev

# Logs que verás:
[FlowService] Creating Flow payment: cs_12345...
[FlowWebhookController] Flow webhook received: {...}
[FlowWebhookController] Flow payment status: {...}
```

---

## ❓ Troubleshooting

### Error: "Flow credentials not configured"
- Verifica que `.env` tenga `FLOW_API_KEY` y `FLOW_SECRET_KEY`
- Reinicia el servidor

### Error: "Invalid signature"
- Flow cambió su Secret Key
- Verifica que `FLOW_SECRET_KEY` esté correcto

### No llega el webhook
- Usa ngrok para exponer localhost
- Actualiza `FLOW_WEBHOOK_URL` con la URL de ngrok
- Verifica que el endpoint `/api/webhooks/flow` esté accesible

### Pago exitoso pero suscripción no se actualiza
- Revisa los logs del servidor
- Verifica que el webhook se esté recibiendo
- Prueba llamar al webhook manualmente

---

## 📞 Soporte Flow

- Documentación: https://www.flow.cl/docs/api.html
- Email: soporte@flow.cl
- Panel Sandbox: https://sandbox.flow.cl

