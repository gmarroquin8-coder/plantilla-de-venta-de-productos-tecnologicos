# Changelog

Los cambios importantes de Voltio se documentan en este archivo.

## Sin publicar

### Añadido

- Catálogo de 150 productos y 10 categorías persistido en PostgreSQL.
- Inventario ilustrativo que se valida y descuenta junto con cada pedido.
- Checkout autenticado con pedidos pendientes, datos de entrega e historial; no procesa pagos.
- Pruebas de integración de autenticación, catálogo e inventario en un esquema aislado.
- Roles de cliente y administrador, con bootstrap inicial mediante variables de entorno.
- Panel privado para crear, editar y archivar productos; las rutas administrativas verifican el rol en la API.

### Seguridad

- Validación de origen en operaciones de escritura y configuración de cookie segura por entorno.
- Límites de frecuencia para la creación de pedidos.
- Solo administradores autenticados pueden abrir el panel o modificar el catálogo; los registros públicos siempre crean clientes.

## [1.0.0] - 2026-11-20

Primera versión del proyecto, identificada con el tag `v1.0.0`.

### Añadido

- Tienda de demostración con catálogo, carrito en `localStorage` e interfaz adaptable.
- Registro, inicio y cierre de sesión conectados a PostgreSQL.
- Hash de contraseñas con bcrypt y sesiones firmadas en cookies `HttpOnly`.
- Limitación de intentos en los endpoints de autenticación.
- Protección de la tienda: el acceso anónimo se redirige al login.
- Despliegue local con Docker Compose, Nginx, API Node.js y PostgreSQL.
- Encabezados de seguridad HTTP servidos por Nginx.

### Notas

- El catálogo y los precios son ilustrativos; no se crean órdenes ni se procesan pagos.
- La configuración predeterminada es para desarrollo local. Antes de publicar,
  configura HTTPS, `COOKIE_SECURE=true` y secretos seguros fuera de `.env`.
