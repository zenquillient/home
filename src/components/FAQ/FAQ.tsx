'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQProps {
  faqs: { question: string; answer: string }[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section" id="faq">
      <div className="container">
        <h2 className="title-gradient" style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
        <div className={`glass ${styles.faqList}`}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
                <button 
                  className={styles.questionBtn} 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <h3>{faq.question}</h3>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className={styles.answerWrapper + ' ' + (isOpen ? styles.openWrapper : '')}>
                  <div className={styles.answerContent}>
                    <p style={{ whiteSpace: "pre-wrap" }}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
