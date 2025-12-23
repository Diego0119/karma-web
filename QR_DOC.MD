# 📱 Documentación de QR Codes - Karma Backend

## 🎯 Dos tipos de QR Codes

Existen **DOS flujos de QR** diferentes en el sistema:

| QR | Quién lo tiene | Quién lo escanea | Para qué |
|----|---------------|------------------|----------|
| **Customer QR** | Cliente (en Wallet) | Negocio (en POS) | Agregar puntos/sellos |
| **Business QR** | Negocio (impreso) | Cliente (con móvil) | Inscribirse en programa |

---

# 1️⃣ Customer QR Code

## 📖 ¿Cómo funciona?

```
1. Cliente muestra su QR (desde Wallet o app)
2. Negocio escanea con su app
3. Sistema muestra datos de lealtad del cliente
4. Negocio elige: agregar puntos o sellos
5. Sistema registra transacción
```

---

## 🔐 Endpoints (requieren autenticación BUSINESS)

### **1. Escanear QR del cliente**

```http
POST /loyalty/scan
Authorization: Bearer <business-token>
Content-Type: application/json

{
  "qrCode": "customer-uuid-abc123"
}
```

**Response:**
```json
{
  "customer": {
    "id": "customer-uuid",
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
        }
      ]
    }
  ]
}
```

**Errores:**
- `404` - Cliente no encontrado con ese QR
- `403` - No tienes permisos para escanear

---

### **2. Agregar puntos**

```http
POST /loyalty/points/earn
Authorization: Bearer <business-token>
Content-Type: application/json

{
  "customerId": "customer-uuid",
  "purchaseAmount": 50.00,
  "description": "Compra en tienda"
}
```

**Comportamiento:**
- Backend calcula puntos automáticamente usando `pointsConversionRate`
- Ejemplo: `purchaseAmount=50` y `rate=10` → Cliente gana **5 puntos**
- Envía notificación push al cliente

**Response:**
```json
{
  "id": "transaction-uuid",
  "customerId": "customer-uuid",
  "businessId": "business-uuid",
  "type": "EARN",
  "points": 5,
  "description": "Compra de $50.00",
  "createdAt": "2024-12-16T15:30:00Z"
}
```

**Errores:**
- `404` - Programa de puntos no encontrado
- `400` - Monto muy bajo para ganar puntos

---

### **3. Agregar sello**

```http
POST /loyalty/stamp-cards/stamps
Authorization: Bearer <business-token>
Content-Type: application/json

{
  "stampCardId": "card-uuid",
  "customerId": "customer-uuid"
}
```

**Comportamiento:**
- Incrementa contador de sellos
- Si alcanza `stampsRequired`, marca tarjeta como completada
- Envía notificación push al cliente

**Response:**
```json
{
  "id": "card-uuid",
  "customerId": "customer-uuid",
  "programId": "program-uuid",
  "stampsCollected": 8,
  "isCompleted": false,
  "completedAt": null,
  "createdAt": "2024-12-16T15:30:00Z"
}
```

**Errores:**
- `404` - Tarjeta no encontrada
- `400` - Tarjeta ya completada

---

## 💻 Implementación Frontend (POS del negocio)

### **Pantalla de escaneo:**

```tsx
import { QrScanner } from '@yudiel/react-qr-scanner';

function ScanCustomerScreen() {
  const [customerData, setCustomerData] = useState(null);

  const handleScan = async (qrCode: string) => {
    try {
      const response = await api.post('/loyalty/scan', { qrCode });
      setCustomerData(response.data);
    } catch (error) {
      toast.error('Cliente no encontrado');
    }
  };

  return (
    <div>
      <h1>Escanear Cliente</h1>
      <QrScanner onDecode={handleScan} />

      {customerData && (
        <CustomerActions data={customerData} />
      )}
    </div>
  );
}
```

### **Agregar puntos:**

```tsx
async function addPoints(customerId: string, amount: number) {
  await api.post('/loyalty/points/earn', {
    customerId,
    purchaseAmount: amount,
    description: 'Compra en tienda'
  });
  toast.success('Puntos agregados');
}
```

### **Agregar sello:**

```tsx
async function addStamp(stampCardId: string, customerId: string) {
  await api.post('/loyalty/stamp-cards/stamps', {
    stampCardId,
    customerId
  });
  toast.success('Sello agregado');
}
```

---

---

# 2️⃣ Business QR Code

## 📖 ¿Cómo funciona?

```
1. Negocio imprime su QR (businessQrCode)
2. Cliente escanea QR con su móvil
3. Abre landing page de inscripción
4. Cliente llena formulario
5. Sistema crea cuenta + inscribe en programas
6. Cliente puede descargar Wallet pass
```

---

## 🌐 Endpoints (PÚBLICOS - sin autenticación)

### **1. Obtener info del negocio**

```http
GET /public/business/:businessQrCode
```

**Ejemplo:**
```http
GET /public/business/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "business": {
    "id": "business-uuid",
    "name": "Café Express",
    "description": "La mejor cafetería de la ciudad",
    "category": "Cafetería",
    "address": "Av. Principal 123",
    "phone": "+56912345678",
    "logo": "https://cdn.example.com/logo.png"
  },
  "programs": [
    {
      "id": "program-points-uuid",
      "name": "Puntos Café Express",
      "type": "POINTS",
      "pointsConversionRate": 10
    },
    {
      "id": "program-stamps-uuid",
      "name": "Tarjeta 10 Cafés",
      "type": "STAMPS",
      "stampsRequired": 10
    }
  ]
}
```

**Uso:**
- Mostrar en landing page antes del registro
- No requiere token
- Público para cualquiera que tenga el QR

**Errores:**
- `404` - Negocio no encontrado

---

### **2. Registrar e inscribir cliente**

```http
POST /public/join/:businessQrCode
Content-Type: application/json

{
  "email": "cliente@example.com",
  "password": "123456",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56912345678",
  "birthDate": "1990-05-15"
}
```

**Campos:**
- `email` (requerido): Email del cliente
- `password` (requerido, min 6): Contraseña
- `firstName` (requerido): Nombre
- `lastName` (requerido): Apellido
- `phone` (opcional): Teléfono
- `birthDate` (opcional): Fecha de nacimiento (YYYY-MM-DD)

**Response:**
```json
{
  "customer": {
    "id": "customer-uuid",
    "qrCode": "customer-qr-abc123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+56912345678"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "enrolledPrograms": [
    {
      "programId": "program-points-uuid",
      "programName": "Puntos Café Express",
      "type": "POINTS"
    },
    {
      "programId": "program-stamps-uuid",
      "programName": "Tarjeta 10 Cafés",
      "type": "STAMPS",
      "stampCardId": "card-uuid-123"
    }
  ]
}
```

**Comportamiento:**
- ✅ Crea usuario nuevo (o reutiliza si email existe como CUSTOMER)
- ✅ Crea perfil de Customer con QR único
- ✅ Inscribe automáticamente en TODOS los programas STAMPS (crea StampCards)
- ✅ Registra inscripción en programas POINTS
- ✅ Retorna JWT token válido por 7 días

**Errores:**
- `400` - Email ya registrado como BUSINESS
- `400` - Contraseña muy corta
- `404` - Negocio no encontrado

---

## 💻 Implementación Frontend (App del cliente)

### **Landing page:**

```tsx
function JoinBusinessPage() {
  const { businessQrCode } = useParams();
  const [businessInfo, setBusinessInfo] = useState(null);

  useEffect(() => {
    // Cargar info del negocio
    api.get(`/public/business/${businessQrCode}`)
      .then(res => setBusinessInfo(res.data));
  }, [businessQrCode]);

  if (!businessInfo) return <Loading />;

  return (
    <div>
      <img src={businessInfo.business.logo} />
      <h1>{businessInfo.business.name}</h1>
      <p>{businessInfo.business.description}</p>

      <h2>Programas disponibles:</h2>
      <ul>
        {businessInfo.programs.map(program => (
          <li key={program.id}>
            {program.name} ({program.type})
          </li>
        ))}
      </ul>

      <RegistrationForm businessQrCode={businessQrCode} />
    </div>
  );
}
```

### **Formulario de registro:**

```tsx
function RegistrationForm({ businessQrCode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        `/public/join/${businessQrCode}`,
        formData
      );

      // Guardar token
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('customerQrCode', response.data.customer.qrCode);

      // Redirigir a página de éxito
      navigate('/join-success', { state: response.data });

    } catch (error) {
      toast.error('Error al registrarse');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
        minLength={6}
      />
      <input
        type="text"
        placeholder="Nombre"
        value={formData.firstName}
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        value={formData.lastName}
        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        required
      />
      <input
        type="tel"
        placeholder="Teléfono (opcional)"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
      />
      <button type="submit">Unirse</button>
    </form>
  );
}
```

---

## 🏪 Dashboard del Negocio - Obtener su QR

### **Endpoint:**

```http
GET /business/me
Authorization: Bearer <business-token>
```

**Response:**
```json
{
  "id": "business-uuid",
  "name": "Café Express",
  "businessQrCode": "550e8400-e29b-41d4-a716-446655440000",
  ...
}
```

### **Generar imagen del QR:**

```tsx
function BusinessQRCode() {
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    api.get('/business/me').then(res => setBusiness(res.data));
  }, []);

  if (!business) return <Loading />;

  // URL que se abrirá al escanear el QR
  const joinUrl = `https://tuapp.com/join/${business.businessQrCode}`;

  // Generar imagen del QR usando servicio externo
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(joinUrl)}&size=300x300`;

  return (
    <div className="business-qr-section">
      <h2>QR de Inscripción</h2>
      <p>Imprime este QR y colócalo en tu negocio</p>

      <img src={qrImageUrl} alt="QR del negocio" />

      <button onClick={() => window.open(qrImageUrl)}>
        Descargar QR
      </button>

      <button onClick={() => navigator.clipboard.writeText(joinUrl)}>
        Copiar Link
      </button>

      <p className="small">{joinUrl}</p>
    </div>
  );
}
```

---

## 📊 Resumen de Flujos

### **Flujo 1: Negocio escanea cliente**
```
Cliente → Muestra QR (Wallet) → Negocio escanea →
Ve datos → Agrega puntos/sellos
```

**Endpoints:**
- `POST /loyalty/scan` (requiere token BUSINESS)
- `POST /loyalty/points/earn` (requiere token BUSINESS)
- `POST /loyalty/stamp-cards/stamps` (requiere token BUSINESS)

---

### **Flujo 2: Cliente escanea negocio**
```
Negocio → Imprime QR → Cliente escanea →
Landing page → Registro → Inscripción automática
```

**Endpoints:**
- `GET /public/business/:qrCode` (público)
- `POST /public/join/:qrCode` (público)
- `GET /business/me` (requiere token BUSINESS - para obtener su QR)

---

## ✅ Checklist de Implementación Frontend

### **App del Negocio (POS):**
- [ ] Pantalla de escaneo de QR de clientes
- [ ] Modal para agregar puntos (input de monto)
- [ ] Botón para agregar sellos
- [ ] Mostrar historial de transacciones
- [ ] Dashboard con QR del negocio para imprimir

### **App del Cliente:**
- [ ] Landing page `/join/:businessQrCode`
- [ ] Formulario de registro
- [ ] Página de éxito post-registro
- [ ] Mostrar QR personal del cliente
- [ ] Botones para descargar Wallet passes

---

## 🔐 Autenticación

| Endpoint | Auth | Rol |
|----------|------|-----|
| `POST /loyalty/scan` | ✅ Sí | BUSINESS |
| `POST /loyalty/points/earn` | ✅ Sí | BUSINESS |
| `POST /loyalty/stamp-cards/stamps` | ✅ Sí | BUSINESS |
| `GET /business/me` | ✅ Sí | BUSINESS |
| `GET /public/business/:qrCode` | ❌ No | Público |
| `POST /public/join/:qrCode` | ❌ No | Público |

---

## 🧪 Testing

### **Probar escaneo de cliente:**
```bash
# 1. Login como negocio
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "negocio@test.com", "password": "123456"}'

# 2. Escanear cliente (usar qrCode de un customer existente)
curl -X POST http://localhost:3000/loyalty/scan \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"qrCode": "customer-qr-code"}'
```

### **Probar inscripción de cliente:**
```bash
# 1. Obtener businessQrCode
curl http://localhost:3000/business/me \
  -H "Authorization: Bearer <business-token>"

# 2. Ver info pública del negocio
curl http://localhost:3000/public/business/<businessQrCode>

# 3. Registrar nuevo cliente
curl -X POST http://localhost:3000/public/join/<businessQrCode> \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@test.com",
    "password": "123456",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+56912345678"
  }'
```

---

## 📚 Documentación Adicional

- **Customer Onboarding completo**: Ver `CUSTOMER_ONBOARDING_FLOW.md`
- **API completa**: Ver `API_DOCUMENTATION.md`

---

**¿Dudas?** Todos los endpoints están implementados y probados. El backend está listo para que el frontend consuma estas APIs.
