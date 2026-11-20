const fs = require("node:fs/promises");
const path = require("node:path");
const seedCatalog = require("../catalog.json");

async function initializeDatabase(pool) {
  const schema = await fs.readFile(path.join(__dirname, "..", "database", "init.sql"), "utf8");
  await pool.query(schema);

  await pool.query(
    `INSERT INTO categories (id, name, emoji, specifications)
     SELECT id, name, emoji, specifications
     FROM jsonb_to_recordset($1::jsonb) AS category(
       id text,
       name text,
       emoji text,
       specifications jsonb
     )
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(seedCatalog.categories.map((category) => ({
      id: category.id,
      name: category.name,
      emoji: category.emoji,
      specifications: seedCatalog.specificationProfiles[category.id]
    })))]
  );

  const products = seedCatalog.categories.flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      categoryId: category.id
    }))
  );

  await pool.query(
    `INSERT INTO products (
       id, category_id, name, emoji, description, price, badge, rating, reviews, stock
     )
     SELECT id, "categoryId", name, emoji, description, price, badge, rating, reviews, stock
     FROM jsonb_to_recordset($1::jsonb) AS product(
       id text,
       "categoryId" text,
       name text,
       emoji text,
       description text,
       price integer,
       badge text,
       rating numeric,
       reviews integer,
       stock integer
     )
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(products)]
  );
}

module.exports = { initializeDatabase };
