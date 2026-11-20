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

Para mover el proyecto a otra computadora, copia esta carpeta y asegúrate de
tener Docker Desktop (Windows/macOS) o Docker Engine y Compose (Linux).

## Alcance de la demostración

El catálogo y los precios son ilustrativos. El carrito se conserva en el
navegador mediante `localStorage`; no se crea una orden ni se procesa un pago.
El registro guarda el nombre, el correo y un hash bcrypt de la contraseña en
PostgreSQL. El inicio de sesión usa una cookie HttpOnly firmada; la API nunca
devuelve la contraseña ni su hash.

Nginx sirve los archivos estáticos y reenvía `/api/` al servicio de
autenticación. La base de datos no publica un puerto en el host. Esta
configuración está pensada para desarrollo local: antes de publicar el sitio,
usa HTTPS, configura `COOKIE_SECURE=true` y administra los secretos fuera del
archivo `.env`.
