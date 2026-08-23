const fs = require('fs');
const path = require('path');

const dir = 'd:/Unitytvsite/src/components/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Desk.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Flatten shadows and add borders
  content = content.replace(/shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border-none/g, 'shadow-sm border border-gray-100');
  content = content.replace(/shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\]/g, 'shadow-sm border border-gray-100');
  
  // Rein in the corners
  content = content.replace(/rounded-\[24px\]/g, 'rounded-2xl');
  
  // If there's an explicit border-none we want to add light borders to cards
  // Only target the main divs inside the components
  
  fs.writeFileSync(path.join(dir, file), content, 'utf8');
});
console.log('Fixed all desks to flat Able Pro style');
