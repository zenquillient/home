'use client';

import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';
import { ID } from 'appwrite';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Assuming Appwrite is fully set up, this will authenticate
      // await account.createEmailPasswordSession(email, password);
      console.log('Logging in...', email);
      
      // MOCK LOGIN FOR NOW (since no Appwrite DB is set up yet by user)
      setTimeout(() => {
          router.push('/admin/dashboard');
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your Appwrite configuration.');
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.loginContainer}`}>
      <div className={`glass ${styles.loginCard}`}>
        <h2 className="title-gradient">Admin Portal</h2>
        <p>Login to manage content</p>
        
        {error && <div className={styles.errorBanner}>{error}</div>}
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
