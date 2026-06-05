'use client';

import { useState, useEffect } from 'react';
import styles from './HeroCarousel.module.css';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
  title: string;
  subtitle: string;
  img: string;
  href?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showTitles, setShowTitles] = useState(true);

  useEffect(() => {
    import('@/lib/appwrite').then(({ databases, DB_ID, COL_SETTINGS }) => {
      databases.getDocument(DB_ID, COL_SETTINGS, 'mindfulness')
        .then(doc => {
          if (doc.content) {
            const p = JSON.parse(doc.content);
            if (p.showCarouselTitles !== undefined) setShowTitles(p.showCarouselTitles);
          }
        })
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, activeSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStart(null);
  };

  const handleNext = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      className={styles.hero}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
          const isUrl = slide.img.startsWith('http');
          return (
            <div
              key={index}
              className={`${styles.slide} ${index === activeSlide ? styles.active : ''}`}
            >
              {isUrl ? (
                <Image 
                  src={slide.img} 
                  alt={slide.title} 
                  fill 
                  style={{ objectFit: 'cover', objectPosition: 'center' }} 
                  priority={index === 0}
                  sizes="100vw"
                  quality={75}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: slide.img }} />
              )}
              <div className={`container ${styles.heroContent}`} style={{ position: 'relative', zIndex: 10, display: showTitles ? 'block' : 'none' }}>
                <h1 className="title-gradient" style={{ color: "var(--foreground)" }}>{slide.title}</h1>
                <p style={{ color: "var(--foreground)" }}>{slide.subtitle}</p>
                {slide.buttonLink ? (
                  <Link href={slide.buttonLink} className="btn btn-primary">
                    {slide.buttonText || "Learn More"} <ChevronRight size={18} />
                  </Link>
                ) : (
                  <Link href={slide.href || "#"} className="btn btn-primary" style={{ display: slide.href ? "inline-flex" : "none" }}>
                    Learn More <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}


      {slides.length > 1 && (
        <>
          <button className={styles.arrowLeft} onClick={handlePrev} aria-label="Previous Slide">
            <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button className={styles.arrowRight} onClick={handleNext} aria-label="Next Slide">
            <ChevronRight size={24} />
          </button>


        </>
      )}
    </section>
  );
}
