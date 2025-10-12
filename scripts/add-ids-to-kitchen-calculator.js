const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'estimator', 'KitchenMaterialCalculator.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Pattern to match items.push({ without an id field
const pattern = /items\.push\(\{\s*\n\s*category:\s*'([^']+)',\s*\n\s*name:\s*('([^']+)'|`([^`]+)`)/g;

let match;
const replacements = [];

// Find all matches and prepare replacements
while ((match = pattern.exec(content)) !== null) {
  const fullMatch = match[0];
  const category = match[1];
  const nameQuote = match[2];
  const nameSingle = match[3];
  const nameTemplate = match[4];
  
  // Skip if already has an id field just before
  const beforeMatch = content.substring(Math.max(0, match.index - 100), match.index);
  if (beforeMatch.includes('id:')) {
    continue;
  }
  
  const name = nameSingle || nameTemplate;
  
  // Create the replacement with id field
  let replacement;
  if (nameTemplate) {
    // For template literals, we need to extract the name at runtime
    const nameVar = `item${replacements.length}Name`;
    replacement = `const ${nameVar} = \`${nameTemplate}\`\n    items.push({\n      id: this.generateId('${category}', ${nameVar}),\n      category: '${category}',\n      name: ${nameVar}`;
  } else {
    replacement = `items.push({\n      id: this.generateId('${category}', '${name}'),\n      category: '${category}',\n      name: '${name}'`;
  }
  
  replacements.push({
    original: fullMatch,
    replacement: replacement,
    index: match.index
  });
}

// Apply replacements in reverse order to preserve indices
replacements.reverse().forEach(({ original, replacement, index }) => {
  content = content.substring(0, index) + replacement + content.substring(index + original.length);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✓ Added IDs to ${replacements.length} MaterialItem objects`);

