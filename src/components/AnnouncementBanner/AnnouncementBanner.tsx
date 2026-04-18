'use client';

import { useState, useEffect } from 'react';
import styles from './AnnouncementBanner.module.css';
import { X } from 'lucide-react';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState("Join our upcoming Mind Wellness Seminar this Friday! Click here to register.");

  // Later, we fetch the real announcement from Appwrite here
  /*
  useEffect(() => {
    // fetch from Appwrite settings collection
  }, []);
  */

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <p className={styles.text}>{content}</p>
      <button 
        className={styles.closeBtn} 
        onClick={() => setIsVisible(false)}
        aria-label="Close Announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
