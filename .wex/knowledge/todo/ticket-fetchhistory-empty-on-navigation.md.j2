# Ticket — `fetchHistory` renvoie un historique vide après navigation

**Composant :** `@syrtis-ai/syrtis-javascript-client` (v6.0.1)
**Priorité :** haute (régression observée en production)
**Signalé par :** projet BDO Letters (app `bdo-letters`)

## Symptôme

En production, quand l'utilisateur **change de page**, les messages de la session
de chat disparaissent : le panneau se remonte, rappelle l'historique, mais
revient vide alors que la session contient bien des messages (rechargement
complet de l'app = idem).

## Repro

1. Ouvrir le panneau assistant, échanger quelques messages.
2. Naviguer vers une autre route de l'app.
3. Le panneau se remonte et appelle `fetchHistory` → **aucun message affiché**.

## Attendu vs observé

- **Attendu :** `fetchHistory({ sessionSecureId, page: 0, orderBy: 'dateCreated', orderDirection: 'DESC' })` renvoie les derniers messages de la session.
- **Observé :** collection vide (ou `items` vide), alors que la session existe et contient des messages.

## Côté app (hors scope client — pour contexte)

L'app est correcte et n'est pas en cause :
- `AssistantPanel` est monté par `AppLayout`, donc **remonté à chaque navigation** ;
  au montage il appelle `loadInitialHistory()` → `fetchHistory` (page 0).
- Au premier appel, `lastRequestSecureId` est `null` (ref neuve après remontage),
  donc aucun ancrage de branche n'est imposé côté app.

## Pistes à investiguer (client / plateforme)

- `SessionRepository.fetchHistory` (`src/Repository/SessionRepository.ts:354`) :
  wrapper mince sur `GET history/<sessionSecureId>` — vérifier ce que renvoie
  réellement l'endpoint dans ce cas (payload vide ? erreur avalée ?).
- `extractPayload` / `extractItems` : régression de parsing du payload
  (forme de réponse changée côté serveur → `items` vide) ?
- Comportement de l'endpoint `history/<sessionSecureId>` **sans**
  `lastRequestSecureId` : renvoie-t-il bien la dernière branche par défaut, ou
  exige-t-il désormais un ancrage explicite ?
- Vérifier une éventuelle **régression de version** (comparer avec la version
  précédente en prod) — le symptôme est apparu récemment.

## Note

Confirmer en amont : l'endpoint serveur renvoie-t-il des données pour cette
session (test direct de l'API `history/<sessionSecureId>`) ? Cela tranche
immédiatement entre bug de parsing (client) et bug de l'endpoint (plateforme).
