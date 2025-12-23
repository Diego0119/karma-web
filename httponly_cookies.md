# 🔐 Autenticación con httpOnly Cookies

## ✅ Cambios Implementados en Backend

El backend ahora usa **httpOnly cookies** para manejar la autenticación en lugar de enviar tokens en el body de las respuestas. Esto es mucho más seguro porque:

- ✅ Las cookies httpOnly **no pueden ser accedidas por JavaScript** (previene XSS)
- ✅ El navegador **envía automáticamente** la cookie en cada request
- ✅ Protección contra **CSRF** con `sameSite: 'strict'`
- ✅ Solo se transmiten por **HTTPS en producción** (`secure: true`)

---

## 🔧 Configuración del Backend

### **1. Cookie Parser instalado** ✅
```typescript
// main.ts
import * as cookieParser from 'cookie-parser';

app.use(cookieParser());
```

### **2. CORS configurado con credentials** ✅
```typescript
// main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
});
```

### **3. JWT Strategy lee desde cookies** ✅
```typescript
// jwt.strategy.ts
jwtFromRequest: ExtractJwt.fromExtractors([
  (request: Request) => {
    // Primero intenta desde cookie
    return request?.cookies?.token;
  },
  // Fallback a header Authorization (compatibilidad)
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]),
```

---

## 📡 Endpoints Modificados

### **POST /auth/register**

**Antes:**
```json
Response:
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ahora:**
```json
Response:
{
  "user": {...}
}

Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Configuración de la Cookie:**
```typescript
res.cookie('token', result.token, {
  httpOnly: true,              // No accesible desde JS
  secure: true,                // Solo HTTPS (en producción)
  sameSite: 'strict',          // Protección CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
});
```

---

### **POST /auth/login**

**Antes:**
```json
Response:
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ahora:**
```json
Response:
{
  "user": {...}
}

Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

---

### **POST /auth/logout** ✅ NUEVO

```http
POST /auth/logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}

Set-Cookie: token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

---

### **POST /public/join/:businessQrCode**

**Antes:**
```json
Response:
{
  "customer": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "enrolledPrograms": [...]
}
```

**Ahora:**
```json
Response:
{
  "customer": {...},
  "enrolledPrograms": [...]
}

Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

---

## 💻 Implementación en Frontend

### **1. Configurar Axios con credentials**

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // ← IMPORTANTE: Envía cookies automáticamente
});

export default api;
```

---

### **2. Login**

**Antes:**
```typescript
async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });

  // Guardar token manualmente
  localStorage.setItem('token', response.data.token);

  return response.data.user;
}
```

**Ahora:**
```typescript
async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });

  // ✅ NO necesitas guardar nada en localStorage
  // La cookie se guarda automáticamente

  return response.data.user;
}
```

---

### **3. Register**

**Antes:**
```typescript
async function register(data: RegisterDto) {
  const response = await api.post('/auth/register', data);

  // Guardar token manualmente
  localStorage.setItem('token', response.data.token);

  return response.data.user;
}
```

**Ahora:**
```typescript
async function register(data: RegisterDto) {
  const response = await api.post('/auth/register', data);

  // ✅ NO necesitas guardar nada
  // La cookie se guarda automáticamente

  return response.data.user;
}
```

---

### **4. Logout**

**Antes:**
```typescript
function logout() {
  localStorage.removeItem('token');
  // Redirect to login
}
```

**Ahora:**
```typescript
async function logout() {
  await api.post('/auth/logout');

  // ✅ La cookie se elimina automáticamente en el backend
  // Redirect to login
}
```

---

### **5. Requests autenticados**

**Antes:**
```typescript
// Necesitabas agregar el header manualmente
const token = localStorage.getItem('token');

await api.get('/customers/me', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

**Ahora:**
```typescript
// ✅ NO necesitas agregar headers
// La cookie se envía automáticamente

await api.get('/customers/me');
```

---

### **6. Verificar si está autenticado**

**Antes:**
```typescript
function isAuthenticated() {
  return !!localStorage.getItem('token');
}
```

**Ahora:**
```typescript
// Opción 1: Intentar obtener el perfil
async function isAuthenticated() {
  try {
    await api.get('/auth/profile');
    return true;
  } catch {
    return false;
  }
}

// Opción 2: Mantener estado en React/Context
const [user, setUser] = useState(null);

async function checkAuth() {
  try {
    const response = await api.get('/auth/profile');
    setUser(response.data);
  } catch {
    setUser(null);
  }
}
```

---

## 🛡️ Protección de Rutas

### **React Router ejemplo:**

```tsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // Hook que verifica autenticación

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Uso:
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🔐 Context de Autenticación Recomendado

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
  }

  async function register(data: any) {
    const response = await api.post('/auth/register', data);
    setUser(response.data.user);
  }

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Uso:**
```tsx
// App.tsx
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ... */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// En cualquier componente:
function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {user.email}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

---

## ⚠️ Configuración de CORS

### **Backend (.env):**
```bash
# Desarrollo
CORS_ORIGIN=http://localhost:5173

# Producción
CORS_ORIGIN=https://tuapp.com
```

### **Frontend debe estar en el mismo dominio o configurar CORS correctamente:**

**Desarrollo:**
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- ✅ CORS configurado para aceptar: `http://localhost:5173`

**Producción:**
- Backend: `https://api.tuapp.com`
- Frontend: `https://tuapp.com`
- ✅ CORS configurado para aceptar: `https://tuapp.com`

---

## 🧪 Testing

### **Login con curl:**

```bash
# Login (recibe cookie)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "123456"}' \
  -c cookies.txt \
  -v

# Ver las cookies guardadas
cat cookies.txt

# Usar la cookie en el siguiente request
curl http://localhost:3000/api/customers/me \
  -b cookies.txt

# Logout (elimina cookie)
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

### **Login con Postman/Thunder Client:**

1. Hacer POST a `/auth/login`
2. En la respuesta, ir a "Cookies"
3. Ver que se guardó la cookie `token`
4. Los siguientes requests enviarán la cookie automáticamente

---

## ✅ Checklist de Migración Frontend

- [ ] Actualizar configuración de Axios:
  ```typescript
  axios.create({
    baseURL: '...',
    withCredentials: true, // ← Agregar esto
  });
  ```

- [ ] Eliminar código de localStorage:
  ```typescript
  // ❌ Eliminar:
  localStorage.setItem('token', ...)
  localStorage.getItem('token')
  localStorage.removeItem('token')
  ```

- [ ] Eliminar headers Authorization:
  ```typescript
  // ❌ Eliminar:
  headers: {
    Authorization: `Bearer ${token}`
  }
  ```

- [ ] Actualizar login/register:
  ```typescript
  // ✅ Ya no retorna token
  const response = await api.post('/auth/login', ...)
  const user = response.data.user; // No hay .token
  ```

- [ ] Implementar logout:
  ```typescript
  // ✅ Llamar al endpoint
  await api.post('/auth/logout');
  ```

- [ ] Crear AuthContext/Provider
- [ ] Implementar verificación de autenticación con `/auth/profile`
- [ ] Proteger rutas con ProtectedRoute component

---

## 🔄 Compatibilidad Temporal

El backend **aún acepta** tokens en el header `Authorization: Bearer` para compatibilidad temporal.

Esto significa que:
- ✅ Requests con cookie funcionan
- ✅ Requests con header Authorization funcionan
- ⏳ Eventualmente se eliminará el soporte para Authorization header

---

## 🐛 Troubleshooting

### **Cookies no se guardan:**

**Problema:** Las cookies no aparecen en el navegador.

**Solución:**
1. Verificar que `withCredentials: true` esté en la config de Axios
2. Verificar que CORS_ORIGIN coincida con el origen del frontend
3. En desarrollo, NO uses `localhost` y `127.0.0.1` mezclados (usa solo uno)

---

### **CORS error:**

**Problema:** `Access-Control-Allow-Origin` error

**Solución:**
1. Configurar `.env` con `CORS_ORIGIN=http://localhost:5173` (o tu puerto)
2. Verificar que el backend tenga `credentials: true` en CORS
3. El frontend debe usar `withCredentials: true`

---

### **401 Unauthorized:**

**Problema:** Requests autenticados fallan con 401

**Solución:**
1. Verificar que la cookie se esté enviando (Network tab → Headers → Cookie)
2. Verificar que `withCredentials: true` esté configurado
3. Limpiar cookies del navegador y volver a hacer login

---

## 📚 Recursos

- [OWASP HttpOnly Cookies](https://owasp.org/www-community/HttpOnly)
- [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [Axios withCredentials](https://axios-http.com/docs/req_config)

---

**¿Dudas?** El backend está 100% configurado. Solo falta que el frontend agregue `withCredentials: true` en Axios y elimine el manejo manual de tokens.
