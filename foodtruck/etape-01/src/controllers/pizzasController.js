import * as Pizza from '../entities/Pizza.js';
import { fail, validateId, validatePizza } from '../validation.js';

// Couche « contrôleur » : lit la requête, valide, appelle l'entité, choisit le code HTTP.
// Aucun SQL ici. Une erreur levée par fail() part dans le middleware errorHandler.

export function list(req, res) {
  res.json(Pizza.findAll());
}

export function get(req, res) {
  const pizza = Pizza.findById(validateId(req.params.id)); // 400 si l'identifiant est invalide
  if (!pizza) fail(404, 'Pizza introuvable.');
  res.json(pizza); // 200 par défaut
}

export function create(req, res) {
  const pizza = Pizza.create(validatePizza(req.body)); // 400 si les données sont invalides
  res.status(201).location(`/api/pizzas/${pizza.id}`).json(pizza);
}

// Ordre des contrôles : l'identifiant (400), puis l'existence (404), puis les données (400).
// Quand deux erreurs sont vraies en même temps, c'est cet ordre qui choisit le code rendu.
export function update(req, res) {
  const id = validateId(req.params.id);
  if (!Pizza.findById(id)) fail(404, 'Pizza introuvable.');
  res.json(Pizza.update(id, validatePizza(req.body)));
}

export function remove(req, res) {
  if (!Pizza.remove(validateId(req.params.id))) fail(404, 'Pizza introuvable.');
  res.status(204).end(); // 204 : succès, sans corps
}
