import { getPageData, getDynamicPage, getVerticalNames, getGlobalSettings } from '@/lib/cms';
import PageLayout from '@/components/PageLayout/PageLayout';
import Link from 'next/link';
import Image from 'next/image';
import blogStyles from '../blog/blog.module.css';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

// @ts-ignore
export default async function GenericPage({ params }) {
  const { slug } = await params;
  
  // First, check if this is a standalone dynamic page (e.g. Legal, About Us)
  const dynamicPage = await getDynamicPage(slug);
  
  if (dynamicPage) {
    const defaultGradient = 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2))';
    return (
      <article className={blogStyles.articlePage}>
        <div className={blogStyles.articleHero} style={{ position: 'relative', overflow: 'hidden', background: defaultGradient, aspectRatio: '4/1', padding: 0 }}>
          {dynamicPage.image && dynamicPage.image !== "null" && (
            <img src={dynamicPage.image} alt={dynamicPage.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          )}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
            <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem 1rem' }}>
              <div>
                <Link href="/" className={blogStyles.backLink} style={{ margin: 0 }}>
                  <ArrowLeft size={16} /> Back to Home
                </Link>
              </div>
              <div className={blogStyles.heroText} style={{ marginTop: 0, paddingBottom: '1rem' }}>
                <h1 className={blogStyles.articleTitle} style={{ margin: 0 }}>{dynamicPage.title}</h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`container ${blogStyles.articleContainer}`}>
          <div className={blogStyles.contentBody}>
            <div style={{ whiteSpace: 'pre-wrap', color: '#FFFFFF', lineHeight: '1.8', fontSize: '1.1rem' }}>
              {dynamicPage.content}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // If not a standalone page, treat it as a Vertical and use the Hero+Forms layout
  const pageData = await getPageData(slug);
  const verticals = await getVerticalNames();
  const globalSettings = await getGlobalSettings();

  return (
    <PageLayout pageData={pageData} verticals={verticals} globalSettings={globalSettings} />
  );
}
