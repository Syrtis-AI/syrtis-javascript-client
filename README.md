# @syrtis-ai/syrtis-javascript-client

Version: 2.0.0

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Suite Signature](#suite-signature)

# @syrtis-ai/syrtis-javascript-client

Version: 0.0.75

## Table of Contents

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

# About us

[Syrtis AI](https://syrtis.ai) helps organizations turn artificial intelligence from an idea into reliable, measurable systems. We are a team of engineers and practitioners focused on implementing AI services inside real businesses — from strategy and architecture to deployment, integration, and long-term operations. Our goal is simple: deliver AI that works in production, fits your constraints, and earns its keep.

We build practical solutions that connect to existing tools, data, and processes, with an emphasis on security, performance, and governance. Whether it’s automating workflows, enhancing decision-making, or creating new product capabilities, Syrtis AI designs implementations that are maintainable, scalable, and aligned with business outcomes — not demos.

Syrtis AI promotes a culture of rigor and responsibility. Every delivery reflects a commitment to clear engineering, transparent communication, and trustworthy AI practices, so teams can adopt, operate, and evolve their AI services with confidence.
