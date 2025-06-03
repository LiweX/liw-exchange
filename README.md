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
- Registro y login de usuarios
- Crear, editar y eliminar cartas
- Ofrecer cartas para intercambio
- Proponer, aceptar y rechazar intercambios
- Panel de administración para verificar/borrar cartas (solo admin)
- Edición de nombre y apellido en el perfil

## Estructura del proyecto
- `backend/`: Django + DRF + PostgreSQL
- `frontend/`: React + TailwindCSS

## Notas
- Si tienes problemas de migraciones en producción, revisa el orden de dependencias en las migraciones y usa `--fake-initial` si es necesario.
- El usuario admin por defecto se crea automáticamente con una migración especial.

---

¡Contribuciones y sugerencias son bienvenidas!
