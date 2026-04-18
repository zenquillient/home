'use client';

import { useState, useEffect } from 'react';
import styles from './HeroCarousel.module.css';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  title: string;
  subtitle: string;
  img: string;
  href?: string;
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`${styles.slide} ${index === activeSlide ? styles.active : ''}`}
          style={{ background: slide.img }}
        >
          <div className={`container ${styles.heroContent}`}>
            <h1 className="title-gradient">{slide.title}</h1>
            <p>{slide.subtitle}</p>
            {slide.href ? (
              <Link href={slide.href} className="btn btn-primary">
                Learn More <ChevronRight size={18} />
              </Link>
            ) : (
              <button className="btn btn-primary">
                Learn More <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button className={styles.arrowLeft} onClick={handlePrev} aria-label="Previous Slide">
            <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button className={styles.arrowRight} onClick={handleNext} aria-label="Next Slide">
            <ChevronRight size={24} />
          </button>

          <div className={styles.carouselIndicators}>
            {slides.map((_, index) => (
              <button 
                key={index} 
                className={`${styles.indicator} ${index === activeSlide ? styles.activeIndicator : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
