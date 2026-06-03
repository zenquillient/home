import styles from './Footer.module.css';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGlobe, FaGoogle } from 'react-icons/fa';
import { getNavigationLinks, getSocialLinks } from '@/lib/cms';

export default async function Footer() {
  const navData = await getNavigationLinks();
  const socials = await getSocialLinks();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <h3 style={{ fontFamily: "var(--font-serif)" }}>Zen<span>quillient</span></h3>
            <p>Empowering you to find peace and clarity in your everyday life through guided paths and professional support.</p>
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
              {socials.filter(s => s.url && s.url.trim() !== "" && s.url !== "#").map((social, idx) => {
                let Icon = FaGlobe;
                const p = social.platform.toLowerCase();
                if (p.includes('facebook')) Icon = FaFacebook;
                else if (p.includes('twitter') || p.includes('x')) Icon = FaTwitter;
                else if (p.includes('instagram')) Icon = FaInstagram;
                else if (p.includes('linkedin')) Icon = FaLinkedin;
                else if (p.includes('youtube')) Icon = FaYoutube;
                else if (p.includes('google')) Icon = FaGoogle;

                return (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} title={social.platform}>
                    <Icon size={18} />
                  </a>
                );
              })}
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
