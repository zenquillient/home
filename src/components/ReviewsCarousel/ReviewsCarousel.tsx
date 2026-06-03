'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './ReviewsCarousel.module.css';
import type { Review } from '@/lib/cms';

interface Props {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: Props) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  }, []);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      go((current + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [current, reviews.length, go]);

  if (!reviews.length) return null;

  const review = reviews[current];

  return (
    <div className={styles.wrapper}>
      <div className={`glass ${styles.card} ${animating ? styles.fade : ''}`}>
        <p className={styles.text}>"{review.text}"</p>
        <div className={styles.author} style={{ display: 'flex', alignItems: 'center' }}>
          {review.img && (
            <img src={review.img} alt={review.author} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className={styles.name}>— {review.author}</span>
            {review.source && <span className={styles.source}>{review.source}</span>}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {reviews.length > 1 && (
        <div className={styles.dots}>
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
              onClick={() => go(i)}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
