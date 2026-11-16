import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const path = process.env.DB_PATH || './data/starter-3.sqlite';
if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true });
export const db = new DatabaseSync(path);
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS pizzas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL CHECK (price >= 0),
    imageUrl TEXT
  );
  -- Point 3 : deux pizzas ne peuvent pas porter le même nom, majuscules ou non (NOCASE).
  CREATE UNIQUE INDEX IF NOT EXISTS pizzas_name_unique ON pizzas (name COLLATE NOCASE);
  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0)
  );
  -- Point 4 : table d'association du lien N à N. Une ligne = « cette pizza contient cet ingrédient ».
  -- Clé primaire composée : le même ingrédient ne peut pas figurer deux fois dans la même pizza.
  -- Supprimer une pizza efface sa composition (CASCADE) ; un ingrédient utilisé ne se supprime pas (RESTRICT).
  CREATE TABLE IF NOT EXISTS pizza_ingredients (
    pizzaId INTEGER NOT NULL REFERENCES pizzas (id) ON DELETE CASCADE,
    ingredientId INTEGER NOT NULL REFERENCES ingredients (id) ON DELETE RESTRICT,
    PRIMARY KEY (pizzaId, ingredientId)
  );
  -- Retrouver vite les pizzas qui utilisent un ingrédient (contrôle avant suppression).
  CREATE INDEX IF NOT EXISTS pizza_ingredients_ingredient ON pizza_ingredients (ingredientId);
`);

// Point 7 : exécute work() dans une transaction SQLite synchrone : tout est enregistré (COMMIT)
// ou rien ne l'est (ROLLBACK). BEGIN IMMEDIATE réserve l'écriture dès le début : aucune autre
// écriture ne peut se glisser entre nos contrôles (nom libre, ingrédients existants) et nos INSERT.
export function transaction(work) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = work();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    if (db.isTransaction) db.exec('ROLLBACK'); // SQLite a parfois déjà tout annulé lui-même
    throw error;
  }
}
