const appwrite = require('node-appwrite');

const ENDPOINT = 'https://tor.cloud.appwrite.io/v1';
const PROJECT = '6a257faa0031af0897bb';
const API_KEY = 'standard_9144ae1d2d3de84334e75c7deea78be0bf3be1b2a20da3e958da398aeaba9f7ea602cb7c9d789badeb1946a9a52c9411d90b050c7671e96a443e642eea83a17c3cd14b545969da0fd75c9d384e30e5b033d2f40153c1f2c9397b8158db677cabd071a2986b9290fc465dfe56e250486f4bb04d6a89922c1f1340a90bd6d9bfc9';

const client = new appwrite.Client().setEndpoint(ENDPOINT).setProject(PROJECT).setKey(API_KEY);
const storageClient = new appwrite.Storage(client);

const BUCKET_ID = 'zenDownloads';

const permissions = [
  appwrite.Permission.read(appwrite.Role.any()),
  appwrite.Permission.create(appwrite.Role.any()),
  appwrite.Permission.update(appwrite.Role.any()),
  appwrite.Permission.delete(appwrite.Role.any())
];

async function fix() {
  try {
    const bucket = await storageClient.getBucket(BUCKET_ID);
    console.log(`Bucket found. Current enabled status: ${bucket.enabled}`);
    
    // Update to enabled = true
    await storageClient.updateBucket(
      BUCKET_ID, 
      bucket.name, 
      permissions,
      false, // fileSecurity
      true, // enabled (CRITICAL FIX)
      bucket.maximumFileSize,
      bucket.allowedFileExtensions
    );
    console.log(`Bucket ${BUCKET_ID} is now ENABLED.`);
  } catch (e) {
    console.error(`Failed to update bucket:`, e.message);
  }
}

fix();
