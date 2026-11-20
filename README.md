# Voltio

Tienda de demostración con una interfaz HTML/CSS/JavaScript, una API de
autenticación y PostgreSQL.

## Ejecutar con Docker

1. Copia `.env.example` a `.env` y reemplaza los valores de ejemplo por
   contraseñas y un secreto aleatorios.
2. Desde esta carpeta, inicia Docker Desktop y ejecuta:

```sh
docker compose up -d --build
```

Abre `http://localhost/` para la tienda o `http://localhost/login.html` para
iniciar sesión o crear una cuenta. La tienda redirige al acceso hasta que
inicies sesión. Para detener los servicios, ejecuta
`docker compose down`. Los usuarios se conservan en el volumen de PostgreSQL;
`docker compose down -v` también elimina ese volumen y las cuentas guardadas.

Al iniciar, la API aplica de forma idempotente el esquema aditivo y carga el
catálogo inicial desde `catalog.json`; no elimina las cuentas existentes ni
requiere borrar el volumen. Para actualizar una instalación existente, ejecuta
`docker compose up -d --build api voltio`.

## Administración de productos

No existe una cuenta admin predeterminada. Para crear el primer administrador,
agrega temporalmente estas variables a tu `.env`, usando un correo dedicado y
una contraseña nueva y segura:

```dotenv
BOOTSTRAP_ADMIN_EMAIL=admin@tu-dominio.example
BOOTSTRAP_ADMIN_PASSWORD=elige-una-contraseña-segura
```

Inicia o actualiza la aplicación con `docker compose up -d --build api voltio`.
En el primer arranque, la API crea esa cuenta como admin; si el correo ya
pertenece a una cuenta, le asigna el rol admin sin cambiar su contraseña.
Después de confirmar que puedes iniciar sesión como esa cuenta, elimina ambas
variables de `.env` y recrea la API con `docker compose up -d --force-recreate api`.
La cuenta y su rol se conservan en PostgreSQL.

Con esa cuenta inicia sesión y abre `http://localhost/admin.html` para crear,
editar y archivar productos. Las rutas de administración también verifican el
rol en la API, por lo que ocultar o adivinar la URL no concede permisos. Los
registros públicos siempre crean cuentas de cliente; no aceptan autoasignación
del rol admin. Archivar un producto lo oculta del catálogo, pero conserva el
historial de pedidos. El catálogo solo admite las categorías existentes.

Para mover el proyecto a otra computadora, copia esta carpeta y asegúrate de
tener Docker Desktop (Windows/macOS) o Docker Engine y Compose (Linux).

## Version y memoria del proyecto

La versión inicial está identificada con el tag `v1.0.0`. Consulta
[CHANGELOG.md](./CHANGELOG.md) para el historial de cambios y
[PROJECT_MEMORY.md](./PROJECT_MEMORY.md) para el contexto y el estado pendiente
del proyecto.

## Alcance de la demostración

El catálogo y los precios son ilustrativos. PostgreSQL conserva las categorías,
los productos y un inventario de muestra de 20 unidades por producto; el carrito
se conserva en el navegador mediante `localStorage`. El checkout crea órdenes
pendientes, valida y descuenta ese inventario en una transacción, y guarda el
nombre, teléfono y dirección de entrega. **No se procesan pagos y el inventario
no representa disponibilidad real.** No uses datos personales reales ni
presentes esta demostración como una tienda lista para operar.

El registro guarda el nombre, el correo y un hash bcrypt de la contraseña en
PostgreSQL. El inicio de sesión usa una cookie HttpOnly firmada; las operaciones
de escritura requieren el mismo origen, y la API nunca devuelve la contraseña
ni su hash.

Para ejecutar las pruebas de integración de la API:

```sh
docker compose --profile test run --build --rm api-test
```

La suite crea un esquema PostgreSQL temporal y aislado, y lo elimina al terminar;
no usa ni borra las tablas de la aplicación.

Nginx sirve los archivos estáticos y reenvía `/api/` al servicio de
autenticación. La base de datos no publica un puerto en el host. Esta
configuración está pensada para desarrollo local: antes de publicar el sitio,
usa HTTPS, configura `COOKIE_SECURE=true` en `.env` y administra los secretos
fuera de ese archivo. Las órdenes guardan datos de entrega y requieren una
política de privacidad y retención antes de cualquier uso real.
