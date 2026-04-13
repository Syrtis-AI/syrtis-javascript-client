## Installation

```bash
npm install @syrtis-ai/syrtis-javascript-client
```

## Instantiation

```typescript
import SyrtisClient from '@syrtis-ai/syrtis-javascript-client/Common/SyrtisClient';

const client = new SyrtisClient({
  bearerToken: 'your_token_here',
});
```

By default the client targets the latest API version. To pin a specific version:

```typescript
const client = new SyrtisClient({
  bearerToken: 'your_token_here',
});
```
