'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import type { NavVertical } from '@/lib/cms';

interface NavbarProps {
  verticals: NavVertical[];
  logoUrl?: string | null;
}

export default function Navbar({ verticals, logoUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    ...verticals.map(v => ({ name: v.name, href: v.href })),
    { name: 'Blog', href: '/blog' }
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {logoUrl ? (
             <img src={logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
          ) : (
            <div>Zen<span>quillient</span></div>
          )}
        </Link>

        {/* Desktop Links */}
        <ul className={styles.desktopNav}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className={styles.navLink}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className={styles.navActions}>
          <Link href="/#contact" className="btn btn-primary">
            Get Started
          </Link>
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileNav}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={styles.mobileNavLink}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                href="/#contact" 
                className={`btn btn-primary ${styles.mobileBtn}`}
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

