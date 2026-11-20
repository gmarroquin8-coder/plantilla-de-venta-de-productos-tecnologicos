const express = require("express");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

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

const app = express();
const cookieName = "voltio_session";
const secureCookie = process.env.COOKIE_SECURE === "true";

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Demasiados intentos. Espera unos minutos y vuelve a intentar." });
  }
});

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

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
  return { id: user.id, name: user.name, email: user.email };
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
    "SELECT id, name, email FROM users WHERE id = $1",
    [claims.sub]
  );
  return rows[0] || null;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", authLimiter, asyncHandler(async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!name || name.length > 100 || !isValidEmail(email) || !validPassword(password)) {
    return res.status(400).json({
      error: "Ingresa un nombre, correo válido y una contraseña de 8 a 72 bytes."
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
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

app.post("/api/auth/login", authLimiter, asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!isValidEmail(email) || typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "Ingresa un correo y una contraseña válidos." });
  }

  const { rows } = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email]
  );
  const user = rows[0];
  const passwordMatches = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;

  if (!passwordMatches) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  setSessionCookie(res, user, req.body.remember === true);
  return res.json({ user: publicUser(user) });
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

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(cookieName, { httpOnly: true, secure: secureCookie, sameSite: "lax", path: "/" });
  res.status(204).end();
});

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

const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => {
  console.log(`Voltio authentication API listening on port ${port}.`);
});
