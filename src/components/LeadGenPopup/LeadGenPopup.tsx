'use client';

import { useState, useEffect } from "react";
import styles from "./LeadGenPopup.module.css";
import { X } from "lucide-react";
import Image from "next/image";

export default function LeadGenPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [testTitle, setTestTitle] = useState("Discover Your Zenquillient Score");
  const [testContent, setTestContent] = useState("Take our free comprehensive Mindfulness Test on Google Forms to find the perfect guided path customized for your results.");
  const [testBtnText, setTestBtnText] = useState("Take the Test Now");
  const [testLink, setTestLink] = useState("");
  const [popupImage, setPopupImage] = useState("");

  useEffect(() => {
    // Only show if not previously dismissed
    if (isDismissed) return;

    const fetchConfig = async () => {
      try {
        const { databases, DB_ID, COL_SETTINGS } = await import("@/lib/appwrite");
        const autoDoc = await databases.getDocument(DB_ID, COL_SETTINGS, "mindfulness");
        if (autoDoc.content) {
          const parsed = JSON.parse(autoDoc.content);
          if (parsed.title) setTestTitle(parsed.title);
          if (parsed.content) setTestContent(parsed.content);
          if (parsed.btnText) setTestBtnText(parsed.btnText);
          if (parsed.link) setTestLink(parsed.link);
          if (parsed.image) setPopupImage(parsed.image);
        }
      } catch (err) {
        // silently fail
      }
    };
    fetchConfig();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // 15 seconds delay

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const closePopup = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible || !testLink) return null;

  return (
    <div className={styles.overlay}>
      <div className={`glass ${styles.popup}`}>
        <button 
          className={styles.closeBtn} 
          onClick={closePopup}
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {popupImage && (
          <div style={{ position: "relative", width: "100%", height: "200px", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", overflow: "hidden" }}>
            <Image src={popupImage} alt="Popup Image" fill style={{ objectFit: "cover" }} sizes="(max-width: 480px) 100vw, 400px" priority />
          </div>
        )}
        <div className={styles.content}>
          <h2 className="title-gradient" style={{ marginTop: popupImage ? 0 : "inherit" }}>{testTitle}</h2>
          <p>{testContent}</p>
          <a href={testLink} target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ display: "inline-block", width: "100%", marginTop: "1rem", padding: "1rem", boxSizing: "border-box" }} onClick={closePopup}>
            {testBtnText}
          </a>
        </div>
      </div>
    </div>
  );
}
