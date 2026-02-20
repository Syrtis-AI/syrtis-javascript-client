import getGeneratedEntitySchemas from './generatedEntitySchemas.js';

export default function getEntitySchemas(): Record<string, { name: string }> {
  return getGeneratedEntitySchemas();
}
