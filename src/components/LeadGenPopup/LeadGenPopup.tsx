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
          if (parsed.title !== undefined) setTestTitle(parsed.title);
          if (parsed.content !== undefined) setTestContent(parsed.content);
          if (parsed.btnText !== undefined) setTestBtnText(parsed.btnText);
          if (parsed.link !== undefined) setTestLink(parsed.link);
          if (parsed.image !== undefined) setPopupImage(parsed.image);
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

  const hasAnyContent = testTitle || testContent || testBtnText || testLink || popupImage;
  if (!isVisible || !hasAnyContent) return null;

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


        <div className={styles.content}>
          {testTitle && <h2 className="title-gradient" style={{ marginTop: 0 }}>{testTitle}</h2>}
          {testContent && <p>{testContent}</p>}
          
          {popupImage && (
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/1", height: "auto", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
              <Image src={popupImage} alt="Popup Image" fill style={{ objectFit: "cover" }} sizes="(max-width: 480px) 100vw, 400px" priority />
            </div>
          )}

          {testBtnText && testLink && (
            <a href={testLink} target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ display: "inline-block", width: "100%", padding: "1rem", boxSizing: "border-box" }} onClick={closePopup}>
              {testBtnText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
