import { db } from '../config/database.js';

// Couche « entité » de la table d'association pizza_ingredients (le lien N à N).
// Comme Pizza.js et Ingredient.js : du SQL paramétré seulement, aucune règle métier.

// Rend les identifiants des ingrédients d'une pizza, triés, par exemple [1, 2].
export function ingredientIds(pizzaId) {
  return db.prepare('SELECT ingredientId FROM pizza_ingredients WHERE pizzaId = ? ORDER BY ingredientId')
    .all(pizzaId)
    .map(row => row.ingredientId);
}

// Remplace toute la composition d'une pizza : on efface les anciennes lignes, puis on écrit les nouvelles.
// Le service l'appelle dans une transaction : jamais de composition à moitié écrite.
export function replace(pizzaId, ids) {
  db.prepare('DELETE FROM pizza_ingredients WHERE pizzaId = ?').run(pizzaId);
  const insert = db.prepare('INSERT INTO pizza_ingredients (pizzaId, ingredientId) VALUES (?, ?)');
  for (const ingredientId of ids) insert.run(pizzaId, ingredientId);
}

// true si au moins une pizza utilise cet ingrédient.
export function isUsed(ingredientId) {
  return db.prepare('SELECT 1 FROM pizza_ingredients WHERE ingredientId = ? LIMIT 1').get(ingredientId) !== undefined;
}
