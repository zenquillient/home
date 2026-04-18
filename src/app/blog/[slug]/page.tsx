'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import styles from '../blog.module.css';
import { ArrowLeft } from 'lucide-react';
// import { databases, DB_ID, COL_BLOGS } from '@/lib/appwrite';
// import { Query } from 'appwrite';

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In the future, fetch specific document by slug
    // databases.listDocuments(DB_ID, COL_BLOGS, [Query.equal('slug', slug)])
    
    // Mock Data
    setTimeout(() => {
      setBlog({
        title: 'The Top 5 Benefits of Daily Meditation',
        image: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2))',
        date: 'Oct 12, 2026',
        content: `
          <p>Meditation is an ancient practice that has found a vital place in modern wellness routines. While it might seem like simply sitting still, the physiological and psychological benefits are profound and scientifically backed.</p>
          <h2>1. Reduces Stress</h2>
          <p>The most common reason people try meditation is stress reduction. Studies have shown that meditation decreases the inflammation-promoting chemicals called cytokines, which are released in response to stress.</p>
          <h2>2. Controls Anxiety</h2>
          <p>Less stress translates to less anxiety. A regular meditation habit helps decrease anxiety and improve stress reactivity and coping skills.</p>
          <h2>3. Promotes Emotional Health</h2>
          <p>Some forms of meditation can lead to an improved self-image and a more positive outlook on life. It can decrease depression by decreasing inflammatory chemicals.</p>
          <h2>4. Enhances Self-Awareness</h2>
          <p>Meditation helps you develop a stronger understanding of yourself, helping you grow into your best self. It teaches you to recognize thoughts that may be harmful or self-defeating.</p>
          <h2>5. Lengthens Attention Span</h2>
          <p>Think of it as weight lifting for your attention span. It helps increase the strength and endurance of your attention.</p>
        `
      });
      setLoading(false);
    }, 800);
  }, [slug]);

  if (loading) {
    return <div className={`container ${styles.page}`}><div className={styles.loading}>Loading article...</div></div>;
  }

  if (!blog) {
    return <div className={`container ${styles.page}`}><h1>Article not found</h1></div>;
  }

  return (
    <article className={styles.articlePage}>
      <div 
        className={styles.articleHero}
        style={{ background: blog.image }}
      >
        <div className="container">
          <Link href="/blog" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <div className={styles.heroText}>
            <span className={styles.date}>{blog.date}</span>
            <h1 className={styles.articleTitle}>{blog.title}</h1>
          </div>
        </div>
      </div>
      
      <div className={`container ${styles.articleContainer}`}>
        <div 
          className={styles.contentBody}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </article>
  );
}
