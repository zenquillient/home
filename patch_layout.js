const fs = require('fs');
let code = fs.readFileSync('src/components/PageLayout/PageLayout.tsx', 'utf8');

if (!code.includes('globalSettings?:')) {
  code = code.replace('export default function PageLayout({ pageData, allReviews, verticals }: PageLayoutProps) {', 
`  globalSettings?: { showCarouselNames: boolean, showCarouselButtons: boolean };
}

export default function PageLayout({ pageData, allReviews, verticals, globalSettings }: PageLayoutProps) {`);

  code = code.replace('<HeroCarousel slides={pageData.images} />', '<HeroCarousel slides={pageData.images} globalShowNames={globalSettings?.showCarouselNames} globalShowButtons={globalSettings?.showCarouselButtons} />');
  fs.writeFileSync('src/components/PageLayout/PageLayout.tsx', code);
  console.log('Patched PageLayout');
}
