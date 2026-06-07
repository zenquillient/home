const appwrite = require('node-appwrite');

const ENDPOINT = 'https://tor.cloud.appwrite.io/v1';
const PROJECT = '6a257faa0031af0897bb';
const API_KEY = 'standard_9144ae1d2d3de84334e75c7deea78be0bf3be1b2a20da3e958da398aeaba9f7ea602cb7c9d789badeb1946a9a52c9411d90b050c7671e96a443e642eea83a17c3cd14b545969da0fd75c9d384e30e5b033d2f40153c1f2c9397b8158db677cabd071a2986b9290fc465dfe56e250486f4bb04d6a89922c1f1340a90bd6d9bfc9';

const client = new appwrite.Client().setEndpoint(ENDPOINT).setProject(PROJECT).setKey(API_KEY);
const databases = new appwrite.Databases(client);

async function check() {
  try {
    const res = await databases.listAttributes('mindwellnessDB', 'contacts');
    res.attributes.forEach(attr => {
      console.log(`${attr.key}: ${attr.status}`);
    });
  } catch (e) {
    console.error(e);
  }
}

check();
