const fs = require('fs');
let code = fs.readFileSync('src/lib/cms.ts', 'utf8');

const newFunc = `
export const getGlobalSettings = async () => {
  try {
    const doc = await databases.getDocument(DB_ID, COL_SETTINGS, 'popup_settings');
    if (doc.content) {
      const p = JSON.parse(doc.content);
      return {
        showCarouselNames: p.showCarouselNames !== undefined ? p.showCarouselNames : (p.showCarouselTitles !== undefined ? p.showCarouselTitles : true),
        showCarouselButtons: p.showCarouselButtons !== undefined ? p.showCarouselButtons : (p.showCarouselTitles !== undefined ? p.showCarouselTitles : true),
      };
    }
  } catch(e) {}
  return { showCarouselNames: true, showCarouselButtons: true };
};
`;

if (!code.includes('getGlobalSettings')) {
  code = code + '\n' + newFunc;
  fs.writeFileSync('src/lib/cms.ts', code);
  console.log('Added getGlobalSettings');
} else {
  console.log('Already exists');
}
