# Exercice 1 : méthodes et codes HTTP

Module I321, Programmer des systèmes distribués. Énoncé : [I321-Exercices, exercice 1](https://github.com/CPNV-KMI-I321/I321-Exercices/blob/main/exercices/exercice-1.md).

Binôme : aucun. Réponses rédigées par l'IA (Claude Code, modèle Claude Opus 5.5) le 16.11.2026, à ma demande : voir « Aide de l'IA » dans le [README du dépôt](../README.md#sources-et-aides).

Rappel du principe : la **méthode** dit ce que le client veut faire (son intention) ; le **code** dit le résultat du traitement de sa requête (réussite, refus, erreur, ou prise en charge différée avec `202`).

## 1. Choisir la requête et la réponse

| N° | Situation | Méthode HTTP | Chemin | Code HTTP |
| --- | --- | --- | --- | --- |
| 1 | Consulter la carte des pizzas. | `GET` | `/api/pizzas` | `200 OK` |
| 2 | Consulter les informations de la pizza 7. | `GET` | `/api/pizzas/7` | `200 OK` |
| 3 | Ajouter une pizza avec des données valides. | `POST` | `/api/pizzas` | `201 Created` (avec l'en-tête `Location: /api/pizzas/{id}`) |
| 4 | Remplacer les informations de la pizza 7. | `PUT` | `/api/pizzas/7` | `200 OK` |
| 5 | Supprimer la pizza 7. | `DELETE` | `/api/pizzas/7` | `204 No Content` |
| 6 | Consulter les informations de la pizza 999. | `GET` | `/api/pizzas/999` | `404 Not Found` |
| 7 | Ajouter une pizza dont le prix est négatif. | `POST` | `/api/pizzas` | `400 Bad Request` |
| 8 | Consulter la carte alors qu'elle ne contient aucune pizza. | `GET` | `/api/pizzas` | `200 OK` |
| 9 | Ajouter une pizza avec des données valides, mais une erreur interne inattendue empêche son enregistrement. | `POST` | `/api/pizzas` | `500 Internal Server Error` |

Situation 4 : `200 OK` et non `204 No Content`, car le contrat dit que les modifications réussies renvoient des données JSON (la pizza modifiée). La RFC 9110 (§9.3.4) permet les deux codes pour un `PUT` réussi ; c'est le contrat qui tranche.

## 2. Préparer le corps des requêtes

### 2.1. Situations avec un corps JSON

**Réponse :**

Les situations **3, 4, 7 et 9**. Ce sont les requêtes `POST` et `PUT` : le client envoie les données de la pizza à créer ou à remplacer. Dans la situation 7, le JSON est bien formé, mais `price` est négatif : la donnée viole le contrat (prix positif ou nul), d'où le `400` qu'il prévoit ; une autre API pourrait répondre `422 Unprocessable Content`. Dans la situation 9, le corps est valide, c'est le serveur qui échoue. Ces quatre requêtes portent l'en-tête `Content-Type: application/json`.

Les situations 1, 2, 5, 6 et 8 (`GET` et `DELETE`) n'envoient aucun corps : le chemin suffit à dire quelle ressource est lue ou supprimée (la collection `/api/pizzas` ou une pizza précise, comme `/api/pizzas/7`).

### 2.2. Création d'une pizza

Corps de la situation 3. Pas de champ `id` : l'identifiant est attribué par le serveur.

**Réponse :**

```json
{
  "name": "Margherita",
  "description": "Tomate, mozzarella et basilic",
  "price": 14.5
}
```

### 2.3. Remplacement d'une pizza

Corps de la situation 4 (`PUT /api/pizzas/7`). Un remplacement envoie **toutes** les informations modifiables de la pizza. L'identifiant 7 est déjà dans le chemin, il n'est pas répété dans le corps.

**Réponse :**

```json
{
  "name": "Margherita",
  "description": "Tomate, mozzarella et basilic frais",
  "price": 16
}
```

## 3. Expliquer ses choix

### 3.1. Une méthode, plusieurs codes de réponse

**Réponse :**

La méthode exprime l'intention du client : dans les deux cas, il veut lire une pizza (`GET`). Le code décrit le résultat du traitement par le serveur, qui dépend de l'état de la ressource : la pizza 7 existe, le serveur la renvoie avec `200 OK` ; la pizza 999 n'existe pas, il répond `404 Not Found`. Même intention, résultats différents, donc codes différents.

### 3.2. Une carte vide

**Réponse :**

Le corps contient une liste JSON vide : `[]`. Le code reste `200 OK` : la collection `/api/pizzas` existe et la lecture a réussi, elle contient simplement zéro pizza. Ce n'est pas un `404` (la ressource demandée, la carte, existe bien) et pas un `204`, car le contrat dit qu'une lecture réussie renvoie des données JSON ; le client peut parcourir `[]` comme n'importe quelle liste.

### 3.3. Une suppression réussie

**Réponse :**

Non. `204 No Content` signifie que la réponse n'a pas de corps : y ajouter un message JSON contredirait le code (et le contrat, qui dit qu'une suppression réussie ne renvoie aucun contenu). Pour renvoyer un message, il faudrait un autre code, par exemple `200 OK` avec un corps, ce que le contrat ne prévoit pas ici. Source : RFC 9110, §15.3.5 (une réponse `204` ne peut pas contenir de contenu) et MDN, *204 No Content*.

## 4. Vrai ou faux : vérifier un échange HTTP

| N° | Situation | Requête proposée | Réponse proposée | Vrai ou faux ? | Correction si faux |
| --- | --- | --- | --- | --- | --- |
| 1 | Vérifier les informations d'un fichier existant sans télécharger son contenu. | `HEAD /fichiers/guide.pdf` | `200 OK` avec le fichier PDF dans le corps de la réponse | **Faux** | Contenu : une réponse à `HEAD` n'a **jamais de corps**. `200 OK` **sans corps**, avec seulement les en-têtes (par exemple `Content-Type`, `Content-Length`). |
| 2 | Modifier uniquement l'adresse e-mail d'un compte existant, en conservant les autres informations. L'API accepte cette modification. | `PATCH /api/comptes/12` avec le JSON `{"email":"lea@example.com"}` | `200 OK` avec le compte modifié en JSON | **Vrai** | |
| 3 | Consulter son profil sur un service qui exige une authentification. Aucun identifiant de connexion n'est fourni. | `GET /api/profil` | `401 Unauthorized` avec l'en-tête `WWW-Authenticate: Bearer` | **Vrai** | |
| 4 | Un utilisateur correctement authentifié essaie de supprimer le fichier d'un autre utilisateur. Le serveur refuse car il ne possède pas les droits nécessaires. | `DELETE /api/fichiers/42` | `401 Unauthorized` | **Faux** | Code : `403 Forbidden`. L'utilisateur est authentifié (ce n'est donc pas un `401`), mais il n'a pas l'autorisation de supprimer ce fichier. |
| 5 | Envoyer un fichier PDF à un service qui accepte uniquement les images PNG. | `POST /api/images` avec un fichier PDF et l'en-tête `Content-Type: application/pdf` | `415 Unsupported Media Type` | **Vrai** | |
| 6 | Envoyer une requête POST à une ressource publique existante qui accepte uniquement GET et HEAD. | `POST /api/meteo` | `404 Not Found` | **Faux** | Code : `405 Method Not Allowed`, avec l'en-tête `Allow: GET, HEAD`. La ressource existe, c'est la méthode qui n'est pas acceptée. |
| 7 | Demander une conversion vidéo. La demande est acceptée, mais le traitement sera effectué plus tard et le fichier converti n'existe pas encore. | `POST /api/conversions` | `202 Accepted` avec un message de prise en charge en JSON | **Vrai** | |
| 8 | Créer un compte avec un nom d'utilisateur déjà pris. Le service impose l'unicité de ce nom et refuse la création. | `POST /api/comptes` | `409 Conflict` | **Vrai** | |
| 9 | Le catalogue de la bibliothèque a été déplacé définitivement de `/livres` vers `/catalogue`. Le serveur annonce cette redirection permanente. | `GET /livres` | `302 Found` avec l'en-tête `Location: /catalogue` | **Faux** | Code : `301 Moved Permanently` (ou `308 Permanent Redirect`), avec `Location: /catalogue`. `302` annonce une redirection **temporaire**. |
| 10 | Un service est temporairement indisponible pour maintenance. Il répond, mais ne peut pas fournir le catalogue demandé. | `GET /api/catalogue` | `200 OK` avec le JSON `{"erreur":"Maintenance en cours"}` | **Faux** | Code : `503 Service Unavailable` (éventuellement avec l'en-tête `Retry-After`). `200` annoncerait un succès alors que le catalogue n'est pas fourni. |
| 11 | La connexion au serveur est refusée. Aucune réponse HTTP n'est reçue par le client. | Tentative de `GET /api/catalogue` | Le client reçoit du serveur le code `503 Service Unavailable` | **Faux** | Réponse : **aucune réponse HTTP**, donc aucun code. Le client constate seulement une erreur de connexion (par exemple `ECONNREFUSED`) ; pour lire un `503`, il faudrait qu'un serveur ou un proxy ait répondu en HTTP. |
| 12 | Découvrir les méthodes autorisées sur le catalogue sans modifier les données. | `OPTIONS /api/catalogue` | `204 No Content`, sans corps, avec l'en-tête `Allow: GET, HEAD, OPTIONS` | **Vrai** | |

## Sources

- [MDN : méthodes de requête HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Methods) (`HEAD`, `PATCH`, `OPTIONS`)
- [MDN : codes de statut de réponse HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status) (`202`, `301`, `302`, `308`, `401`, `403`, `405`, `409`, `415`, `503`)
- Cours I321 : [Les méthodes HTTP](https://github.com/CPNV-KMI-I321/I321/blob/main/theorie-et-concepts/les-base-dune-api/les-methodes-http.md) et [Les codes HTTP](https://github.com/CPNV-KMI-I321/I321/blob/main/theorie-et-concepts/les-base-dune-api/les-codes-http.md)
- [RFC 9110, HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) (§9.3.4 `PUT`, §15.3.5 `204`, §15.5.21 `422`)
- Corrigé de l'enseignant : [I321-Exercices, solutions/exercice-1-solutions.md](https://github.com/CPNV-KMI-I321/I321-Exercices/blob/main/solutions/exercice-1-solutions.md), publié le 09.11.2026, consulté par l'IA le 16.11.2026 pour vérifier les réponses. Quatre points viennent de lui : l'en-tête `Content-Type: application/json` (2.1), la justification de `200` plutôt que `204` (situation 4), la distinction entre un JSON bien formé et une valeur hors contrat (situation 7) et la nuance sur le `503`, qui suppose une réponse HTTP (partie 4, n° 11).
