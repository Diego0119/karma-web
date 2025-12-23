# Karma - Plataforma de Fidelización

Aplicación web completa para Karma, una plataforma de fidelización de clientes tipo Ruklo/WelcomeBack. Incluye landing page moderna y paneles de administración tanto para negocios como para clientes.

## Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool y dev server
- **React Router v6** - Navegación y rutas
- **Axios** - Cliente HTTP para API
- **Tailwind CSS** - Estilos y diseño
- **Lucide React** - Iconos

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Edita `.env` y configura la URL de tu backend:
```
VITE_API_URL=http://localhost:3000/api
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── dashboard/      # Componentes del dashboard
│   ├── Hero.jsx
│   ├── Features.jsx
│   ├── Pricing.jsx
│   ├── CTA.jsx
│   └── Footer.jsx
├── context/            # Contextos de React
│   └── AuthContext.jsx # Contexto de autenticación
├── pages/              # Páginas de la aplicación
│   ├── auth/          # Login y Register
│   ├── business/      # Páginas para negocios
│   ├── customer/      # Páginas para clientes
│   └── LandingPage.jsx
├── services/          # Servicios (API client)
│   └── api.js
└── App.jsx            # Componente principal con rutas
```

## Características Principales

### Landing Page
- Diseño moderno con gradientes
- Responsive design
- Animaciones suaves
- Colores de startup modernos
- Secciones:
  - Hero llamativo
  - Características del producto
  - Planes de servicio
  - Call to Action
  - Footer completo

### Sistema de Autenticación
- Login y registro
- Autenticación con JWT
- Protección de rutas
- Soporte para 2 roles: BUSINESS y CUSTOMER
- Persistencia de sesión

### Panel de Administración para NEGOCIOS
- Dashboard principal con estadísticas
- Gestión del perfil del negocio
- Creación de programas de fidelización (Sellos y Puntos)
- Gestión de recompensas
- Creación de promociones
- Visualización de clientes
- Analytics (en desarrollo)

### Panel para CLIENTES
- Dashboard personal
- Vista de tarjetas de sellos
- Balance de puntos
- Recompensas canjeadas
- Exploración de negocios
- Vista de promociones activas

## Integración con API

La aplicación está completamente integrada con la API de Karma. Ver `API_DOC.MD` para la documentación completa de los endpoints.

### Endpoints principales usados:
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro
- `/auth/profile` - Perfil del usuario
- `/business` - Gestión de negocios
- `/customers` - Gestión de clientes
- `/loyalty/programs` - Programas de fidelización
- `/loyalty/stamp-cards` - Tarjetas de sellos
- `/loyalty/points` - Sistema de puntos
- `/rewards` - Recompensas
- `/promotions` - Promociones

## Rutas de la Aplicación

### Públicas
- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal (varía según rol)
- `/dashboard/business` - Gestión del negocio
- `/dashboard/programs` - Programas de fidelización
- `/dashboard/rewards` - Recompensas
- `/dashboard/promotions` - Promociones
- `/dashboard/customers` - Clientes
- `/dashboard/analytics` - Analytics
- `/dashboard/profile` - Perfil del cliente
- `/dashboard/cards` - Tarjetas del cliente
- `/dashboard/points` - Puntos del cliente
- `/dashboard/businesses` - Explorar negocios

## Variables de Entorno

```bash
VITE_API_URL=http://localhost:3000/api  # URL del backend
```

## Flujo de Autenticación

1. El usuario se registra o inicia sesión
2. Se recibe un JWT del backend
3. El token se guarda en localStorage
4. Todas las peticiones incluyen el token en el header
5. Si el token expira o es inválido, se redirige al login

## Diseño y UX

- Colores principales: Azul (#0ea5e9) y Magenta (#d946ef)
- Gradientes modernos
- Animaciones suaves con Tailwind
- Componentes con estados hover
- Diseño responsive mobile-first
- Feedback visual en todas las acciones

## Desarrollo

Para agregar nuevas páginas:

1. Crea el componente en `src/pages/`
2. Agrégalo a las rutas en `src/App.jsx`
3. Si es protegida, envuélvela en `<ProtectedRoute>`

## Notas

- Las páginas marcadas como "En desarrollo" muestran un placeholder
- El sistema detecta automáticamente el rol del usuario y muestra el dashboard correspondiente
- Todos los formularios tienen validación básica
- Los errores de API se manejan automáticamente

## Próximas Funcionalidades

- [ ] Implementación completa de gestión de programas
- [ ] Sistema de QR para escaneo de sellos
- [ ] Notificaciones push
- [ ] Dashboard de analytics con gráficos
- [ ] Sistema de mensajería entre negocios y clientes
- [ ] App móvil nativa

## Licencia

Ver archivo LICENSE
