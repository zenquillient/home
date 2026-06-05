import styles from '@/app/page.module.css';
import { PlayCircle, ChevronRight } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import ReviewsCarousel from '@/components/ReviewsCarousel/ReviewsCarousel';
import ContactForm from '@/components/ContactForm/ContactForm';
import FAQ from '@/components/FAQ/FAQ';
import { PageContent, Review, NavVertical } from '@/lib/cms';

interface PageLayoutProps {
  pageData: PageContent;
  allReviews?: Review[];
  verticals: NavVertical[];
}

export default function PageLayout({ pageData, allReviews, verticals }: PageLayoutProps) {
  // On homepage use all-vertical reviews; on vertical pages use that page's reviews
  const reviews = (allReviews && allReviews.length > 0) ? allReviews : pageData.reviews;

  let embedUrl = '';
  if (pageData.videoLink) {
    let videoId = '';
    if (pageData.videoLink.includes('youtube.com/watch?v=')) {
      videoId = pageData.videoLink.split('v=')[1]?.split('&')[0];
    } else if (pageData.videoLink.includes('youtu.be/')) {
      videoId = pageData.videoLink.split('youtu.be/')[1]?.split('?')[0];
    }
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <>
      <HeroCarousel slides={pageData.images} />

      {/* Summary Section */}
      <section id="about" className={`section ${styles.summarySection}`}>
        <div className="container">
          <div className={`glass ${styles.summaryCard}`}>
            {pageData.videoLink ? (
              <div className={styles.videoGrid}>
                <div className={styles.videoText}>
                  <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '1rem' }}>{pageData.heading}</h2>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{pageData.paragraph}</p>


                </div>
                <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '4 / 1', width: '100%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(42,58,50,0.1)' }}>
                   {embedUrl ? (
                     <iframe src={embedUrl} title="YouTube video player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                   ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}>
                       <PlayCircle size={64} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                       <p style={{ fontWeight: '500' }}>Watch Introduction Video</p>
                       <a href={pageData.videoLink} target="_blank" rel="noreferrer" style={{ position: 'absolute', inset: 0, zIndex: 10 }}></a>
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <>
                <h2 className={styles.sectionTitle}>{pageData.heading}</h2>
                <p style={{ whiteSpace: 'pre-wrap' }}>{pageData.paragraph}</p>


              </>
            )}
          </div>
        </div>
      </section>

      {/* Reviews — auto-cycling carousel */}
      {reviews.length > 0 && (
        <section id="reviews" className="section">
          <div className="container">
            <h2 className={`${styles.sectionTitle} title-gradient`}>What Our Clients Say</h2>
            <ReviewsCarousel reviews={reviews} />
          </div>
        </section>
      )}

            <FAQ faqs={pageData.faqs || []} />

      {/* Contact Form Section */}
      <section id="contact" className={`section ${styles.contactSection}`}>
        <div className="container">
          <div className={`glass ${styles.contactWrapper}`}>
            <div className={styles.contactInfo}>
              <h2>Contact Us</h2>
              <p>Reach out to schedule your session or get more information. We aim to respond within 24 hours.</p>
            </div>
            <ContactForm verticals={verticals} />
          </div>
        </div>
      </section>
    </>
  );
}

