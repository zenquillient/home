'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';

import type { NavVertical } from '@/lib/cms';

interface ContactFormProps {
  verticals: NavVertical[];
}

export default function ContactForm({ verticals }: ContactFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    

    try {
      const { databases, COL_CONTACTS, DB_ID, COL_SETTINGS } = await import('@/lib/appwrite');
      const { ID } = await import('appwrite');

      let finalMessage = '';
      try {
        const autoDoc = await databases.getDocument(DB_ID, COL_SETTINGS, 'automations');
        if (autoDoc.content) {
          const parsed = JSON.parse(autoDoc.content);
          const prefix = parsed.greetingPrefix || 'Hey';
          const body = parsed.contactAutoMessage || 'Thank you for reaching out. A team member will be in touch with you shortly.';
          finalMessage = `${prefix} ${formData.get('name')},\n\n${body}`;
        }
      } catch (err) {
        finalMessage = `Hey ${formData.get('name')},\n\nThank you for reaching out. A team member will be in touch with you shortly.`;
      }

      const msg = formData.get('message') as string;
      const userPhone = formData.get('phone') as string;

      await databases.createDocument(DB_ID, COL_CONTACTS, ID.unique(), {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: "255",
        enquiry_for: formData.get('enquiringFor') as string,
        enquiry_type: formData.get('enquiryType') as string,
        user_message: `Phone: ${userPhone}

${msg}`,
        message: finalMessage // Restore the automation message!
      });

      alert('Thank you! Your request has been received. We will get back to you shortly.');
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Contact submit failed:', error);
      alert('Submission failed. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" name="name" required placeholder="John Doe" />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" required placeholder="john@example.com" />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" required placeholder="+1 123 456 7890" />
      </div>

      <div className={styles.formGroup}>
        <label>Who are you enquiring for?</label>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="radio" name="enquiringFor" value="myself" defaultChecked /> Myself
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="radio" name="enquiringFor" value="organisation" /> Organisation
          </label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Type of Enquiry</label>
        <select 
          name="enquiryType" 
          defaultValue="services"
          style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer' }}
        >
          <option value="services">General Services</option>
          <option value="pricing">Pricing & Billing</option>
          {verticals.map(v => (
            <option key={v.id} value={`vertical_${v.id}`}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Any additional details?</label>
        <textarea id="message" name="message" rows={4} required placeholder="Tell us about what you are looking for..." />
      </div>
      <button type="submit" className="btn btn-accent" disabled={loading}>
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </form>
  );
}
