import styles from './Footer.module.css';
import Link from 'next/link';
import { getNavigationLinks, getSocialLinks } from '@/lib/cms';

export default async function Footer() {
  const navData = await getNavigationLinks();
  const socials = await getSocialLinks();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <h3>Zen<span>quillient</span></h3>
            <p>Empowering you to find peace and clarity in your everyday life through guided paths and professional support.</p>
          </div>
          
          <div className={styles.linksGroup}>
            <h4>Quick Links</h4>
            <ul>
              {navData.quickLinks.map((link, idx) => (
                <li key={idx}><Link href={link.href}>{link.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className={styles.linksGroup}>
            <h4>Legal</h4>
            <ul>
              {navData.legal.map((link, idx) => (
                <li key={idx}><Link href={link.href}>{link.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className={styles.social}>
            <h4>Connect</h4>
            <div className={styles.socialIcons}>
              {socials.map((social, idx) => (
                <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform}>
                  {social.abbreviation}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} Zenquillient Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
