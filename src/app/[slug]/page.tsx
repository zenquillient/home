import { getPageData, getDynamicPage, getVerticalNames } from '@/lib/cms';
import PageLayout from '@/components/PageLayout/PageLayout';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

// @ts-ignore
export default async function GenericPage({ params }) {
  const { slug } = await params;
  
  // First, check if this is a standalone dynamic page (e.g. Legal, About Us)
  const dynamicPage = await getDynamicPage(slug);
  
  if (dynamicPage) {
    return (
      <div className="section" style={{ paddingTop: '120px', minHeight: 'calc(100vh - 100px)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#FFFFFF', fontWeight: 500 }}>&larr; Back to Home</Link>
          <div className="glass" style={{ padding: '3rem', borderRadius: '16px' }}>
            <h1 className="title-gradient" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>{dynamicPage.title}</h1>
            
            {dynamicPage.image && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
                <Image src={dynamicPage.image} alt={dynamicPage.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 800px) 100vw, 800px" priority />
              </div>
            )}

            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--foreground)', lineHeight: '1.8' }}>
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
