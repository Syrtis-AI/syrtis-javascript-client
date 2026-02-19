#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const binDir = path.dirname(thisFilePath);
const rootDir = path.resolve(binDir, '..');
const dataDir = path.join(rootDir, 'src', 'data', 'entity');
const repositoryDir = path.join(rootDir, 'src', 'Repository');
const commonDir = path.join(rootDir, 'src', 'Common');
const templatePath = path.join(binDir, 'template', 'Repository.ts.tpl');

if (!fs.existsSync(dataDir)) {
  console.error(`Error: missing data directory: ${dataDir}`);
  process.exit(1);
}

if (!fs.existsSync(repositoryDir)) {
  fs.mkdirSync(repositoryDir, { recursive: true });
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

  const targetPath = path.join(repositoryDir, `${className}Repository.ts`);
  if (fs.existsSync(targetPath)) {
    skipped += 1;
    continue;
  }

  const content = template.replaceAll('{{CLASS_NAME}}', className);
  fs.writeFileSync(targetPath, content, 'utf8');
  created += 1;
  console.log(`Created ${targetPath}`);
}

const repositoryClasses = fs
  .readdirSync(repositoryDir)
  .filter((name) => name.endsWith('Repository.ts'))
  .map((name) => name.replace(/\.ts$/, ''));

const manifestPath = path.join(commonDir, 'generatedRepositories.ts');
const manifest = buildManifest(repositoryClasses);
fs.writeFileSync(manifestPath, manifest, 'utf8');
console.log(`Updated ${manifestPath}`);

console.log(`Done: created=${created}, skipped=${skipped}`);

function toPascalCase(value) {
  return value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function buildManifest(repositoryClasses) {
  const uniqueSorted = [...new Set(repositoryClasses)].sort();
  const imports = uniqueSorted
    .map((className) => `import ${className} from '../Repository/${className}.js';`)
    .join('\n');
  const exportsArray = uniqueSorted.join(', ');

  return `${imports}

const generatedRepositories = [${exportsArray}];

export default generatedRepositories;
`;
}
