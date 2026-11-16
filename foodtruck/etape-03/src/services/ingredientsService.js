import { transaction } from '../config/database.js';
import * as Ingredient from '../entities/Ingredient.js';
import * as PizzaComposition from '../entities/PizzaComposition.js';
import { fail, validateId, validateIngredient } from '../validation.js';

// Couche « service » (métier) des ingrédients. Aucune trace de req ou res ici : le service reçoit
// des valeurs, rend des objets et lève fail(code, message) ; le contrôleur s'occupe du HTTP.
// Le service valide lui-même ce qu'il reçoit : on peut l'appeler sans HTTP (tests/services.acceptance.js).

export function list() {
  return Ingredient.findAll();
}

export function get(id) {
  const ingredient = Ingredient.findById(validateId(id));
  if (!ingredient) fail(404, 'Ingrédient introuvable.');
  return ingredient;
}

export function create(body) {
  return Ingredient.create(validateIngredient(body));
}

// Même ordre qu'aux étapes 01 et 02 : l'identifiant (400), l'existence (404), puis les données (400).
export function update(id, body) {
  const ingredientId = validateId(id);
  if (!Ingredient.findById(ingredientId)) fail(404, 'Ingrédient introuvable.');
  return Ingredient.update(ingredientId, validateIngredient(body));
}

// Point 8 : un ingrédient utilisé par une pizza ne se supprime pas (409 Conflict).
// Le contrôle et la suppression sont dans la même transaction : rien ne s'intercale entre les deux.
export function remove(id) {
  const ingredientId = validateId(id);
  transaction(() => {
    if (!Ingredient.findById(ingredientId)) fail(404, 'Ingrédient introuvable.');
    if (PizzaComposition.isUsed(ingredientId)) fail(409, 'Ingrédient utilisé par au moins une pizza.');
    Ingredient.remove(ingredientId);
  });
}

// Point 6 : chaque identifiant reçu doit exister. Sinon 400 : c'est la demande qui est incorrecte.
export function ensureExist(ids) {
  const absents = ids.filter(ingredientId => !Ingredient.findById(ingredientId));
  if (absents.length > 0) fail(400, `Ingrédient introuvable : ${absents.join(', ')}.`);
}
