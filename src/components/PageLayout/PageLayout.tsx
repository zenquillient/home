import styles from '@/app/page.module.css';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import { PageContent } from '@/lib/cms';

export default function PageLayout({ pageData }: { pageData: PageContent }) {
  return (
    <>
      <HeroCarousel slides={pageData.images} />

      {/* Summary Section */}
      <section id="about" className={`section ${styles.summarySection}`}>
        <div className="container">
          <div className={`glass ${styles.summaryCard}`}>
            <h2 className={styles.sectionTitle}>{pageData.heading}</h2>
            <p>{pageData.paragraph}</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section">
        <div className="container">
          <h2 className={styles.sectionTitle}>Customer Reviews</h2>
          <div className={styles.reviewsGrid}>
            {pageData.reviews.map((review, i) => (
              <div key={i} className={`glass ${styles.reviewCard}`}>
                <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                <p>"{review.text}"</p>
                <h5>- {review.author}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className={`section ${styles.contactSection}`}>
        <div className="container">
          <div className={`glass ${styles.contactWrapper}`}>
            <div className={styles.contactInfo}>
              <h2>Contact Us</h2>
              <p>Reach out to schedule your session or get more information. We aim to respond within 24 hours.</p>
            </div>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" required placeholder="John Doe" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" required placeholder="john@example.com" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select id="countryCode" style={{ flex: '0 0 100px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem' }}>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+61">+61 (AU)</option>
                  </select>
                  <input type="tel" id="phone" required placeholder="123 456 7890" style={{ flex: 1 }} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Who are you enquiring for?</label>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="enquiringFor" value="myself" defaultChecked /> Myself
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="enquiringFor" value="organisation" /> Organisation
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Type of Enquiry</label>
                <select 
                  name="enquiryType" 
                  defaultValue="services"
                  style={{ 
                    backgroundColor: 'rgba(0,0,0,0.3)', 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px', 
                    padding: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="services">Services</option>
                  <option value="pricing">Pricing</option>
                  <option value="vertical1">Vertical 1</option>
                  <option value="vertical2">Vertical 2</option>
                  <option value="vertical3">Vertical 3</option>
                  <option value="vertical4">Vertical 4</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Any additional details?</label>
                <textarea id="message" rows={4} required placeholder="Tell us about what you are looking for..." />
              </div>
              <button type="submit" className="btn btn-accent">Send Request</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
