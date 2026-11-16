import * as Ingredient from '../entities/Ingredient.js';
import { fail, validateId, validateIngredient } from '../validation.js';

// Mêmes codes HTTP que pour les pizzas (200, 201, 204, 400, 404), contrôlés dans le même ordre :
// l'existence (404) avant les données (400), comme dans pizzasController.js.

export function list(req, res) {
  res.json(Ingredient.findAll());
}

export function get(req, res) {
  const ingredient = Ingredient.findById(validateId(req.params.id));
  if (!ingredient) fail(404, 'Ingrédient introuvable.');
  res.json(ingredient);
}

export function create(req, res) {
  const ingredient = Ingredient.create(validateIngredient(req.body));
  res.status(201).location(`/api/ingredients/${ingredient.id}`).json(ingredient);
}

export function update(req, res) {
  const id = validateId(req.params.id);
  if (!Ingredient.findById(id)) fail(404, 'Ingrédient introuvable.');
  res.json(Ingredient.update(id, validateIngredient(req.body)));
}

export function remove(req, res) {
  if (!Ingredient.remove(validateId(req.params.id))) fail(404, 'Ingrédient introuvable.');
  res.status(204).end();
}
