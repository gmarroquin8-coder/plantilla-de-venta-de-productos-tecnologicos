const express = require("express");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const { initializeDatabase } = require("./database");

const cookieName = "voltio_session";

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password) {
  return typeof password === "string"
    && password.length >= 8
    && Buffer.byteLength(password, "utf8") <= 72;
}

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function requireSameOrigin(req, res, next) {
  const origin = req.get("origin");
  const forwardedProtocol = req.get("x-forwarded-proto");
  const protocol = forwardedProtocol ? forwardedProtocol.split(",")[0].trim() : req.protocol;

  try {
    if (!origin || new URL(origin).origin !== `${protocol}://${req.get("host")}`) {
      return res.status(403).json({ error: "La solicitud debe originarse en este sitio." });
    }
  } catch {
    return res.status(403).json({ error: "La solicitud debe originarse en este sitio." });
  }
  return next();
}

function validOrderItems(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;

  const items = new Map();
  for (const item of value) {
    if (
      !item
      || typeof item.productId !== "string"
      || item.productId.length > 100
      || !Number.isInteger(item.quantity)
      || item.quantity < 1
      || item.quantity > 99
    ) return null;

    const quantity = (items.get(item.productId) || 0) + item.quantity;
    if (quantity > 99) return null;
    items.set(item.productId, quantity);
  }

  return [...items].map(([productId, quantity]) => ({ productId, quantity }));
}

function validProductInput(value, { includeId }) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const product = {
    id: typeof value.id === "string" ? value.id.trim() : "",
    categoryId: typeof value.categoryId === "string" ? value.categoryId : "",
    name: typeof value.name === "string" ? value.name.trim() : "",
    emoji: typeof value.emoji === "string" ? value.emoji.trim() : "",
    description: typeof value.description === "string" ? value.description.trim() : "",
    price: value.price,
    badge: typeof value.badge === "string" ? value.badge.trim() : "",
    rating: value.rating,
    reviews: value.reviews,
    stock: value.stock
  };

  if (
    (includeId && (
      product.id.length > 100
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id)
    ))
    || !/^[a-z0-9-]+$/.test(product.categoryId)
    || !product.name || product.name.length > 200
    || !product.emoji || product.emoji.length > 16
    || !product.description || product.description.length > 1000
    || !Number.isSafeInteger(product.price) || product.price < 0 || product.price > 100_000_000
    || product.badge.length > 100
    || !Number.isFinite(product.rating) || product.rating < 0 || product.rating > 5
    || Math.abs(product.rating * 10 - Math.round(product.rating * 10)) > 1e-8
    || !Number.isSafeInteger(product.reviews) || product.reviews < 0 || product.reviews > 1_000_000
    || !Number.isSafeInteger(product.stock) || product.stock < 0 || product.stock > 1_000_000
  ) return null;

  return product;
}

function createApp({ pool, jwtSecret, secureCookie = false, authLimit = 10, orderLimit = 5, adminWriteLimit = 30 }) {
  if (!pool || typeof pool.query !== "function" || typeof pool.connect !== "function") {
    throw new TypeError("A PostgreSQL pool is required.");
  }
  if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes.");
  }

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: authLimit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ error: "Demasiados intentos. Espera unos minutos y vuelve a intentar." });
    }
  });
  const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: orderLimit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ error: "Demasiados pedidos. Espera unos minutos y vuelve a intentar." });
    }
  });
  const adminWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: adminWriteLimit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ error: "Demasiados cambios en el catálogo. Inténtalo más tarde." });
    }
  });

  function setSessionCookie(res, user, remember) {
    const expiresIn = remember ? "7d" : "8h";
    const token = jwt.sign({ sub: String(user.id) }, jwtSecret, { expiresIn });
    const options = {
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
      path: "/"
    };

    if (remember) options.maxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie(cookieName, token, options);
  }

  function publicUser(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async function findSessionUser(token) {
    if (!token) return null;

    let claims;
    try {
      claims = jwt.verify(token, jwtSecret);
    } catch {
      return null;
    }

    const { rows } = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [claims.sub]
    );
    return rows[0] || null;
  }

  async function requireUser(req, res) {
    const user = await findSessionUser(req.cookies[cookieName]);
    if (!user) {
      res.status(401).json({ error: "Inicia sesión para continuar." });
      return null;
    }
    return user;
  }

  async function requireAdmin(req, res) {
    const user = await requireUser(req, res);
    if (!user) return null;
    if (user.role !== "admin") {
      res.status(403).json({ error: "Esta acción está disponible solo para administradores." });
      return null;
    }
    return user;
  }

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/catalog", asyncHandler(async (_req, res) => {
    const [{ rows: categoryRows }, { rows: productRows }] = await Promise.all([
      pool.query("SELECT id, name, emoji, specifications FROM categories ORDER BY name"),
      pool.query(
        `SELECT id, category_id, name, emoji, description, price, badge,
                rating::float AS rating, reviews, stock
         FROM products
         WHERE is_active = TRUE
         ORDER BY category_id, name`
      )
    ]);

    const categories = categoryRows.map((category) => ({
      ...category,
      products: productRows
        .filter((product) => product.category_id === category.id)
        .map((product) => ({
          id: product.id,
          name: product.name,
          emoji: product.emoji,
          description: product.description,
          price: product.price,
          badge: product.badge,
          rating: product.rating.toFixed(1),
          reviews: product.reviews,
          stock: product.stock
        }))
    }));
    return res.json({ categories });
  }));

  app.get("/api/admin/check", asyncHandler(async (req, res) => {
    const user = await findSessionUser(req.cookies[cookieName]);
    if (!user) return res.status(401).end();
    if (user.role !== "admin") return res.status(403).end();
    return res.status(204).end();
  }));

  app.post("/api/auth/register", requireSameOrigin, authLimiter, asyncHandler(async (req, res) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = normalizeEmail(body.email);
    const password = body.password;

    if (!name || name.length > 100 || !isValidEmail(email) || !validPassword(password)) {
      return res.status(400).json({
        error: "Ingresa un nombre, correo válido y una contraseña de 8 a 72 bytes."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    try {
      const { rows } = await pool.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
        [name, email, passwordHash]
      );
      const user = rows[0];
      setSessionCookie(res, user, false);
      return res.status(201).json({ user: publicUser(user) });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
      }
      throw error;
    }
  }));

  app.post("/api/auth/login", requireSameOrigin, authLimiter, asyncHandler(async (req, res) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const email = normalizeEmail(body.email);
    const password = body.password;

    if (!isValidEmail(email) || typeof password !== "string" || password.length === 0) {
      return res.status(400).json({ error: "Ingresa un correo y una contraseña válidos." });
    }

    const { rows } = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );
    const user = rows[0];
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    setSessionCookie(res, user, body.remember === true);
    return res.json({ user: publicUser(user) });
  }));

  app.get("/api/admin/products", asyncHandler(async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;

    const { rows } = await pool.query(
      `SELECT id, category_id, name, emoji, description, price, badge,
              rating::float AS rating, reviews, stock, is_active
       FROM products
       ORDER BY category_id, name`
    );
    return res.json({ products: rows });
  }));

  app.post("/api/admin/products", requireSameOrigin, adminWriteLimiter, asyncHandler(async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;

    const product = validProductInput(req.body, { includeId: true });
    if (!product) {
      return res.status(400).json({ error: "Revisa los datos del producto e inténtalo de nuevo." });
    }

    const { rows: categoryRows } = await pool.query(
      "SELECT 1 FROM categories WHERE id = $1",
      [product.categoryId]
    );
    if (categoryRows.length === 0) {
      return res.status(400).json({ error: "Selecciona una categoría existente." });
    }

    try {
      const { rows: [createdProduct] } = await pool.query(
        `INSERT INTO products (
           id, category_id, name, emoji, description, price, badge, rating, reviews, stock
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, category_id, name, emoji, description, price, badge,
                   rating::float AS rating, reviews, stock, is_active`,
        [
          product.id,
          product.categoryId,
          product.name,
          product.emoji,
          product.description,
          product.price,
          product.badge,
          product.rating,
          product.reviews,
          product.stock
        ]
      );
      return res.status(201).json({ product: createdProduct });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Ya existe un producto con ese identificador." });
      }
      throw error;
    }
  }));

  app.put("/api/admin/products/:id", requireSameOrigin, adminWriteLimiter, asyncHandler(async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;

    const product = validProductInput(req.body, { includeId: false });
    if (!product || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(req.params.id)) {
      return res.status(400).json({ error: "Revisa los datos del producto e inténtalo de nuevo." });
    }

    const { rows: categoryRows } = await pool.query(
      "SELECT 1 FROM categories WHERE id = $1",
      [product.categoryId]
    );
    if (categoryRows.length === 0) {
      return res.status(400).json({ error: "Selecciona una categoría existente." });
    }

    const { rows: [updatedProduct] } = await pool.query(
      `UPDATE products
       SET category_id = $1, name = $2, emoji = $3, description = $4,
           price = $5, badge = $6, rating = $7, reviews = $8, stock = $9
       WHERE id = $10 AND is_active = TRUE
       RETURNING id, category_id, name, emoji, description, price, badge,
                 rating::float AS rating, reviews, stock, is_active`,
      [
        product.categoryId,
        product.name,
        product.emoji,
        product.description,
        product.price,
        product.badge,
        product.rating,
        product.reviews,
        product.stock,
        req.params.id
      ]
    );
    if (!updatedProduct) return res.status(404).json({ error: "No se encontró el producto." });
    return res.json({ product: updatedProduct });
  }));

  app.delete("/api/admin/products/:id", requireSameOrigin, adminWriteLimiter, asyncHandler(async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;

    const { rowCount } = await pool.query(
      "UPDATE products SET is_active = FALSE WHERE id = $1 AND is_active = TRUE",
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: "No se encontró el producto." });
    return res.status(204).end();
  }));

  app.get("/api/auth/check", asyncHandler(async (req, res) => {
    const user = await findSessionUser(req.cookies[cookieName]);
    if (!user) return res.status(401).end();
    return res.status(204).end();
  }));

  app.get("/api/auth/me", asyncHandler(async (req, res) => {
    const user = await findSessionUser(req.cookies[cookieName]);
    if (!user) {
      res.clearCookie(cookieName, { httpOnly: true, secure: secureCookie, sameSite: "lax", path: "/" });
      return res.status(401).json({ error: "No hay una sesión activa." });
    }
    return res.json({ user: publicUser(user) });
  }));

  app.post("/api/auth/logout", requireSameOrigin, (_req, res) => {
    res.clearCookie(cookieName, { httpOnly: true, secure: secureCookie, sameSite: "lax", path: "/" });
    res.status(204).end();
  });

  app.get("/api/orders", asyncHandler(async (req, res) => {
    const user = await requireUser(req, res);
    if (!user) return;

    const { rows } = await pool.query(
      `SELECT o.id::text AS id, o.total_amount::text AS total, o.status,
              o.created_at, o.customer_name, o.phone, o.address,
              COALESCE(
                json_agg(json_build_object(
                  'productId', i.product_id,
                  'productName', i.product_name,
                  'unitPrice', i.unit_price,
                  'quantity', i.quantity
                ) ORDER BY i.product_name) FILTER (WHERE i.order_id IS NOT NULL),
                '[]'::json
              ) AS items
       FROM orders AS o
       LEFT JOIN order_items AS i ON i.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 20`,
      [user.id]
    );
    return res.json({
      orders: rows.map((order) => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        createdAt: order.created_at,
        name: order.customer_name,
        phone: order.phone,
        address: order.address,
        items: order.items.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice)
        }))
      }))
    });
  }));

  app.post("/api/orders", requireSameOrigin, orderLimiter, asyncHandler(async (req, res) => {
    const user = await requireUser(req, res);
    if (!user) return;

    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const items = validOrderItems(body.items);
    const digitCount = phone.replace(/\D/g, "").length;

    if (
      !name || name.length > 100
      || phone.length < 7 || phone.length > 30 || digitCount < 7
      || !/^[0-9+(). -]+$/.test(phone)
      || address.length < 10 || address.length > 300
      || !items
    ) {
      return res.status(400).json({
        error: "Revisa el nombre, teléfono, dirección y los artículos del pedido."
      });
    }

    const client = await pool.connect();
    let transactionStarted = false;
    try {
      await client.query("BEGIN");
      transactionStarted = true;
      const productIds = items.map((item) => item.productId);
      const { rows: productRows } = await client.query(
        `SELECT id, name, price, stock
         FROM products
         WHERE id = ANY($1::text[]) AND is_active = TRUE
         ORDER BY id
         FOR UPDATE`,
        [productIds]
      );

      if (productRows.length !== items.length) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(400).json({ error: "El catálogo cambió. Actualiza la página e inténtalo de nuevo." });
      }

      const products = new Map(productRows.map((product) => [product.id, product]));
      for (const item of items) {
        if (products.get(item.productId).stock < item.quantity) {
          await client.query("ROLLBACK");
          transactionStarted = false;
          return res.status(409).json({
            error: `No hay suficientes existencias de ${products.get(item.productId).name}.`
          });
        }
      }

      const total = items.reduce(
        (sum, item) => sum + products.get(item.productId).price * item.quantity,
        0
      );
      if (!Number.isSafeInteger(total)) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(400).json({ error: "El total del pedido está fuera del rango permitido." });
      }

      const { rows: [createdOrder] } = await client.query(
        `INSERT INTO orders (user_id, customer_name, customer_email, phone, address, total_amount)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id::text AS id, status, created_at`,
        [user.id, name, user.email, phone, address, total]
      );

      const orderItems = [];
      for (const item of items) {
        const product = products.get(item.productId);
        const remainingStock = product.stock - item.quantity;
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [createdOrder.id, product.id, product.name, product.price, item.quantity]
        );
        await client.query(
          "UPDATE products SET stock = $1 WHERE id = $2",
          [remainingStock, product.id]
        );
        orderItems.push({
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
          stock: remainingStock
        });
      }

      await client.query("COMMIT");
      transactionStarted = false;
      return res.status(201).json({
        order: {
          id: createdOrder.id,
          status: createdOrder.status,
          createdAt: createdOrder.created_at,
          total,
          name,
          phone,
          address,
          items: orderItems
        }
      });
    } catch (error) {
      if (transactionStarted) {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackError) {
          console.error("Could not roll back order transaction:", rollbackError);
        }
      }
      throw error;
    } finally {
      client.release();
    }
  }));

  app.use((error, _req, res, _next) => {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ error: "La solicitud contiene JSON inválido." });
    }
    if (error.type === "entity.too.large") {
      return res.status(413).json({ error: "La solicitud es demasiado grande." });
    }

    console.error("API request failed:", error);
    return res.status(500).json({ error: "Ocurrió un error interno. Inténtalo de nuevo." });
  });

  return app;
}

async function startServer() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes.");
  }

  const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  });
  pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error);
  });

  await initializeDatabase(pool);
  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (bootstrapEmail || bootstrapPassword) {
    await bootstrapAdmin(pool, bootstrapEmail, bootstrapPassword);
    console.log("Bootstrap administrator is configured.");
  } else {
    console.warn("No bootstrap administrator configured; product management is disabled.");
  }
  const app = createApp({
    pool,
    jwtSecret,
    secureCookie: process.env.COOKIE_SECURE === "true"
  });
  const port = Number(process.env.PORT || 3000);
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Voltio API listening on port ${port}.`);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      server.close(() => {
        pool.end().catch((error) => {
          console.error("Could not close PostgreSQL pool:", error);
          process.exitCode = 1;
        });
      });
    });
  }
}

async function bootstrapAdmin(pool, emailValue, password) {
  const email = normalizeEmail(emailValue);
  if (!emailValue && !password) return null;
  if (!isValidEmail(email) || !validPassword(password)) {
    throw new Error(
      "BOOTSTRAP_ADMIN_EMAIL must be valid and BOOTSTRAP_ADMIN_PASSWORD must contain 8 to 72 bytes."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows: [admin] } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Administrador Voltio', $1, $2, 'admin')
     ON CONFLICT (email) DO UPDATE SET role = 'admin'
     RETURNING id, name, email, role`,
    [email, passwordHash]
  );
  return admin;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Could not start Voltio API:", error);
    process.exitCode = 1;
  });
}

module.exports = { bootstrapAdmin, createApp, initializeDatabase };
