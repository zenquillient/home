const appwrite = require('node-appwrite');

async function runSetup() {
  const endpoint = process.env.APPWRITE_ENDPOINT; // e.g., 'https://cloud.appwrite.io/v1'
  const projectId = process.env.APPWRITE_PROJECT; // Your Project ID
  const apiKey = process.env.APPWRITE_API_KEY;    // Server API Key holding target scopes

  if (!endpoint || !projectId || !apiKey) {
    console.error('Missing required environment variables (APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY).');
    process.exit(1);
  }

  const client = new appwrite.Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const databases = new appwrite.Databases(client);
  const DB_ID = 'mindwellnessDB'; // Preferred Custom ID

  try {
    // 1. Create Database
    console.log(`Creating Database: ${DB_ID}...`);
    try {
      await databases.create(DB_ID, 'MindWellness CMS');
      console.log('Database created.');
    } catch (err) {
      if (err.code === 409) console.log('Database already exists. Skipping...');
      else throw err;
    }

    // 2. Collections Setup Array with Attributes
    const cmsCollections = [
      { 
        id: 'settings', 
        name: 'Layout Overrides',
        attributes: [
          { key: 'content', size: 65535, required: false }
        ]
      },
      { 
        id: 'pages', 
        name: 'Dynamic Web Pages',
        attributes: [
          { key: 'slug', size: 255, required: false },
          { key: 'title', size: 255, required: false },
          { key: 'content', size: 65535, required: false }
        ]
      },
      { 
        id: 'navigation', 
        name: 'Navigation Quicklinks',
        attributes: [
          { key: 'quickLinks', size: 65535, required: false },
          { key: 'legal', size: 65535, required: false }
        ]
      },
      { 
        id: 'socials', 
        name: 'Footer Social Networks',
        attributes: [
          { key: 'platform', size: 255, required: false },
          { key: 'url', size: 2048, required: false },
          { key: 'abbreviation', size: 50, required: false }
        ]
      },
      { 
        id: 'blogs', 
        name: 'Manage Blogs',
        attributes: [
          { key: 'title', size: 255, required: false },
          { key: 'content', size: 65535, required: false },
          { key: 'date', size: 100, required: false }
        ]
      },
      { 
        id: 'contacts', 
        name: 'Customer Submissions',
        attributes: [
          { key: 'name', size: 255, required: false },
          { key: 'email', size: 255, required: false },
          { key: 'phone', size: 50, required: false },
          { key: 'type', size: 255, required: false }
        ]
      }
    ];

    for (const col of cmsCollections) {
      console.log(`Ensuring Collection: ${col.id}...`);
      try {
        await databases.createCollection(DB_ID, col.id, col.name);
        console.log(`Collection ${col.id} created successfully.`);
      } catch (err) {
        if (err.code === 409) console.log(`Collection ${col.id} already exists.`);
        else throw err;
      }

      // Add Attributes
      for (const attr of col.attributes) {
        try {
          await databases.createStringAttribute(DB_ID, col.id, attr.key, attr.size, attr.required);
          console.log(`   - Attached Attribute: [${attr.key}]`);
        } catch(err) {
          if (err.code === 409) console.log(`   - Attribute [${attr.key}] already exists.`);
          else if (err.code === 400 && err.message.includes("processing")) console.log(`   - Attribute [${attr.key}] processing or locked.`);
          else console.error(`   - Error on Attribute [${attr.key}]:`, err.message);
        }
      }
    }

    console.log('==============================================');
    console.log('APPWRITE DATABASES AND ATTRIBUTES PROVISIONED FULLY.');
    console.log('You can securely run your Admin Dashboard now!');

  } catch (error) {
    console.error('Fatal initialization error:', error.message);
  }
}

runSetup();
