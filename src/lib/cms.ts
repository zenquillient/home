import { databases, COL_SETTINGS, COL_NAVIGATION, COL_SOCIALS, DB_ID } from './appwrite';
import { VERTICALS } from './config';

export interface PageContent {
  title: string;
  heading: string;
  paragraph: string;
  images: { title: string; subtitle: string; img: string; href?: string; }[];
  reviews: { text: string; author: string }[];
}

export const getPageData = async (slug: string): Promise<PageContent> => {
  try {
    const doc = await databases.getDocument(DB_ID, COL_SETTINGS, slug);
    if (doc.content) return JSON.parse(doc.content);
  } catch (error) {
    console.warn(`CMS Fetch Error for ${slug}, using fallback data.`);
  }

  // Fallbacks
  const isHome = slug === 'home';
  const vertical = VERTICALS.find(v => v.id === slug);
  const displayTitle = isHome ? 'Zenquillient' : (vertical?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  
  return {
    title: displayTitle,
    heading: isHome ? "A Holistic Approach to Mind Wellness" : `Welcome to ${displayTitle}`,
    paragraph: "In today's fast-paced world, finding a moment of clarity can be challenging. Our suite of mindfulness paths—from guided meditation retreats to personalized cognitive coaching—is designed to help you reconnect with your authentic self. We blend ancient wisdom with modern psychological insights.",
    images: isHome && VERTICALS.length >= 4 ? [
      { title: VERTICALS[0].name, subtitle: "Guided mindfulness practices tailored for you.", img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.3))", href: VERTICALS[0].href },
      { title: VERTICALS[1].name, subtitle: "Transform your team's mental health.", img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(139,92,246,0.3))", href: VERTICALS[1].href },
      { title: VERTICALS[2].name, subtitle: "1-on-1 guidance to navigate life's challenges.", img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(16,185,129,0.3))", href: VERTICALS[2].href },
      { title: VERTICALS[3].name, subtitle: "Embrace a balanced lifestyle.", img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(245,158,11,0.3))", href: VERTICALS[3].href }
    ] : [
      { title: displayTitle, subtitle: "Discover our specialized paths.", img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.3))" }
    ],
    reviews: []
  };
};

export const getNavigationLinks = async () => {
  try {
    const navDoc = await databases.listDocuments(DB_ID, COL_NAVIGATION);
    if(navDoc.documents.length > 0) {
       const mappedDoc = navDoc.documents[0];
       return {
         quickLinks: JSON.parse(mappedDoc.quickLinks),
         legal: JSON.parse(mappedDoc.legal)
       };
    }
  } catch (error) {
     console.warn('Navigation Fetch Error fallback invoked');
  }

  return {
    quickLinks: [
      { name: 'Mindfulness', href: '/services/mindfulness' },
      { name: 'Retreats', href: '/services/retreats' },
      { name: 'Blog', href: '/blog' },
      { name: 'About Us', href: '/about' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/refunds' }
    ]
  };
};

export const getSocialLinks = async () => {
  try {
    const socDoc = await databases.listDocuments(DB_ID, COL_SOCIALS);
    if(socDoc.documents.length > 0) {
      return socDoc.documents.map(doc => ({ platform: doc.platform, url: doc.url, abbreviation: doc.abbreviation }));
    }
  } catch (error) {
     console.warn('Socials Fetch Error fallback invoked');
  }

  return [
    { platform: 'Facebook', url: '#', abbreviation: 'FB' },
    { platform: 'Twitter', url: '#', abbreviation: 'TW' },
    { platform: 'Instagram', url: '#', abbreviation: 'IG' },
    { platform: 'LinkedIn', url: '#', abbreviation: 'IN' },
    { platform: 'YouTube', url: '#', abbreviation: 'YT' }
  ];
};
