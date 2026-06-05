const fs = require('fs');

// Patch src/app/page.tsx
let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!pageCode.includes('getGlobalSettings')) {
  pageCode = pageCode.replace('import { getPageData, getVerticalNames, getAllReviews } from', 'import { getPageData, getVerticalNames, getAllReviews, getGlobalSettings } from');
  
  pageCode = pageCode.replace(
    'const [pageData, verticals, allReviews] = await Promise.all([',
    'const [pageData, verticals, allReviews, globalSettings] = await Promise.all(['
  );
  
  pageCode = pageCode.replace(
    "getAllReviews()",
    "getAllReviews(),\n    getGlobalSettings()"
  );

  pageCode = pageCode.replace(
    '<PageLayout pageData={pageData} allReviews={allReviews} verticals={verticals} />',
    '<PageLayout pageData={pageData} allReviews={allReviews} verticals={verticals} globalSettings={globalSettings} />'
  );
  
  fs.writeFileSync('src/app/page.tsx', pageCode);
  console.log('Patched page.tsx');
}

// Patch src/app/[slug]/page.tsx
let slugCode = fs.readFileSync('src/app/[slug]/page.tsx', 'utf8');
if (!slugCode.includes('getGlobalSettings')) {
  slugCode = slugCode.replace('import { getPageData, getDynamicPage, getVerticalNames } from', 'import { getPageData, getDynamicPage, getVerticalNames, getGlobalSettings } from');
  
  slugCode = slugCode.replace(
    'const [pageData, verticals] = await Promise.all([',
    'const [pageData, verticals, globalSettings] = await Promise.all(['
  );
  
  slugCode = slugCode.replace(
    "getVerticalNames()",
    "getVerticalNames(),\n    getGlobalSettings()"
  );

  slugCode = slugCode.replace(
    '<PageLayout pageData={pageData} verticals={verticals} />',
    '<PageLayout pageData={pageData} verticals={verticals} globalSettings={globalSettings} />'
  );

  fs.writeFileSync('src/app/[slug]/page.tsx', slugCode);
  console.log('Patched [slug]/page.tsx');
}
