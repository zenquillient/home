import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy-project-id';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export default client;

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'mindwellnessDB';
export const COL_SETTINGS = 'settings';
export const COL_BLOGS = 'blogs';
export const COL_REVIEWS = 'reviews';
export const COL_CONTACTS = 'contacts';
export const COL_PAGES = 'pages';
export const COL_NAVIGATION = 'navigation';
export const COL_SOCIALS = 'socials';
