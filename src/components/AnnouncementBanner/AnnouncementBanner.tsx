'use client';

import { useState, useEffect } from 'react';
import styles from './AnnouncementBanner.module.css';
import { X } from 'lucide-react';
import { databases, DB_ID, COL_SETTINGS } from '@/lib/appwrite';

interface AnnouncementConfig {
  text: string;
  link: string;
  status: string;
}

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<AnnouncementConfig | null>(null);

  useEffect(() => {
    databases.getDocument(DB_ID, COL_SETTINGS, 'announcement')
      .then(doc => {
        if (doc.content) {
          const parsed: AnnouncementConfig = JSON.parse(doc.content);
          // Only show if status is active
          if (parsed.status === 'active' && parsed.text) {
            setConfig(parsed);
            setIsVisible(true);
          }
        }
      })
      .catch(() => {
        // No announcement saved yet — stay hidden
      });
  }, []);

  if (!isVisible || !config) return null;

  const hasLink = config.link && config.link.startsWith('http');

  return (
    <div className={styles.banner}>
      {hasLink ? (
        <a
          href={config.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.text}
          style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          {config.text}
        </a>
      ) : (
        <p className={styles.text}>{config.text}</p>
      )}
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

