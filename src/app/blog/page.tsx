'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blog.module.css';
import { ArrowRight } from 'lucide-react';
import { databases, DB_ID, COL_BLOGS } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface Blog {
  $id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

export default function BlogListing() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    databases.listDocuments(DB_ID, COL_BLOGS, [Query.orderDesc('')])
      .then(res => {
        setBlogs(res.documents.map(d => ({
          $id: d.$id,
          title: d.title,
          content: d.content,
          date: d.date || new Date(d.$createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
          image: d.image
        })));
      })
      .catch(() => setError('Could not load blog posts. Please check Appwrite permissions.'))
      .finally(() => setLoading(false));
  }, []);

  const gradients = [
    'linear-gradient(135deg, rgba(49,82,62,0.1), rgba(107,142,35,0.1))',
    'linear-gradient(135deg, rgba(212,163,115,0.1), rgba(205,133,63,0.1))',
    'linear-gradient(135deg, rgba(218,165,32,0.1), rgba(49,82,62,0.1))',
    'linear-gradient(135deg, rgba(107,142,35,0.1), rgba(210,180,140,0.1))',
  ];

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className="title-gradient">Zenquillient Blog</h1>
        <p>Insights, stories, and guidance on your journey to inner peace.</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading articles...</div>
      ) : error ? (
        <div className={styles.loading} style={{ color: '#ef4444' }}>{error}</div>
      ) : blogs.length === 0 ? (
        <div className={styles.loading}>No blog posts yet. Add some from the Admin Panel!</div>
      ) : (
        <div className={styles.blogGrid}>
          {blogs.map((blog, idx) => (
            <div key={blog.$id} className={`glass ${styles.blogCard}`}>
              <div
                className={styles.cardImage}
                style={{ 
                  background: blog.image ? `url(${blog.image}) center/cover no-repeat` : gradients[idx % gradients.length]
                }}
              />
              <div className={styles.cardContent}>
                <span className={styles.date}>{blog.date}</span>
                <h3>{blog.title}</h3>
                <Link href={`/blog/${blog.$id}`} className={styles.readMore}>
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
