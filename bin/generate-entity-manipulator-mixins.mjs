#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const binDir = path.dirname(thisFilePath);
const rootDir = path.resolve(binDir, '..');
const dataDir = path.join(rootDir, 'src', 'data', 'entity');
const mixinDir = path.join(rootDir, 'src', 'Vue', 'Mixin', 'EntityManipulator');
const templatePath = path.join(binDir, 'template', 'EntityManipulatorVueMixin.ts.tpl');

if (!fs.existsSync(dataDir)) {
  console.error(`Error: missing data directory: ${dataDir}`);
  process.exit(1);
}

if (!fs.existsSync(mixinDir)) {
  fs.mkdirSync(mixinDir, { recursive: true });
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

  const targetPath = path.join(
    mixinDir,
    `${className}EntityManipulatorVueMixin.ts`
  );

  if (fs.existsSync(targetPath)) {
    skipped += 1;
    continue;
  }

  const content = template.replaceAll('{{CLASS_NAME}}', className);
  fs.writeFileSync(targetPath, content, 'utf8');
  created += 1;
  console.log(`Created ${targetPath}`);
}

console.log(`Done: created=${created}, skipped=${skipped}`);

function toPascalCase(value) {
  return value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

