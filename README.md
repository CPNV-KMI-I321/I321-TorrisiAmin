# I321 : Programmer des systèmes distribués

Dépôt d'Amin Torrisi (classe SI-CA2a) pour le module I321 du CPNV, enseignant Kylian Manzini.
Cours et consignes : [CPNV-KMI-I321/I321](https://github.com/CPNV-KMI-I321/I321).

## Travail par semaine

| Semaine | Travail | Où |
| --- | --- | --- |
| SEM 01 (02.11.2026) | Configuration de l'environnement de travail | page wiki « Configuration de l'environnement de travail », à venir (preuves d'installation à relever sur mon PC) |
| SEM 02 (09.11.2026) | Exercice 1 : méthodes et codes HTTP | [exercice/exercice-1.md](exercice/exercice-1.md) |
| SEM 02 (09.11.2026) | Étape 01 : API Pizzas | [foodtruck/etape-01](foodtruck/etape-01) |
| SEM 02 (09.11.2026) | Étape 02 : Ingrédients | [foodtruck/etape-02](foodtruck/etape-02) |
| SEM 03 (16.11.2026) | Exercice 2 : architectures et N-tiers | [exercice/exercice-2.md](exercice/exercice-2.md) |
| SEM 03 (16.11.2026) | Étape 03 : services et composition | [foodtruck/etape-03](foodtruck/etape-03) |

Ce dépôt a été publié en une fois le 16.11.2026 (premiers commits entre 11 h 46 et 11 h 58) : le travail des SEM 01 et SEM 02 est donc remis en retard. La page wiki suivra dès que mes preuves d'installation seront relevées.

Chaque étape du Foodtruck est une application à part (son `package.json`, sa base SQLite, son `.env`), comme les starters du cours.

## Lancer et vérifier une étape

Prérequis : Node.js **24** et Git. Les starters sont prévus pour Node.js 24 (`engines` : `>=24 <25`, `.nvmrc` : 24) ; avec la version 26, que nodejs.org propose maintenant par défaut, `npm ci` affiche un avertissement `EBADENGINE`. Installer la 24 LTS.

```sh
cd foodtruck/etape-03
npm ci
npm start
```

API : http://localhost:3000/api/pizzas et, à partir de l'étape 02, http://localhost:3000/api/ingredients ; Swagger : http://localhost:3000/docs.

```sh
npm test
npm run test:acceptance
```

`npm test` vérifie le point de départ (2 tests par étape) ; `npm run test:acceptance` vérifie l'étape terminée (étape 01 : 1 test, étape 02 : 2 tests, étape 03 : 5 tests).

## Ce qui change par rapport aux starters

Chaque dossier d'étape contient le starter du cours complet, publié dans des commits par dossier : l'historique ne sépare donc pas le starter du travail. Les fichiers écrits ou modifiés sont seulement ceux-ci ; tout le reste est le starter inchangé.

| Étape | Fichiers écrits ou modifiés |
| --- | --- |
| 01 | `src/entities/Pizza.js`, `src/controllers/pizzasController.js`, `docs/`, ligne d'en-tête du `README.md` |
| 02 | `src/entities/Ingredient.js`, `src/controllers/ingredientsController.js`, `docs/`, ligne d'en-tête du `README.md` |
| 03 | `src/config/database.js`, `src/entities/Pizza.js` (`findByName`), `src/entities/PizzaComposition.js`, les deux contrôleurs, les deux services, `docs/`, ligne d'en-tête du `README.md` |

## Diagrammes

| Étape | Diagramme | Source | Rendu |
| --- | --- | --- | --- |
| 01 | Séquence Client, Route, Controller, Entity, SQLite | [a-completer.puml](foodtruck/etape-01/docs/a-completer.puml) | [sequence-pizzas.svg](https://github.com/CPNV-KMI-I321/I321-TorrisiAmin/raw/main/foodtruck/etape-01/docs/sequence-pizzas.svg) |
| 02 | Diagramme de classes, sans association | [a-completer.puml](foodtruck/etape-02/docs/a-completer.puml) | [diagramme-de-classes.svg](https://github.com/CPNV-KMI-I321/I321-TorrisiAmin/raw/main/foodtruck/etape-02/docs/diagramme-de-classes.svg) |
| 02 | MLD des deux tables, sans association | [a-completer.puml](foodtruck/etape-02/docs/a-completer.puml) | [mld.svg](https://github.com/CPNV-KMI-I321/I321-TorrisiAmin/raw/main/foodtruck/etape-02/docs/mld.svg) |
| 03 | MCD : une pizza contient des ingrédients (N à N) | [a-completer.puml](foodtruck/etape-03/docs/a-completer.puml) | [mcd.svg](https://github.com/CPNV-KMI-I321/I321-TorrisiAmin/raw/main/foodtruck/etape-03/docs/mcd.svg) |
| 03 | MLD avec la table d'association `pizza_ingredients` | [a-completer.puml](foodtruck/etape-03/docs/a-completer.puml) | [mld.svg](https://github.com/CPNV-KMI-I321/I321-TorrisiAmin/raw/main/foodtruck/etape-03/docs/mld.svg) |
| 03 | Séquence de création d'une pizza, avec ses cas d'erreur | [a-completer.puml](foodtruck/etape-03/docs/a-completer.puml) | [sequence-creation.svg](https://github.com/CPNV-KMI-I321/I321-TorrisiAmin/raw/main/foodtruck/etape-03/docs/sequence-creation.svg) |

Les liens « Rendu » ouvrent chaque diagramme en taille réelle. Régénérer un SVG : ouvrir le `.puml` dans WebStorm (extension PlantUML Integration), afficher l'aperçu, puis l'enregistrer en SVG. La ligne `!pragma layout smetana` évite d'installer Graphviz.

MLD en texte à l'étape 03 (clé primaire soulignée, # = clé étrangère) :

- pizzas (<ins>id</ins>, name, description, price, imageUrl), `name` unique sans tenir compte des majuscules
- ingredients (<ins>id</ins>, name, price)
- pizza_ingredients (<ins>#pizzaId</ins>, <ins>#ingredientId</ins>), clé primaire composée ; supprimer une pizza efface sa composition, un ingrédient utilisé ne se supprime pas

## Sources et aides

- Cours I321 de Kylian Manzini, repris et adapté du cours de Julien Iturbide ; starters [I321-StarterCode-1](https://github.com/CPNV-KMI-I321/I321-StarterCode-1), [I321-StarterCode-2](https://github.com/CPNV-KMI-I321/I321-StarterCode-2) et [I321-StarterCode-3](https://github.com/CPNV-KMI-I321/I321-StarterCode-3).
- [MDN : HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP), [Express 5](https://expressjs.com/), [Node.js 24 : node:sqlite](https://nodejs.org/docs/latest-v24.x/api/sqlite.html), [PlantUML](https://plantuml.com/fr/) ; les sources propres à chaque exercice sont en bas de son fichier.
- SQLite, pour l'étape 03 : [transactions](https://www.sqlite.org/lang_transaction.html) (`BEGIN IMMEDIATE`, `COMMIT`, `ROLLBACK`), [clés étrangères](https://www.sqlite.org/foreignkeys.html) (`ON DELETE CASCADE`, `RESTRICT`) et [classement NOCASE](https://www.sqlite.org/datatype3.html#collation).
- Aide de l'IA : à ma demande, Claude Code (Anthropic, modèle Claude Opus 5.5) a rédigé le 16.11.2026 les réponses des exercices 1 et 2, le code ajouté aux starters (entité et contrôleur des pizzas à l'étape 01, des ingrédients à l'étape 02 ; à l'étape 03 : services, composition, transaction, base, les deux contrôleurs et `Pizza.findByName`), les diagrammes, ce README et le texte de la page wiki. Pour les étapes 01 et 02, l'IA s'est servie du CRUD Pizzas que l'enseignant fournit dans le starter 2 (`src/entities/Pizza.js` et `src/controllers/pizzasController.js`) : elle y a aligné le code de l'étape 01, dont l'ordre des contrôles de `update`, et l'étape 02 reprend ce modèle, comme le demande le README du starter 2 (« Utiliser les fichiers Pizzas comme exemple »). Ce code est donc presque identique à celui de l'enseignant, à part les commentaires et quelques détails d'écriture. Le reste du code vient des starters du cours. L'IA a aussi publié ces fichiers sur ce dépôt le 16.11.2026, par mon navigateur et sous mon compte, avec mon accord : les commits et leurs messages sont d'elle. Mes demandes à l'IA sont en annexe. Référence : Anthropic. (2026). *Claude Code* (version 2.1.321, modèle Claude Opus 5.5) [Agent de programmation fondé sur un grand modèle de langage]. https://claude.com/claude-code

## Annexe : demandes faites à l'IA (16.11.2026)

Première demande, recopiée telle que je l'ai écrite :

> https://github.com/CPNV-KMI-I321 Est ce que tu peu faire ce qui est demandé dans mon organisation cpnv jusqu'a aujourdhui et sans te mettre en cowork puis me faire un resumer pour que j'apprenne aussi de comment ta fais et de ce qui est demandé etc

Réponse de l'IA : les fichiers de ce dépôt (exercices, code, diagrammes, README), le texte de la page wiki, et une page d'explication pour réviser (remise à moi, non publiée).

Deuxième demande, ma réponse à sa question « Après ta relecture, je publie sur ton dépôt I321 par ton Chrome ? » :

> Oui, par mon Chrome

Réponse de l'IA : la publication de ces fichiers sur ce dépôt, par mon navigateur.
