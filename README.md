# liw-exchange

Plataforma de intercambio de cartas coleccionables.

## Requisitos
- Docker y Docker Compose
- Node.js >= 18 (solo si quieres correr el frontend fuera de Docker)

## Instalación y ejecución rápida

### 1. Clonar el repositorio
```sh
git clone <repo-url>
cd liw-exchange
```

### 2. Levantar todo con Docker Compose
```sh
docker compose up --build
```
Esto levanta el backend (Django + DRF + PostgreSQL) y el frontend (React).

### 3. Acceso rápido
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend (API): [http://localhost:8000](http://localhost:8000)
- Admin Django: [http://localhost:8000/admin](http://localhost:8000/admin)

### 4. Usuario admin por defecto
Si corres las migraciones, se crea automáticamente:
- Usuario: `admin`
- Contraseña: `admin1234`

## Comandos útiles

### Backend
- Ejecutar tests:
  ```sh
  docker compose exec backend python manage.py test
  ```
- Crear superusuario manual:
  ```sh
  docker compose exec backend python manage.py createsuperuser
  ```
- Aplicar migraciones:
  ```sh
  docker compose exec backend python manage.py migrate
  ```

### Frontend
- Instalar dependencias (si corres fuera de Docker):
  ```sh
  cd frontend
  npm install
  ```
- Correr en modo desarrollo:
  ```sh
  npm start
  ```

## Funcionalidades principales

- **Registro y login de usuarios**: Crea tu cuenta, inicia sesión y gestiona tu perfil (nombre, apellido, email).
- **Gestión de cartas**: Crea, edita y elimina tus cartas coleccionables. Cada carta tiene nombre, descripción, imagen, creador y dueño actual.
- **Ofrecer cartas para intercambio**: Marca tus cartas como disponibles para intercambio.
- **Mercado de cartas**: Visualiza todas las cartas disponibles para intercambio (excepto las tuyas) y ofrece intercambios.
- **Propuestas de intercambio**: Propón intercambios a otros usuarios, acepta o rechaza propuestas recibidas, y visualiza el historial de intercambios completados.
- **Panel de administración**: Los usuarios admin pueden ver todas las cartas, verificar cartas pendientes y borrar cualquier carta desde una interfaz especial.
- **Verificación de cartas**: Solo las cartas verificadas por un admin pueden ser ofrecidas en el mercado.
- **Historial y transparencia**: Cada carta mantiene su creador original y dueño actual, y puedes ver el estado de todas tus propuestas.

## Ejemplos de uso de la API

### Autenticación y perfil
- **Obtener perfil actual:**
  ```http
  GET /users/me/
  Authorization: Bearer <token>
  ```
- **Actualizar nombre y apellido:**
  ```http
  PATCH /users/me/
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "first_name": "Juan",
    "last_name": "Pérez"
  }
  ```

### Cartas
- **Listar mis cartas:**
  ```http
  GET /exchange/cards/
  Authorization: Bearer <token>
  ```
- **Crear carta:**
  ```http
  POST /exchange/cards/
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "name": "Carta Fuego",
    "description": "Una carta poderosa",
    "image_url": "https://..."
  }
  ```
- **Marcar carta para intercambio:**
  ```http
  PATCH /exchange/cards/<id>/
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "forTrade": true
  }
  ```

### Mercado e intercambios
- **Ver cartas disponibles para intercambio:**
  ```http
  GET /exchange/offers/
  Authorization: Bearer <token>
  ```
- **Proponer intercambio:**
  ```http
  POST /exchange/proposals/
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "offered_card_id": 1,
    "requested_card_id": 2
  }
  ```
- **Ver mis propuestas y recibidas:**
  ```http
  GET /exchange/proposals/
  Authorization: Bearer <token>
  ```
- **Aceptar/rechazar propuesta:**
  ```http
  PATCH /exchange/proposals/<id>/
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "status": "accepted"
  }
  ```

### Administración (solo admin)
- **Ver todas las cartas:**
  ```http
  GET /exchange/cards/
  Authorization: Bearer <token-admin>
  ```
- **Verificar carta:**
  ```http
  PATCH /exchange/cards/<id>/
  Content-Type: application/json
  Authorization: Bearer <token-admin>
  {
    "verified": true
  }
  ```
- **Borrar carta:**
  ```http
  DELETE /exchange/cards/<id>/
  Authorization: Bearer <token-admin>
  ```

## Estructura del proyecto
- `backend/`: Django + DRF + PostgreSQL
- `frontend/`: React + TailwindCSS

## Notas
- Si tienes problemas de migraciones en producción, revisa el orden de dependencias en las migraciones y usa `--fake-initial` si es necesario.
- El usuario admin por defecto se crea automáticamente con una migración especial.

---

¡Contribuciones y sugerencias son bienvenidas!
