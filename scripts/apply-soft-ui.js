const fs = require('fs');
const path = require('path');

const dir = 'd:/Unitytvsite/src/components/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Desk.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Soft shadows and rounded corners
  content = content.replace(/rounded-xl/g, 'rounded-[24px]');
  content = content.replace(/rounded-2xl/g, 'rounded-[24px]');
  content = content.replace(/shadow-sm/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
  content = content.replace(/shadow-md/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
  content = content.replace(/border border-gray-200/g, 'border-none');
  
  // Card Titles: from font-heading font-semibold text-lg|base|sm text-gray-900 to small gray uppercase
  content = content.replace(/className="font-heading font-semibold tracking-tight text-([a-z0-9]+) text-gray-900/g, 'className="text-[11px] font-bold text-gray-400 uppercase tracking-widest');
  content = content.replace(/className="font-heading font-semibold tracking-tight text-gray-900/g, 'className="text-[11px] font-bold text-gray-400 uppercase tracking-widest');
  
  fs.writeFileSync(path.join(dir, file), content, 'utf8');
});
console.log('Fixed all desks');
