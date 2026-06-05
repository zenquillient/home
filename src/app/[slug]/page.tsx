import { getPageData, getDynamicPage, getVerticalNames } from '@/lib/cms';
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
    if (dynamicPage.slug === 'about-me') {
      const defaultGradient = 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2))';
      return (
        <article className={blogStyles.articlePage}>
          <div className={blogStyles.articleHero} style={{ position: 'relative', overflow: 'hidden', background: defaultGradient, aspectRatio: '4/3', display: 'flex', alignItems: 'center' }}>
            {dynamicPage.image && dynamicPage.image !== "null" && (
              <img src={dynamicPage.image} alt={dynamicPage.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
            )}
            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
              <div className="container">
                <Link href="/" className={blogStyles.backLink}>
                  <ArrowLeft size={16} /> Back to Home
                </Link>
                <div className={blogStyles.heroText}>
                  <h1 className={blogStyles.articleTitle}>{dynamicPage.title}</h1>
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

    return (
      <div className="section" style={{ paddingTop: '120px', minHeight: 'calc(100vh - 100px)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#FFFFFF', fontWeight: 500 }}>&larr; Back to Home</Link>
          <div className="glass" style={{ padding: '3rem', borderRadius: '16px' }}>
            <h1 className="title-gradient" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>{dynamicPage.title}</h1>
            
            {dynamicPage.image && dynamicPage.image !== "null" && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
                <img src={dynamicPage.image} alt={dynamicPage.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ whiteSpace: 'pre-wrap', color: '#FFFFFF', lineHeight: '1.8' }}>
              {dynamicPage.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not a standalone page, treat it as a Vertical and use the Hero+Forms layout
  const pageData = await getPageData(slug);
  const verticals = await getVerticalNames();

  return (
    <PageLayout pageData={pageData} verticals={verticals} />
  );
}
