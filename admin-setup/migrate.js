const appwrite = require('node-appwrite');

const OLD_PROJECT = '69e395760026407414c6';
const OLD_KEY = process.env.OLD_API_KEY;

const NEW_PROJECT = '6a257faa0031af0897bb';
const NEW_KEY = process.env.NEW_API_KEY;

const ENDPOINT = 'https://tor.cloud.appwrite.io/v1';

const oldClient = new appwrite.Client().setEndpoint(ENDPOINT).setProject(OLD_PROJECT).setKey(OLD_KEY);
const newClient = new appwrite.Client().setEndpoint(ENDPOINT).setProject(NEW_PROJECT).setKey(NEW_KEY);

const oldDb = new appwrite.Databases(oldClient);
const newDb = new appwrite.Databases(newClient);
const oldStorage = new appwrite.Storage(oldClient);
const newStorage = new appwrite.Storage(newClient);

const DB_ID = 'mindwellnessDB';
const BUCKET_ID = 'zenDownloads';

const COLLECTIONS = ['settings', 'pages', 'navigation', 'socials', 'blogs', 'contacts'];

async function migrateData() {
  console.log('Starting migration...');

  // 1. Migrate Storage Files
  console.log('Migrating files from zenDownloads...');
  try {
    const files = await oldStorage.listFiles(BUCKET_ID);
    for (const file of files.files) {
      console.log(`Migrating file: ${file.$id}`);
      try {
        const fileBuffer = await oldStorage.getFileDownload(BUCKET_ID, file.$id);
        
        // node-appwrite expects an InputFile object for file creation
        const { InputFile } = require('node-appwrite/file');
        
        // node-appwrite sdk 14+ uses InputFile.fromBuffer
        const inputFile = InputFile.fromBuffer(fileBuffer, file.name);
        
        await newStorage.createFile(BUCKET_ID, file.$id, inputFile);
        console.log(`Successfully migrated file: ${file.$id}`);
      } catch (e) {
        if (e.code === 409) {
          console.log(`File ${file.$id} already exists in new project.`);
        } else {
          console.error(`Failed to migrate file ${file.$id}:`, e.message);
        }
      }
    }
  } catch (e) {
    console.error('Failed to list files:', e.message);
  }

  // 2. Migrate Documents
  for (const collectionId of COLLECTIONS) {
    console.log(`Migrating collection: ${collectionId}...`);
    try {
      const docs = await oldDb.listDocuments(DB_ID, collectionId);
      for (const doc of docs.documents) {
        // Strip out internal appwrite fields
        const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...data } = doc;
        
        // Replace old project ID with new project ID in strings
        let dataString = JSON.stringify(data);
        dataString = dataString.replace(new RegExp(OLD_PROJECT, 'g'), NEW_PROJECT);
        const newData = JSON.parse(dataString);

        try {
          await newDb.createDocument(DB_ID, collectionId, $id, newData);
          console.log(`Migrated doc: ${collectionId}/${$id}`);
        } catch (e) {
          if (e.code === 409) {
            console.log(`Doc ${$id} already exists. Updating...`);
            await newDb.updateDocument(DB_ID, collectionId, $id, newData);
          } else {
            console.error(`Failed to migrate doc ${$id}:`, e.message);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to migrate collection ${collectionId}:`, e.message);
    }
  }

  console.log('Migration complete!');
}

migrateData();
