const fs = require('fs');
let code = fs.readFileSync('src/components/HeroCarousel/HeroCarousel.tsx', 'utf8');

code = code.replace(
  'export default function HeroCarousel({ slides }: { slides: Slide[] }) {',
  'export default function HeroCarousel({ slides, globalShowNames = true, globalShowButtons = true }: { slides: Slide[], globalShowNames?: boolean, globalShowButtons?: boolean }) {'
);

// Remove the state and useEffect
code = code.replace(/const \[showNames, setShowNames\] = useState\(true\);\s*const \[showButtons, setShowButtons\] = useState\(true\);\s*useEffect\(\(\) => {[\s\S]*?}\);\s*\}, \[\]\);/, '');

// Replace variable usages
code = code.replace(/\{showNames &&/g, '{globalShowNames &&');
code = code.replace(/showButtons && \(/g, 'globalShowButtons && (');

fs.writeFileSync('src/components/HeroCarousel/HeroCarousel.tsx', code);
console.log('Patched HeroCarousel');
