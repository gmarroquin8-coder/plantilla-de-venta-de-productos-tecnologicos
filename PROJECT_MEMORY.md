# Memoria del proyecto Voltio

Última revisión: 2026-11-20

## Identidad y versión

- Proyecto: Voltio, tienda de demostración de productos tecnológicos.
- Repositorio: `gmarroquin8-coder/plantilla-de-venta-de-productos-tecnologicos`.
- Rama observada: `main`.
- Versión de referencia: `1.0.0`, tag Git `v1.0.0`.

## Arquitectura actual

- Interfaz estática en HTML, CSS y JavaScript; el carrito se guarda en el navegador.
- API Node.js/Express (`api/server.js`) para autenticación, catálogo y pedidos.
- PostgreSQL 16 en el servicio Docker Compose `db`; el esquema `users` se crea
  desde `database/init.sql`. La API aplica el mismo esquema aditivo al arrancar,
  por lo que instalaciones existentes reciben las tablas nuevas sin borrar el
  volumen.
- Las categorías y los 150 productos iniciales se definen en `catalog.json`;
  el inventario inicial de 20 unidades por producto es ilustrativo.
- Los pedidos pertenecen a la cuenta autenticada y guardan snapshots de
  productos/precios, nombre, teléfono y dirección. El estado inicial es
  `pending`; el alta del pedido y el descuento de inventario se confirman juntos
  en una transacción.
- Las cuentas tienen rol `customer` por defecto. El primer admin se crea o
  promueve explícitamente con `BOOTSTRAP_ADMIN_EMAIL` y
  `BOOTSTRAP_ADMIN_PASSWORD`; retirar ambas variables tras el bootstrap no quita
  su rol. El bootstrap no reemplaza la contraseña de una cuenta existente.
- El panel `/admin.html` y la API `/api/admin/products` permiten CRUD solo a
  admins. La baja es lógica (`is_active = false`) para conservar referencias e
  historial; solo se pueden asignar categorías existentes.
- No hay integración de pagos ni inventario real.
- Nginx sirve el sitio en el puerto 80 y protege las rutas de la tienda con
  autenticación contra la API.
- El registro y el login usan contraseñas con hash bcrypt y una cookie de sesión
  firmada, `HttpOnly`, `SameSite=Lax`; las escrituras verifican el origen.
- La configuración local se toma de `.env`; no leer ni copiar sus secretos.

## Límites conocidos

- Es una demostración: los pedidos quedan pendientes, no procesa pagos y el
  stock no es disponibilidad comercial real.
- No se crea una cuenta admin predeterminada. Configurar el bootstrap inicial
  en `.env`; nunca añadir credenciales reales al repositorio ni exponer el
  servicio fuera del entorno local antes de asegurar HTTPS y secretos.
- Los pedidos almacenan datos personales de entrega; no usar información real
  ni publicar la aplicación sin política de privacidad, retención y transporte
  HTTPS.
- Antes de publicar el sitio, se debe habilitar HTTPS, configurar
  `COOKIE_SECURE=true` y gestionar los secretos fuera de `.env`.
- El trabajo previo confirmó que PostgreSQL 19 local escuchaba en
  `localhost:5432`, pero no se creó allí una base ni un rol para Voltio. La
  aplicación sigue configurada para usar su base PostgreSQL de Docker; no asumir
  que se migró a la instalación local.

## Documentación

- Historial de versiones: [CHANGELOG.md](./CHANGELOG.md).
- Instrucciones de ejecución y alcance: [README.md](./README.md).
- Pruebas de API aisladas: `docker compose --profile test run --build --rm api-test`.
