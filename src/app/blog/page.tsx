'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './blog.module.css';
import { ArrowRight } from 'lucide-react';
// import { databases, DB_ID, COL_BLOGS } from '@/lib/appwrite';

export default function BlogListing() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In the future, fetch from Appwrite Database
    // databases.listDocuments(DB_ID, COL_BLOGS).then(...)
    
    // Mock Data for now
    setTimeout(() => {
      setBlogs([
        { id: '1', slug: 'benefits-of-daily-meditation', title: 'The Top 5 Benefits of Daily Meditation', short_desc: 'Discover how taking just 10 minutes a day can restructure your brain and lower stress levels.', image: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2))', date: 'Oct 12, 2026' },
        { id: '2', slug: 'avoiding-burnout-at-work', title: 'Strategies for Avoiding Burnout at Work', short_desc: 'Practical tools to maintain your energy and enthusiasm in high-pressure corporate environments.', image: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(2ec,72,153,0.2))', date: 'Oct 08, 2026' },
        { id: '3', slug: 'finding-peace-in-nature', title: 'Why Nature Retreats Reset the Mind', short_desc: 'We explore the psychological benefits of unplugging and spending active time in nature.', image: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(59,130,246,0.2))', date: 'Oct 01, 2026' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className="title-gradient">Mind Wellness Blog</h1>
        <p>Insights, stories, and guidance on your journey to inner peace.</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading articles...</div>
      ) : (
        <div className={styles.blogGrid}>
          {blogs.map((blog) => (
            <div key={blog.id} className={`glass ${styles.blogCard}`}>
              <div 
                className={styles.cardImage} 
                style={{ background: blog.image }}
              ></div>
              <div className={styles.cardContent}>
                <span className={styles.date}>{blog.date}</span>
                <h3>{blog.title}</h3>
                <p>{blog.short_desc}</p>
                <Link href={`/blog/${blog.slug}`} className={styles.readMore}>
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
