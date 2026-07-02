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

Other supported options: `files`, `contentType`, `format`, `templateId`, `stamps`, `name`, `metadata`, `fileStamps`, `parentRequestSecureId`, `timeZone`.

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

## Fetching history

```typescript
const messages = await sessionRepository.fetchHistory({
  sessionSecureId: 'session_secure_id',
  page: 0,
  length: 50,
});
```

Also supports `lastRequestSecureId`, `orderBy` and `orderDirection`.

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

To unwrap a raw call yourself:

```typescript
import { unwrapApiEnvelope } from '@wexample/js-api/Common/ApiEnvelope';

const data = unwrapApiEnvelope<{ messages: unknown[] }>(await response.json());
```

## Extending entities

Entity fields are schema-driven and resolved through a Proxy. Two rules when adding code to an entity class:

- Prefer explicit methods (`getParsedContent()`) over computed getters.
- Inside a method, read schema fields with `this.getDataValue('field')` — the Proxy binds methods to the raw target, so `this.field` is not resolved there.
