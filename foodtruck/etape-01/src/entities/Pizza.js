import { db } from '../config/database.js';

// Couche « entité » : toutes les requêtes SQL sur la table pizzas (la table elle-même est créée
// dans config/database.js). Aucune trace de req ou res ici.
// Chaque valeur passe par un « ? » (SQL paramétré) : jamais de texte collé dans la requête.

export function findAll() {
  return db.prepare('SELECT * FROM pizzas ORDER BY id').all();
}

// Rend la pizza, ou undefined si aucune ligne ne porte cet identifiant.
export function findById(id) {
  return db.prepare('SELECT * FROM pizzas WHERE id = ?').get(id);
}

export function create({ name, description, price, imageUrl }) {
  const result = db
    .prepare('INSERT INTO pizzas (name, description, price, imageUrl) VALUES (?, ?, ?, ?)')
    .run(name, description, price, imageUrl);
  // L'identifiant est attribué par SQLite (AUTOINCREMENT) : on relit la ligne créée.
  return findById(Number(result.lastInsertRowid));
}

// Remplace toutes les informations modifiables (PUT). Rend undefined si la pizza n'existe pas.
export function update(id, { name, description, price, imageUrl }) {
  const result = db
    .prepare('UPDATE pizzas SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?')
    .run(name, description, price, imageUrl, id);
  return result.changes > 0 ? findById(id) : undefined;
}

// Rend true si une ligne a été supprimée, false si la pizza n'existait pas.
export function remove(id) {
  return db.prepare('DELETE FROM pizzas WHERE id = ?').run(id).changes > 0;
}
