import { databases, COL_SETTINGS, COL_NAVIGATION, COL_SOCIALS, DB_ID } from './appwrite';
import { Query } from 'appwrite';
import { VERTICALS } from './config';

export interface NavVertical { id: string; name: string; subtitle?: string; href: string; img?: string; buttonText?: string; buttonLink?: string; }

export interface Review { text: string; author: string; source?: string; img?: string; }

export const getVerticalNames = async (): Promise<NavVertical[]> => {
  const results: NavVertical[] = [];
  for (const v of VERTICALS) {
    try {
      const doc = await databases.getDocument(DB_ID, COL_SETTINGS, v.id);
      if (doc.content) {
        const parsed = JSON.parse(doc.content);
        results.push({
          id: v.id,
          name: parsed.title || v.name,
          subtitle: parsed.subtitle || '',
          href: v.href,
          img: parsed.images?.[0]?.img || '',
          buttonText: parsed.buttonText || '',
          buttonLink: parsed.buttonLink || ''
        });
        continue;
      }
    } catch (_) { /* not saved yet, use default */ }
    results.push({ id: v.id, name: v.name, href: v.href, img: '' });
  }
  return results;
};


export const getAllReviews = async (): Promise<Review[]> => {
  const all: Review[] = [];
  for (const v of VERTICALS) {
    try {
      const doc = await databases.getDocument(DB_ID, COL_SETTINGS, v.id);
      if (doc.content) {
        const parsed = JSON.parse(doc.content);
        const verticalName = parsed.title || v.name;
        if (Array.isArray(parsed.reviews)) {
          parsed.reviews.forEach((r: { text: string; author: string; img?: string }) => {
            if (r.text && r.author) {
              all.push({ text: r.text, author: r.author, source: verticalName, img: r.img });
            }
          });
        }
      }
    } catch (_) { /* vertical not saved yet */ }
  }
  return all;
};


export interface PageContent {
  title: string;
  heading: string;
  paragraph: string;
  videoLink?: string;
  images: { title: string; subtitle: string; img: string; href?: string; }[];
  reviews: { text: string; author: string; img?: string; }[];
  faqs?: { question: string; answer: string }[];
}

export interface DynamicPage {
  slug: string;
  title: string;
  content: string;
  image?: string;
}

export const getDynamicPage = async (slug: string): Promise<DynamicPage | null> => {
  try {
    const docs = await databases.listDocuments(DB_ID, 'pages', [
      Query.equal('slug', slug)
    ]);
    if (docs.documents.length > 0) {
      return {
        slug: docs.documents[0].slug,
        title: docs.documents[0].title,
        content: docs.documents[0].content,
        image: docs.documents[0].image
      };
    }
  } catch (error) {
    console.warn('Dynamic page fetch error:', error);
  }
  return null;
};

export const getPageData = async (slug: string): Promise<PageContent> => {
  try {
    const doc = await databases.getDocument(DB_ID, COL_SETTINGS, slug);
    if (doc.content) {
      const parsed = JSON.parse(doc.content);
      const verticalIndex = VERTICALS.findIndex(v => v.id === slug);
      if (parsed.images && parsed.images.length > 0) {
        const fallbackSubtitles = [
          "Guided mindfulness practices tailored for you.",
          "Transform your team's mental health.",
          "1-on-1 guidance to navigate life's challenges.",
          "Embrace a balanced lifestyle."
        ];
        
        parsed.images.forEach((imgObj: any) => {
          if (verticalIndex !== -1 && imgObj.subtitle === undefined) {
            imgObj.subtitle = fallbackSubtitles[verticalIndex];
          }
          imgObj.buttonText = parsed.buttonText;
          imgObj.buttonLink = parsed.buttonLink;
          imgObj.title = parsed.title || imgObj.title;
        });
      }
      return parsed;
    }
  } catch (error) {
    console.warn(`CMS Fetch Error for ${slug}, using fallback data.`);
  }

  // Fallbacks
  const isHome = slug === 'home';
  const vertical = VERTICALS.find(v => v.id === slug);
  const verticalIndex = VERTICALS.findIndex(v => v.id === slug);
  const displayTitle = isHome ? 'Zenquillient' : (vertical?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  
  const fallbackSubtitles = [
    "Guided mindfulness practices tailored for you.",
    "Transform your team's mental health.",
    "1-on-1 guidance to navigate life's challenges.",
    "Embrace a balanced lifestyle."
  ];
  const verticalSubtitle = verticalIndex !== -1 ? fallbackSubtitles[verticalIndex] : "Discover our specialized paths.";
  
  return {
    title: displayTitle,
    heading: isHome ? "A Holistic Approach to Mind Wellness" : `Welcome to ${displayTitle}`,
    paragraph: "In today's fast-paced world, finding a moment of clarity can be challenging. Our suite of mindfulness paths—from guided meditation retreats to personalized cognitive coaching—is designed to help you reconnect with your authentic self. We blend ancient wisdom with modern psychological insights.",
    images: isHome && VERTICALS.length >= 4 ? [
      { title: VERTICALS[0].name, subtitle: fallbackSubtitles[0], img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.3))", href: VERTICALS[0].href },
      { title: VERTICALS[1].name, subtitle: fallbackSubtitles[1], img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(139,92,246,0.3))", href: VERTICALS[1].href },
      { title: VERTICALS[2].name, subtitle: fallbackSubtitles[2], img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(16,185,129,0.3))", href: VERTICALS[2].href },
      { title: VERTICALS[3].name, subtitle: fallbackSubtitles[3], img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(245,158,11,0.3))", href: VERTICALS[3].href }
    ] : [
      { title: displayTitle, subtitle: verticalSubtitle, img: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.3))" }
    ],
    videoLink: '',
    reviews: [],
    faqs: []
  };
};

export const getNavigationLinks = async () => {
  let legalLinks: { name: string, href: string }[] = [];

  try {
    const pagesList = await databases.listDocuments(DB_ID, 'pages');
    if (pagesList.documents.length > 0) {
      legalLinks = pagesList.documents.map(p => ({
        name: p.title,
        href: `/${p.slug}`
      }));
    }
  } catch (error) {
    console.warn('Navigation Fetch Error fallback invoked');
  }

  return {
    quickLinks: [], // Obsolete
    legal: legalLinks
  };
};

export const getSocialLinks = async () => {
  try {
    const socDoc = await databases.listDocuments(DB_ID, COL_SOCIALS);
    if(socDoc.documents.length > 0) {
      const order = ['facebook', 'linkedin', 'twitter', 'instagram', 'youtube', 'google'];
      const docs = socDoc.documents.map(doc => ({ id: doc.$id, platform: doc.platform, url: doc.url, abbreviation: doc.abbreviation }));
      return docs.sort((a, b) => {
        let ia = order.indexOf(a.id);
        let ib = order.indexOf(b.id);
        if (ia === -1) ia = 999;
        if (ib === -1) ib = 999;
        return ia - ib;
      });
    }
  } catch (error) {
     console.warn('Socials Fetch Error fallback invoked');
  }

  return [
    { platform: 'Facebook', url: '#', abbreviation: 'FB' },
    { platform: 'Twitter', url: '#', abbreviation: 'TW' },
    { platform: 'Instagram', url: '#', abbreviation: 'IG' },
    { platform: 'LinkedIn', url: '#', abbreviation: 'IN' },
    { platform: 'YouTube', url: '#', abbreviation: 'YT' },
    { platform: 'Google', url: '#', abbreviation: 'GO' }
  ];
};

export const getSiteConfig = async () => {
  try {
    const doc = await databases.getDocument(DB_ID, 'settings', 'home');
    if (doc.content) {
      const parsed = JSON.parse(doc.content);
      return { logoUrl: parsed.logoUrl || null };
    }
  } catch(err) { }
  return { logoUrl: null };
};


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
