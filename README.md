# @syrtis-ai/syrtis-javascript-client

Version: 6.0.2

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Suite Signature](#suite-signature)

TypeScript client for the Syrtis public API: sessions, conversational messages (sync or async via live updates), history and entity hydration. It targets the versioned API (`2026-1` by default) and carries no server secret — authentication uses a bearer token, and realtime subscriptions rely on scoped, short-lived JWTs fetched from the API.

## Installation

```bash
npm install @syrtis-ai/syrtis-javascript-client
```

## Instantiation

```typescript
import SyrtisClient from '@syrtis-ai/syrtis-javascript-client/Common/SyrtisClient';

const client = new SyrtisClient({
  host: 'https://api.syrtis.ai',
  bearerToken: 'your_token_here',
});
```

By default the client targets the latest API version (`2026-1`). To pin a specific version:

```typescript
const client = new SyrtisClient({
  host: 'https://api.syrtis.ai',
  bearerToken: 'your_token_here',
  apiVersion: SyrtisClient.API_VERSION_2025_3,
});
```

## Repositories

Entities are accessed through repositories, resolved from the entity class:

```typescript
import Session from '@syrtis-ai/syrtis-javascript-client/Entity/Session';
import type SessionRepository from '@syrtis-ai/syrtis-javascript-client/Repository/SessionRepository';

const sessionRepository = client.getRepository(Session) as SessionRepository;
```

## Creating a session

```typescript
const session = await sessionRepository.createSession({
  scenarioSecureId: 'sce_…',
  title: 'Support conversation', // optional
});
// session.secureId → use it for sendMessage / fetchHistory / subscribe
```

## Sending a message

`sendMessage` posts to `session/continue/{secureId}` and returns hydrated `Message[]` entities (the messages produced by the scenario):

```typescript
const messages = await sessionRepository.sendMessage({
  sessionSecureId: 'session_secure_id',
  content: 'Hello',
});
```

### Synchronous mode

By default the API responds as soon as the request is accepted. With `sync: true`, the HTTP response is held until the whole scenario processing is done, so the returned messages include the full reply:

```typescript
const messages = await sessionRepository.sendMessage({
  sessionSecureId: 'session_secure_id',
  content: 'Hello',
  sync: true,
});
```

Other supported options: `files`, `contentType`, `format`, `stamps`, `name`, `metadata`, `fileStamps`, `parentRequestSecureId`, `timeZone`.

### Sending several messages in one request

All messages of a single `sendMessage` call belong to the same scenario request — the scenario processes them as one conversation turn (unlike two successive `sendMessage` calls, which create two turns). `content` is a shortcut for the first message; `messages` carries the others (or all of them), with the same defaults (`conversation`/`text`):

```typescript
const reply = await sessionRepository.sendMessageAndWaitForReply({
  sessionSecureId,
  content: 'Hello',
  messages: [
    { content: 'Your name is Marion', name: 'CONTEXT_INSTRUCTION' },
  ],
});
```

## Working with messages

`Message` exposes typed fields (`content`, `contentType`, `format`, `name`, `origin`, `dateCreated`, `versionMajor`, `versionMinor`) plus the discriminant constants used by the API (`Message.ORIGIN_*`, `Message.CONTENT_TYPE_*`, `Message.FORMAT_*`).

```typescript
import Message from '@syrtis-ai/syrtis-javascript-client/Entity/Message';

// Conversational replies produced by the scenario (origin node + contentType conversation):
const lastReply = messages.filter(Message.isReply).at(-1);

// Find a scenario output by name:
const extracted = messages.find((m) => m.name === 'EXTRACTED_COMPANY');

// Structured content: for format 'json' messages, getParsedContent() returns the
// server-parsed object (metadata.formattedContent), falling back to JSON.parse(content).
// For other formats it returns the raw content.
const data = extracted?.getParsedContent();
```

## Async conversations (live updates)

No configuration is required: `subscribe()` fetches a scoped, short-lived Mercure subscriber JWT from the API (`session/subscribe-info/{secureId}`) and renews it automatically on reconnection. The API bearer token is enough.

Subscribe to a session — payloads are hydrated into entities, reconnection with backoff is automatic:

```typescript
const connection = sessionRepository.subscribe({
  sessionSecureId: 'session_secure_id',
  onMessage: (message) => { /* hydrated Message */ },
  onRequest: (request) => { /* hydrated Request */ },
  onEvent: (liveEvent) => { /* every raw event: {entityType, event, data} */ },
  onInvalidEvent: (payload) => { /* malformed payloads (default: console.warn) */ },
  onStatusChange: (status) => { /* connecting | open | error | closed */ },
});

connection.close(); // when done
```

Send and wait for the scenario reply without holding the HTTP response:

```typescript
const reply = await sessionRepository.sendMessageAndWaitForReply({
  sessionSecureId: 'session_secure_id',
  content: 'Hello',
  timeoutMs: 60000, // default 120000; ERR_LIVE_UPDATES_REPLY_TIMEOUT on expiry
});
```

By default the promise resolves on the first `Message.isReply` message; pass `isReply: (m) => ...` to customize.

To bypass the automatic JWT flow, pass `mercureHubUrl`/`mercureJwt` to the client constructor (static hub configuration), or inject a `liveUpdatesDriver` (any `LiveUpdatesDriverInterface` from `@wexample/js-api/Common/LiveUpdates/LiveUpdatesDriver`) for a custom transport. Both take precedence over the subscribe-info flow. `fetchSubscribeInfo(sessionSecureId)` is also available directly on the repository.

## Fetching history

```typescript
const { messages, hasMore } = await sessionRepository.fetchHistory({
  sessionSecureId: 'session_secure_id',
  page: 0,
  length: 50,
});
```

`hasMore` is computed server side (correct even with filters); it is `null` when the API did not paginate (no `length` requested).

Also supports `lastRequestSecureId`, `orderBy` and `orderDirection`.

Conversations are trees (message versions create branches). `lastRequestSecureId` selects which branch the history walks: it anchors the walk on that request and returns messages from its branch (the request and its ancestors). Without it, the walk starts from the latest request of the session. Side effect worth relying on: once anchored, pages are stable — messages sent after the anchor belong to descendant requests and never shift the pagination. For an infinite-scroll chat, capture the `requestSecureId` of the first batch and keep it as `lastRequestSecureId` for the following pages.

To display a chat history, filter conversational messages (both user and scenario):

```typescript
const visible = messages.filter(Message.isConversation);
```

## Error handling

All API responses use the standard envelope `{ type, code, message?, data }`. Unwrapping is centralized in `@wexample/js-api`: when the server answers `type: 'error'`, repository calls throw an `ApiEnvelopeError` carrying the server error key.

```typescript
import ApiEnvelopeError from '@wexample/js-api/Common/Errors/ApiEnvelopeError';

try {
  await sessionRepository.sendMessage({ sessionSecureId, content, sync: true });
} catch (error) {
  if (error instanceof ApiEnvelopeError) {
    // error.code: server error key (e.g. 'ERR_INVALID_CREDENTIALS')
    // error.responseCode: numeric code from the envelope
    // error.envelope: raw response for inspection
  }
  throw error;
}
```

Hydration is strict by design: a response key absent from the entity schema, a read-only write, a malformed API item or an unregistered relationship type throws an `ApiSchemaError` (`@wexample/js-api/Common/Errors/ApiSchemaError`, codes `ERR_SCHEMA_*`, carrying `entityName` and `field`). A contract drift is caught at the boundary instead of silently losing data. The only tolerated exception is live-update payloads, produced by the API's legacy normalizer.

To unwrap a raw call yourself:

```typescript
import { unwrapApiEnvelope } from '@wexample/js-api/Common/ApiEnvelope';

const data = unwrapApiEnvelope<{ messages: unknown[] }>(await response.json());
```

## Extending entities

Entity fields are schema-driven and resolved through a Proxy. Two rules when adding code to an entity class:

- Prefer explicit methods (`getParsedContent()`) over computed getters.
- Inside a method, read schema fields with `this.getDataValue('field')` — the Proxy binds methods to the raw target, so `this.field` is not resolved there.

# About us

[Syrtis AI](https://syrtis.ai) helps organizations turn artificial intelligence from an idea into reliable, measurable systems. We are a team of engineers and practitioners focused on implementing AI services inside real businesses — from strategy and architecture to deployment, integration, and long-term operations. Our goal is simple: deliver AI that works in production, fits your constraints, and earns its keep.

We build practical solutions that connect to existing tools, data, and processes, with an emphasis on security, performance, and governance. Whether it’s automating workflows, enhancing decision-making, or creating new product capabilities, Syrtis AI designs implementations that are maintainable, scalable, and aligned with business outcomes — not demos.

Syrtis AI promotes a culture of rigor and responsibility. Every delivery reflects a commitment to clear engineering, transparent communication, and trustworthy AI practices, so teams can adopt, operate, and evolve their AI services with confidence.
