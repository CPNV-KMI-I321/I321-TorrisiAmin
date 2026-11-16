import { transaction } from '../config/database.js';
import * as Pizza from '../entities/Pizza.js';
import * as PizzaComposition from '../entities/PizzaComposition.js';
import { ensureExist } from './ingredientsService.js';
import { fail, validateId, validateIngredientIds, validatePizza } from '../validation.js';

// Couche « service » (métier) des pizzas et de leur composition. Aucune trace de req ou res ici.

// Chaque lecture rend aussi la composition : { ..., ingredientIds: [1, 2] }.
function withIngredients(pizza) {
  return { ...pizza, ingredientIds: PizzaComposition.ingredientIds(pizza.id) };
}

// Contrôles sans base de données : la forme des données (400 si elle ne va pas).
// Point 6 : au moins un ingrédient, des entiers positifs, tous distincts (validateIngredientIds).
function validateBody(body) {
  const data = validatePizza(body);
  const ingredientIds = validateIngredientIds(body.ingredientIds);
  return { data, ingredientIds };
}

// Point 8 : le nom est unique, majuscules ou non. exceptId permet à une pizza de garder son propre nom.
function ensureNameIsFree(name, exceptId) {
  const sameName = Pizza.findByName(name);
  if (sameName && sameName.id !== exceptId) fail(409, 'Ce nom de pizza est déjà utilisé.');
}

export function list() {
  return Pizza.findAll().map(withIngredients);
}

export function get(id) {
  const pizza = Pizza.findById(validateId(id));
  if (!pizza) fail(404, 'Pizza introuvable.');
  return withIngredients(pizza);
}

// Point 7 : la pizza et sa composition s'écrivent ensemble, ou pas du tout.
export function create(body) {
  const { data, ingredientIds } = validateBody(body);
  return transaction(() => {
    ensureExist(ingredientIds); // 400 si un ingrédient n'existe pas
    ensureNameIsFree(data.name); // 409 si le nom est déjà pris
    const pizza = Pizza.create(data);
    PizzaComposition.replace(pizza.id, ingredientIds);
    return withIngredients(pizza);
  });
}

// L'existence (404) avant les données (400), comme aux étapes 01 et 02.
// Si un contrôle échoue, ROLLBACK : l'ancien prix et l'ancienne composition restent.
export function update(id, body) {
  const pizzaId = validateId(id);
  return transaction(() => {
    if (!Pizza.findById(pizzaId)) fail(404, 'Pizza introuvable.');
    const { data, ingredientIds } = validateBody(body);
    ensureExist(ingredientIds);
    ensureNameIsFree(data.name, pizzaId);
    Pizza.update(pizzaId, data);
    PizzaComposition.replace(pizzaId, ingredientIds);
    return withIngredients(Pizza.findById(pizzaId));
  });
}

// La composition part avec la pizza : ON DELETE CASCADE sur pizza_ingredients.pizzaId.
export function remove(id) {
  if (!Pizza.remove(validateId(id))) fail(404, 'Pizza introuvable.');
}
