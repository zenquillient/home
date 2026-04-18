'use client';

import { useState, useEffect, use } from 'react';
import styles from './page.module.css';
import { ChevronRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
// import { notFound } from 'next/navigation';

const verticalData: Record<string, any> = {
  'mindfulness': {
    title: 'Mindfulness Coaching',
    description: 'Discover peace and present-moment awareness through our premier mindfulness programs.',
    videoLink: 'https://youtube.com/watch?v=placeholder', // Mocked link
    slides: [
        { title: 'Breathe Deeply', subtitle: 'Learn the art of controlled breathing', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.4))' },
        { title: 'Daily Meditation', subtitle: 'Guided sessions every morning', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(16,185,129,0.4))' }
    ],
    reviews: [
        { text: "It changed how I view my mornings. So much clarity.", author: "James L." },
        { text: "The coaches are incredible listeners and guides.", author: "Amanda K." }
    ]
  },
  'retreats': {
    title: 'Wellness Retreats',
    description: 'Unplug and connect with nature at our immersive weekend and week-long retreats.',
    videoLink: 'https://youtube.com/watch?v=placeholder', // Mocked link
    slides: [
        { title: 'Nature Connection', subtitle: 'Immersive forest bathing', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(139,92,246,0.4))' },
        { title: 'Digital Detox', subtitle: 'Disconnect to reconnect', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(236,72,153,0.4))' }
    ],
    reviews: [
        { text: "The perfect escape from city life. I feel reborn.", author: "Chloe S." },
        { text: "Beautiful locations and life-changing workshops.", author: "Mark D." }
    ]
  },
  'corporate-wellness': {
    title: 'Corporate Wellness',
    description: 'Empower your teams to manage stress, avoid burnout, and improve overall productivity.',
    videoLink: 'https://youtube.com/watch?v=placeholder', // Mocked link
    slides: [
        { title: 'Team Building', subtitle: 'Fostering healthy communication', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(234,179,8,0.4))' },
        { title: 'Stress Management', subtitle: 'Tools for high-pressure environments', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.4))' }
    ],
    reviews: [
        { text: "Our staff retention drastically improved after introducing this program.", author: "HR Director, TechCorp" },
        { text: "Highly recommend their group seminars.", author: "CEO, Innovate Ltd." }
    ]
  },
  'personal-coaching': {
    title: 'Personal Coaching',
    description: 'One-on-one sessions tailored specifically to your unique mental health and wellness goals.',
    videoLink: 'https://youtube.com/watch?v=placeholder', // Mocked link
    slides: [
        { title: 'Tailored Plans', subtitle: 'Built around your schedule', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(244,63,94,0.4))' },
        { title: 'Deep Dives', subtitle: 'Explore personal blockers', img: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(16,185,129,0.4))' }
    ],
    reviews: [
        { text: "My coach helped me navigate a massive career transition smoothly.", author: "Nina W." },
        { text: "Invaluable advice and support.", author: "Robert T." }
    ]
  }
};

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const data = verticalData[slug];
//   if (!data) return notFound(); // For now, we fallback to a default if not fully typed

  const vertical = data || verticalData['mindfulness'];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % vertical.slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [vertical.slides.length]);

  return (
    <div className={styles.page}>
      {/* Service Hero / Carousel */}
      <section className={styles.hero}>
        {vertical.slides.map((slide: any, index: number) => (
          <div 
            key={index} 
            className={`${styles.slide} ${index === activeSlide ? styles.active : ''}`}
            style={{ background: slide.img }}
          >
            <div className={`container ${styles.heroContent}`}>
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Intro & Video */}
      <section className={`section ${styles.introSection}`}>
        <div className="container">
          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="title-gradient">{vertical.title}</h2>
              <p>{vertical.description}</p>
            </div>
            <div className={styles.videoCard}>
              <div className={`glass ${styles.videoPlaceholder}`}>
                <PlayCircle size={64} className={styles.playIcon} />
                <p>Watch Introduction Video</p>
                <a href={vertical.videoLink} target="_blank" rel="noreferrer" className={styles.videoLinkOverlay}></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className={`section ${styles.reviewsSection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What People Say</h2>
          <div className={styles.reviewsGrid}>
            {vertical.reviews.map((review: any, i: number) => (
              <div key={i} className={`glass ${styles.reviewCard}`}>
                 <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                 <p>"{review.text}"</p>
                 <h5>- {review.author}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section">
        <div className="container">
          <div className={`glass ${styles.contactWrapper}`}>
             <div className={styles.contactInfo}>
               <h2>Interested in {vertical.title}?</h2>
               <p>Send us a message and we'll get back to you with scheduling options and more information.</p>
             </div>
             <form className={styles.form}>
               <div className={styles.formGroup}>
                 <label>Name</label>
                 <input type="text" required />
               </div>
               <div className={styles.formGroup}>
                 <label>Email</label>
                 <input type="email" required />
               </div>
               <div className={styles.formGroup}>
                 <label>Message</label>
                 <textarea rows={4} required></textarea>
               </div>
               <button type="submit" className="btn btn-primary">Submit Inquiry</button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
}
