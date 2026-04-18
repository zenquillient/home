'use client';

import { useState, useEffect } from 'react';
import styles from './LeadGenPopup.module.css';
import { X, CheckCircle } from 'lucide-react';
// import { databases, COL_LEADS, DB_ID } from '@/lib/appwrite';
// import { ID } from 'appwrite';

export default function LeadGenPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show if not previously dismissed (in a real app, use localStorage)
    if (isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // 15 seconds delay

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      /*
      await databases.createDocument(DB_ID, COL_LEADS, ID.unique(), {
        email: email,
        source: 'Mindfulness Test PDF',
        created_at: new Date().toISOString()
      });
      */
      console.log('Lead captured:', email);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsDismissed(true);
      }, 3000);
    } catch (error) {
      console.error('Failed to capture lead', error);
    }
  };

  const closePopup = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={`glass ${styles.popup}`}>
        <button 
          className={styles.closeBtn} 
          onClick={closePopup}
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div className={styles.content}>
            <h2 className="title-gradient">Discover Your Zenquillient Score</h2>
            <p>
              Take our free comprehensive Mindfulness Test. Enter your email below, and we'll instantly send you the PDF guide customized to your results.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                required 
                className={styles.input}
              />
              <button type="submit" className="btn btn-accent">
                Send Me The PDF
              </button>
            </form>
            <p className={styles.disclaimer}>We respect your inbox. No spam, ever.</p>
          </div>
        ) : (
          <div className={`${styles.content} ${styles.success}`}>
            <CheckCircle size={48} color="var(--success)" />
            <h2>Thank You!</h2>
            <p>Your Mindfulness Test PDF is on its way to your inbox.</p>
          </div>
        )}
      </div>
    </div>
  );
}
