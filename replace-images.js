const fs = require('fs');

let content = fs.readFileSync('data/products.ts', 'utf8');

console.log('Original content length:', content.length);

// Replace Unsplash URLs with local paths
content = content.replace(/"https:\/\/images\.unsplash\.com\/[^"]+"/g, (match) => {
  console.log('Found match:', match);
  // Extract photo ID from URL
  const url = match.slice(1, -1); // Remove quotes
  const photoId = url.split('/').pop().split('?')[0];
  const newPath = '"/assets/images/' + photoId + '.jpg"';
  console.log('Replacing with:', newPath);
  return newPath;
});

console.log('Final content length:', content.length);
fs.writeFileSync('data/products.ts', content);
console.log('Replaced all Unsplash URLs with local paths');