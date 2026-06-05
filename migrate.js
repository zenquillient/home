const https = require('https');

const options = {
  hostname: 'tor.cloud.appwrite.io',
  port: 443,
  headers: {
    'X-Appwrite-Project': '69e395760026407414c6',
    'Content-Type': 'application/json'
  }
};

const getDoc = () => {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, method: 'GET', path: '/v1/databases/mindwellnessDB/collections/settings/documents/mindfulness' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
};

const createDoc = (data) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ documentId: 'popup_settings', data: { content: data.content } });
    const req = https.request({ ...options, method: 'POST', path: '/v1/databases/mindwellnessDB/collections/settings/documents' }, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

const run = async () => {
  try {
    const doc = await getDoc();
    if (doc.content) {
      const parsed = JSON.parse(doc.content);
      // Ensure it is popup data, which has "btnText" or "title" but no "images" array for verticals
      if (parsed.btnText !== undefined || parsed.showCarouselNames !== undefined) {
         console.log('Migrating popup settings...');
         await createDoc(doc);
         console.log('Migrated successfully.');
      } else {
         console.log('Document is not popup settings, skipping.');
      }
    }
  } catch (e) {
    console.error(e);
  }
};

run();
