'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../blog.module.css';
import { ArrowLeft, MessageSquare, Tag, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { databases, DB_ID, COL_BLOGS } from '@/lib/appwrite';

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  
    useEffect(() => {
    // Slug is actually the document $id from the listing page
    databases.getDocument(DB_ID, COL_BLOGS, slug)
      .then(d => {
        setBlog({
          title: d.title,
          content: d.content,
          date: d.date || new Date(d.$createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
          image: d.image,
          tags: d.tags || ''
        });
      })
      .catch((err) => {
        console.error("Failed to load blog", err);
        setError('Article not found or could not be loaded.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className={`container ${styles.page}`}><div className={styles.loading}>Loading article...</div></div>;
  }

  if (error || !blog) {
    return <div className={`container ${styles.page}`}><h1>{error || 'Article not found'}</h1></div>;
  }

  const defaultGradient = 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2))';

  return (
    <article className={styles.articlePage}>
      <div className={styles.articleHero} style={{ position: 'relative', overflow: 'hidden', background: defaultGradient, aspectRatio: '4/1', padding: 0 }}>
        {blog.image && (
          <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover', zIndex: 0 }} priority sizes="100vw" />
        )}
        <div style={{ position: 'absolute', zIndex: 1, top: '1rem', left: '1rem', right: '1rem', bottom: '1rem', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <Link href="/blog" className={styles.backLink} style={{ margin: 0 }}>
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </div>
          <div className={styles.heroText} style={{ position: 'absolute', bottom: 0, left: 0, margin: 0, padding: 0 }}>
            <span className={styles.date} style={{ display: 'block', marginBottom: '0.25rem' }}>{blog.date}</span>
            <h1 className={styles.articleTitle} style={{ margin: 0, fontSize: 'clamp(1.25rem, 3.5vw, 2rem)' }}>{blog.title}</h1>
          </div>
        </div>
      </div>
      
      <div className={`container ${styles.articleContainer}`}>
        <div className={styles.contentBody}>
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      
        {/* Tags Section */}
        {blog.tags && (
          <div style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Tag size={16} style={{ color: '#FFFFFF', marginRight: '0.5rem', alignSelf: 'center' }} />
            {blog.tags.split(',').map((tag: string, i: number) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', padding: '0.2rem 0.8rem', borderRadius: '16px', fontSize: '0.85rem' }}>#{tag.trim()}</span>
            ))}
          </div>
        )}

        
      </div>
    </article>
  );
}
