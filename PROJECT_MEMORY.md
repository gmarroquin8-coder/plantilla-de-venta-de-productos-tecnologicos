# Memoria del proyecto Voltio

Última revisión: 2026-11-20

## Identidad y versión

- Proyecto: Voltio, tienda de demostración de productos tecnológicos.
- Repositorio: `gmarroquin8-coder/plantilla-de-venta-de-productos-tecnologicos`.
- Rama observada: `main`.
- Versión de referencia: `1.0.0`, tag Git `v1.0.0`.

## Arquitectura actual

- Interfaz estática en HTML, CSS y JavaScript; el carrito se guarda en el navegador.
- API de autenticación en Node.js/Express (`api/server.js`).
- PostgreSQL 16 en el servicio Docker Compose `db`; el esquema `users` se crea
  desde `database/init.sql`.
- Nginx sirve el sitio en el puerto 80 y protege las rutas de la tienda con
  autenticación contra la API.
- El registro y el login usan contraseñas con hash bcrypt y una cookie de sesión
  firmada, `HttpOnly`.
- La configuración local se toma de `.env`; no leer ni copiar sus secretos.

## Límites conocidos

- Es una demostración: no procesa pagos ni crea órdenes.
- Antes de publicar el sitio, se debe habilitar HTTPS, configurar
  `COOKIE_SECURE=true` y gestionar los secretos fuera de `.env`.
- El trabajo previo confirmó que PostgreSQL 19 local escuchaba en
  `localhost:5432`, pero no se creó allí una base ni un rol para Voltio. La
  aplicación sigue configurada para usar su base PostgreSQL de Docker; no asumir
  que se migró a la instalación local.

## Documentación

- Historial de versiones: [CHANGELOG.md](./CHANGELOG.md).
- Instrucciones de ejecución y alcance: [README.md](./README.md).
