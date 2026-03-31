#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const binDir = path.dirname(thisFilePath);
const rootDir = path.resolve(binDir, '..');
const dataDir = path.join(rootDir, 'src', 'data', 'entity');
const entityDir = path.join(rootDir, 'src', 'Entity');
const commonDir = path.join(rootDir, 'src', 'Common');
const templatePath = path.join(binDir, 'template', 'Entity.ts.tpl');

if (!fs.existsSync(dataDir)) {
  console.error(`Error: missing data directory: ${dataDir}`);
  process.exit(1);
}

if (!fs.existsSync(entityDir)) {
  fs.mkdirSync(entityDir, { recursive: true });
}
if (!fs.existsSync(commonDir)) {
  fs.mkdirSync(commonDir, { recursive: true });
}

if (!fs.existsSync(templatePath)) {
  console.error(`Error: missing template file: ${templatePath}`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const files = fs
  .readdirSync(dataDir)
  .filter((name) => name.endsWith('.json'))
  .sort();

let created = 0;
let skipped = 0;

for (const fileName of files) {
  const entityName = path.basename(fileName, '.json');
  const className = toPascalCase(entityName);
  if (!className) {
    skipped += 1;
    continue;
  }

  const targetPath = path.join(entityDir, `${className}.ts`);
  if (!fs.existsSync(targetPath)) {
    const content = template
      .replaceAll('{{CLASS_NAME}}', className)
      .replaceAll('{{CAMEL_NAME}}', toCamelCase(entityName))
      .replaceAll('{{ENTITY_NAME}}', entityName);
    fs.writeFileSync(targetPath, content, 'utf8');
    created += 1;
    console.log(`Created ${targetPath}`);
    continue;
  }

  skipped += 1;
}

const schemaManifestPath = path.join(commonDir, 'generatedEntitySchemas.ts');
const schemaManifest = buildEntitySchemasManifest(files);
fs.writeFileSync(schemaManifestPath, schemaManifest, 'utf8');
console.log(`Updated ${schemaManifestPath}`);

console.log(`Done: created=${created}, skipped=${skipped}`);

function toPascalCase(value) {
  return value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : '';
}

function buildEntitySchemasManifest(jsonFiles) {
  const fileNames = [...jsonFiles].sort();
  const imports = fileNames
    .map((fileName) => {
      const baseName = path.basename(fileName, '.json');
      return `import ${toCamelCase(baseName)} from '../data/entity/${baseName}.json';`;
    })
    .join('\n');
  const schemaEntries = fileNames
    .map((fileName) => {
      const baseName = path.basename(fileName, '.json');
      const localVar = toCamelCase(baseName);
      return `    [${localVar}.name]: ${localVar},`;
    })
    .join('\n');

  return `${imports}

type EntitySchema = { name: string };

export default function getGeneratedEntitySchemas(): Record<string, EntitySchema> {
  return {
${schemaEntries}
  };
}
`;
}
