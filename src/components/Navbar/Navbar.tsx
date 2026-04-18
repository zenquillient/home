'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';
import { VERTICALS } from '@/lib/config';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Updated links to support dynamic vertical pages
  const navLinks = [
    ...VERTICALS.map(v => ({ name: v.name, href: v.href })),
    { name: 'Blog', href: '/blog' }
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          Zen<span>quillient</span>
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
