'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FileText, Megaphone, LogOut, Settings, Plus, Edit, Trash, UploadCloud, MessageSquare, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VERTICALS } from '@/lib/config';
import { databases, storage, account, DB_ID, COL_SETTINGS, COL_BLOGS, COL_PAGES, COL_NAVIGATION, COL_SOCIALS, BUCKET_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

// Interfaces
interface Blog { $id?: string; title: string; content: string; date: string; image?: string; tags?: string; }
interface Review { text: string; author: string; img?: string; }
interface VerticalForm { name: string; subtitle?: string; heading: string; paragraph: string; covers: string[]; reviews: Review[]; faqs?: {question: string, answer: string}[]; uploadingImg: boolean; videoLink?: string; buttonText?: string; buttonLink?: string; }
interface DynamicPage { $id?: string; slug: string; title: string; content: string; image?: string; }

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('siteSetup');
  const [authChecked, setAuthChecked] = useState(false);
  
  // Blog State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<any[]>([]);

  // Vertical CMS State
  const [selectedVertical, setSelectedVertical] = useState(VERTICALS[0]);
  const [verticalData, setVerticalData] = useState<VerticalForm>({
    name: selectedVertical.name,
    subtitle: "Guided mindfulness practices tailored for you.",
    heading: `Welcome to ${selectedVertical.name}`,
    paragraph: "In today's fast-paced world...",
    covers: ["linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.3))"],
    reviews: [],
    faqs: [],
    uploadingImg: false,
    videoLink: '',
    buttonText: '',
    buttonLink: ''
  });

  // Homepage Content State
  const [homeHeading, setHomeHeading] = useState('A Holistic Approach to Mind Wellness');
  const [homeParagraph, setHomeParagraph] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [homeVideoLink, setHomeVideoLink] = useState('');

  // Automations State
  const [greetingPrefix, setGreetingPrefix] = useState('Hey');
  const [mindfulnessTestLink, setMindfulnessTestLink] = useState('');
  const [contactAutoMessage, setContactAutoMessage] = useState('Thank you for reaching out. A team member will be in touch with you shortly.');
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Popup Setting State
  const [testTitle, setTestTitle] = useState("Discover Your Zenquillient Score");
  const [testContent, setTestContent] = useState("Take our free comprehensive Popup Setting on Google Forms to find the perfect guided path customized for your results.");
  const [testBtnText, setTestBtnText] = useState("Take the Test Now");
  const [testLink, setTestLink] = useState("");
  const [popupImage, setPopupImage] = useState("");
  const [uploadingPopupImg, setUploadingPopupImg] = useState(false);

  // Announcement State
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('');
  const [announcementStatus, setAnnouncementStatus] = useState('active');

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    facebook: '', linkedin: '', twitter: '', instagram: '', youtube: '', google: ''
  });

  // Pages Database State
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [uploadingPageImg, setUploadingPageImg] = useState(false);

  const handleLogout = async () => {
    try { await account.deleteSession('current'); } catch (_) {}
    router.push('/admin');
  };

  // Auth Guard — redirect to login if not authenticated
  useEffect(() => {
    account.get()
      .then(() => setAuthChecked(true))
      .catch(() => router.replace('/admin'));
  }, []);

  // Loaders
  useEffect(() => {
    if (!authChecked) return;
    fetchBlogs();
    loadAutomationConfigs();
    loadAnnouncementConfig();
      loadMindfulnessConfig();
    loadSocialLinks();
    loadPages();
    loadHomeContent();
  }, [authChecked]);

  useEffect(() => {
    loadVerticalData(selectedVertical.id);
  }, [selectedVertical]);

  const loadVerticalData = async (slug: string) => {
    try {
      const doc = await databases.getDocument(DB_ID, COL_SETTINGS, slug);
      if (doc.content) {
        const parsed = JSON.parse(doc.content);
        setVerticalData({
           name: parsed.title || selectedVertical.name,
           subtitle: parsed.subtitle || '',
           heading: parsed.heading || `Welcome to ${selectedVertical.name}`,
           paragraph: parsed.paragraph || '',
           covers: parsed.images ? parsed.images.map((img: any) => img.img || '').filter(Boolean) : [],
           reviews: parsed.reviews || [],
           faqs: parsed.faqs || [],
           uploadingImg: false,
           videoLink: parsed.videoLink || '',
           buttonText: parsed.buttonText || '',
           buttonLink: parsed.buttonLink || ''
        });
      }
    } catch(err) {
      setVerticalData({
        name: selectedVertical.name,
        subtitle: "Guided mindfulness practices tailored for you.",
        heading: `Welcome to ${selectedVertical.name}`,
        paragraph: "Connect with your authentic self...",
        covers: ["linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.3))"],
        reviews: [],
        faqs: [],
        uploadingImg: false,
        videoLink: ''
      });
    }
  };

  const loadHomeContent = async () => {
    try {
      const doc = await databases.getDocument(DB_ID, COL_SETTINGS, 'home');
      if (doc.content) {
        const parsed = JSON.parse(doc.content);
        setHomeHeading(parsed.heading || 'A Holistic Approach to Mind Wellness');
        setHomeParagraph(parsed.paragraph || '');
        setLogoUrl(parsed.logoUrl || '');
        setHomeVideoLink(parsed.videoLink || '');
      }
    } catch(_) { /* not saved yet */ }
  };

  const loadPages = async () => {
    try {
      const res = await databases.listDocuments(DB_ID, 'pages');
      setPages(res.documents as unknown as DynamicPage[]);
    } catch(_) { /* not saved yet */ }
  };

  const loadAutomationConfigs = async () => {
    try {
      const autoDoc = await databases.getDocument(DB_ID, COL_SETTINGS, 'automations');
      if (autoDoc.content) {
        const parsed = JSON.parse(autoDoc.content);
        if (parsed.greetingPrefix) setGreetingPrefix(parsed.greetingPrefix);
        // if (parsed.message) setMindfulnessAutoMessage(parsed.message);
        if (parsed.contactAutoMessage) setContactAutoMessage(parsed.contactAutoMessage);
        
      }
    } catch(err) { /* no config yet */ }
  };


  const loadMindfulnessConfig = async () => {
    try {
      const doc = await databases.getDocument(DB_ID, COL_SETTINGS, "mindfulness");
      if (doc.content) {
        const p = JSON.parse(doc.content);
        if (p.title !== undefined) setTestTitle(p.title);
        if (p.content !== undefined) setTestContent(p.content);
        if (p.btnText !== undefined) setTestBtnText(p.btnText);
        if (p.link !== undefined) setTestLink(p.link);
        if (p.image !== undefined) setPopupImage(p.image);
      }
    } catch(err) {}
  };

  const saveMindfulnessConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = JSON.stringify({ title: testTitle, content: testContent, btnText: testBtnText, link: testLink, image: popupImage });
      try {
        await databases.updateDocument(DB_ID, COL_SETTINGS, "mindfulness", { content: payload });
      } catch(err: any) {
        if(err.code === 404) await databases.createDocument(DB_ID, COL_SETTINGS, "mindfulness", { content: payload });
        else throw err;
      }
      alert("Popup Setting configuration saved.");
    } catch(err: any) { alert(err.message); }
  };

  const loadAnnouncementConfig = async () => {
    try {
      const doc = await databases.getDocument(DB_ID, COL_SETTINGS, 'announcement');
      if (doc.content) {
        const parsed = JSON.parse(doc.content);
        setAnnouncementText(parsed.text || '');
        setAnnouncementLink(parsed.link || '');
        setAnnouncementStatus(parsed.status || 'active');
      }
    } catch(err) { /* no announcement saved yet */ }
  };

  const loadSocialLinks = async () => {
    try {
      const res = await databases.listDocuments(DB_ID, COL_SOCIALS);
      const map: Record<string, string> = { facebook: '', linkedin: '', twitter: '', instagram: '', youtube: '', google: '' };
      res.documents.forEach(doc => {
        const key = doc.platform?.toLowerCase();
        if (key && key in map) map[key] = doc.url || '';
      });
      setSocialLinks(map);
    } catch(err) { /* no socials yet */ }
  };

  
  
  const fetchBlogs = async () => {
    try {
      const res = await databases.listDocuments(DB_ID, COL_BLOGS);

      setBlogs(res.documents.map(d => ({
        $id: d.$id, title: d.title, content: d.content, date: d.date || new Date(d.$createdAt).toLocaleDateString(), image: d.image, tags: d.tags || ''
      })));
    } catch(err: any) { console.error('Failed to fetch blogs:', err); alert('Failed to fetch blogs: ' + err.message); }
  };

  // Handlers
  const handlePageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingPage) return;
    try {
      setUploadingPageImg(true);
      const file = e.target.files[0];
      const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      setEditingPage({...editingPage, image: fileUrl});
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploadingPageImg(false);
    }
  };

  const handlePopupImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingPopupImg(true);
      const file = e.target.files[0];
      const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      setPopupImage(fileUrl);
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploadingPopupImg(false);
    }
  };

  const saveVertical = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: verticalData.name,
        subtitle: verticalData.subtitle,
        heading: verticalData.heading,
        paragraph: verticalData.paragraph,
        videoLink: verticalData.videoLink,
        images: verticalData.covers.map((c) => ({ title: verticalData.name, subtitle: verticalData.subtitle || "", img: c })),
        reviews: verticalData.reviews,
        faqs: verticalData.faqs,
        buttonText: verticalData.buttonText,
        buttonLink: verticalData.buttonLink
      };
      
      const docContent = JSON.stringify(payload);
      try {
        await databases.updateDocument(DB_ID, COL_SETTINGS, selectedVertical.id, { content: docContent });
      } catch(err: any) {
        if(err.code === 404) {
          await databases.createDocument(DB_ID, COL_SETTINGS, selectedVertical.id, { content: docContent });
        } else throw err;
      }
      alert('Vertical Layout successfully deployed to Application!');
    } catch(err: any) { alert(`Error: ${err.message}`); }
  };

  const addReview = () => setVerticalData(prev => ({ ...prev, reviews: [...prev.reviews, { text: '', author: '' }] }));
  const updateReview = (index: number, key: 'text' | 'author' | 'img', value: string) => {
     const newReviews = [...verticalData.reviews];
     newReviews[index][key] = value;
     setVerticalData({ ...verticalData, reviews: newReviews });
  };
  const removeReview = (index: number) => {
     setVerticalData(prev => ({ ...prev, reviews: prev.reviews.filter((_, i) => i !== index) }));
  };

  
  const saveAutomations = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = JSON.stringify({ greetingPrefix, contactAutoMessage });
      try {
        await databases.updateDocument(DB_ID, COL_SETTINGS, 'automations', { content: payload });
      } catch(err: any) {
        if(err.code === 404) await databases.createDocument(DB_ID, COL_SETTINGS, 'automations', { content: payload });
        else throw err;
      }
      alert("Mail Server Automations configuration saved.");
    } catch(err: any) { alert(err.message); }
  };

  const saveBlog = async (e: React.FormEvent) => {
     e.preventDefault();
     if(editingBlog) {
        try {
          if (editingBlog.$id === 'new') await databases.createDocument(DB_ID, COL_BLOGS, ID.unique(), { title: editingBlog.title, content: editingBlog.content, date: new Date().toLocaleDateString(), image: editingBlog.image, tags: editingBlog.tags });
          else await databases.updateDocument(DB_ID, COL_BLOGS, editingBlog.$id as string, { title: editingBlog.title, content: editingBlog.content, image: editingBlog.image, tags: editingBlog.tags });
          await fetchBlogs();
          setEditingBlog(null);
        } catch(err: any) { alert("Failed to save Blog! " + err.message); }
     }
  };

  const savePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    try {
      const payload = { slug: editingPage.slug, title: editingPage.title, content: editingPage.content, image: editingPage.image };
      if (editingPage.$id && editingPage.$id !== 'new') {
        await databases.updateDocument(DB_ID, 'pages', editingPage.$id, payload);
      } else {
        await databases.createDocument(DB_ID, 'pages', ID.unique(), payload);
      }
      setEditingPage(null);
      loadPages();
      alert('Page saved successfully!');
    } catch (err: any) { alert('Error: ' + err.message); }
  };

  const deletePage = async (id: string) => {
    if(!confirm("Are you sure you want to delete this page?")) return;
    try {
      await databases.deleteDocument(DB_ID, 'pages', id);
      setPages(prev => prev.filter(p => p.$id !== id));
    } catch (err: any) { alert('Error: ' + err.message); }
  };

  const deleteBlog = async (id: string) => {
    if(confirm('Delete blog?')) {
       try { await databases.deleteDocument(DB_ID, COL_BLOGS, id); await fetchBlogs(); } catch(err: any) { console.error('Failed to fetch blogs:', err); alert('Failed to fetch blogs: ' + err.message); }
    }
  };

  return (
    <div className={`container ${styles.dashboard}`}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Admin Panel</h3>
        </div>
        <nav className={styles.sidebarNav}>
          <button className={`${styles.navItem} ${activeTab === 'siteSetup' ? styles.activeNav : ''}`} onClick={() => setActiveTab('siteSetup')}>
            <Settings size={18} /> Vertical Formats
          </button>
          <button className={`${styles.navItem} ${activeTab === 'automations' ? styles.activeNav : ''}`} onClick={() => setActiveTab('automations')}>
             <MessageSquare size={18} /> Automations
          </button>
          <button className={`${styles.navItem} ${activeTab === 'pages' ? styles.activeNav : ''}`} onClick={() => setActiveTab('pages')}>
            <FileText size={18} /> Legal Pages
          </button>
          <button className={`${styles.navItem} ${activeTab === 'socials' ? styles.activeNav : ''}`} onClick={() => setActiveTab('socials')}>
             <MessageSquare size={18} /> Social Links
          </button>
          <button className={`${styles.navItem} ${activeTab === 'blogs' ? styles.activeNav : ''}`} onClick={() => setActiveTab('blogs')}>
             <FileText size={18} /> Manage Blogs
          </button>
          <button className={`${styles.navItem} ${activeTab === 'announcements' ? styles.activeNav : ''}`} onClick={() => setActiveTab('announcements')}>
            <Megaphone size={18} /> Announcements
          </button>
          <button className={`${styles.navItem} ${activeTab === 'mindfulness' ? styles.activeNav : ''}`} onClick={() => setActiveTab('mindfulness')}>
            <FileText size={18} /> Popup Setting
          </button>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}><LogOut size={18} /> Logout</button>
      </div>

      <div className={styles.mainContent}>

        {/* 1. CMS VERTICAL SETUP TAB */}
        {activeTab === 'siteSetup' && (
          <div className={styles.tabContent}>
            <h2 className="title-gradient">Manage Vertical Layouts</h2>
            <p style={{ color: 'var(--foreground)', marginBottom: '2rem' }}>Control the individualized structure of your 4 unique mind paths.</p>
            
            {/* Homepage Content Editor */}
            <div className={`glass ${styles.formCard}`}>
              <h3 style={{ marginBottom: '1.5rem' }}>Global & Homepage Settings</h3>

              <div className={styles.formGroup} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--card-border)' }}>
                <label>Site Logo (Top Left Navbar)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--background-alt)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                  <input type="file" id="logoUpload" accept="image/*" style={{display: 'none'}} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingLogo(true);
                    try {
                      const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
                      const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
                      const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
                      const url = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${projectId}`;
                      
                      // Auto-save the logo explicitly to DB
                      const payload = JSON.stringify({ heading: homeHeading, paragraph: homeParagraph, logoUrl: url.toString(), videoLink: homeVideoLink });
                      try {
                        await databases.updateDocument(DB_ID, COL_SETTINGS, 'home', { content: payload });
                      } catch (err: any) {
                        if (err.code === 404) await databases.createDocument(DB_ID, COL_SETTINGS, 'home', { content: payload });
                      }

                      setLogoUrl(url.toString());
                      alert("Logo uploaded and activated globally!");
                    } catch(err: any) { alert("Upload failed: " + err.message); }
                    finally { setUploadingLogo(false); }
                  }} />
                  <label htmlFor="logoUpload" className="btn btn-accent" style={{cursor: 'pointer'}}>
                    <UploadCloud size={16} /> {uploadingLogo ? 'Uploading...' : 'Browse New Logo...'}
                  </label>
                  <div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b', fontSize: '0.9rem'}}>
                    {logoUrl ? <a href={logoUrl} target="_blank" rel="noreferrer" style={{color: '#3b82f6'}}>{logoUrl}</a> : 'No custom logo set (using text fallback).'}
                  </div>
                </div>
              </div>

              <form className={styles.form} onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const payload = JSON.stringify({ heading: homeHeading, paragraph: homeParagraph, logoUrl: logoUrl, videoLink: homeVideoLink });
                  try {
                    await databases.updateDocument(DB_ID, COL_SETTINGS, 'home', { content: payload });
                  } catch (err: any) {
                    if (err.code === 404) await databases.createDocument(DB_ID, COL_SETTINGS, 'home', { content: payload });
                    else throw err;
                  }
                  alert('Homepage content saved!');
                } catch (err: any) { alert('Error: ' + err.message); }
              }}>
                <div className={styles.formGroup}>
                  <label>Section Heading</label>
                  <input type="text" value={homeHeading} onChange={e => setHomeHeading(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Body Paragraph</label>
                  <textarea rows={5} value={homeParagraph} onChange={e => setHomeParagraph(e.target.value)} placeholder="Describe your mission and services..." required />
                </div>
                <div className={styles.formGroup}>
                  <label>YouTube Video Link (Optional)</label>
                  <input type="url" value={homeVideoLink} onChange={e => setHomeVideoLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Homepage Content</button>
              </form>
            </div>

            <div className={`glass ${styles.formCard}`} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {VERTICALS.map(v => (
                  <button key={v.id} className={`btn ${selectedVertical.id === v.id ? 'btn-primary' : 'btn-accent'}`} onClick={() => setSelectedVertical(v)}>
                    {v.name}
                  </button>
                ))}
              </div>

              <form className={styles.form} onSubmit={saveVertical}>
                <div className={styles.formGroup}>
                  <label>Vertical Name</label>
                  <input type="text" value={verticalData.name} onChange={e => setVerticalData({...verticalData, name: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Homepage Card Subline</label>
                  <input type="text" value={verticalData.subtitle || ''} onChange={e => setVerticalData({...verticalData, subtitle: e.target.value})} placeholder="Guided mindfulness practices tailored for you..." />
                </div>
                <div className={styles.formGroup}>
                  <label>Action Button Text (Optional)</label>
                  <input type="text" value={verticalData.buttonText || ""} onChange={e => setVerticalData({...verticalData, buttonText: e.target.value})} placeholder="e.g. Book a Session" />
                </div>
                <div className={styles.formGroup}>
                  <label>Action Button Link (Optional)</label>
                  <input type="url" value={verticalData.buttonLink || ""} onChange={e => setVerticalData({...verticalData, buttonLink: e.target.value})} placeholder="https://calendly.com/..." />
                </div>
                <hr style={{ borderColor: 'var(--card-border)', margin: '2rem 0' }} />
                <div className={styles.formGroup}>
                  <label>Hero Heading</label>
                  <input type="text" value={verticalData.heading} onChange={e => setVerticalData({...verticalData, heading: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Content Paragraph</label>
                  <textarea rows={4} value={verticalData.paragraph} onChange={e => setVerticalData({...verticalData, paragraph: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>YouTube Video Link (Optional)</label>
                  <input type="url" value={verticalData.videoLink || ''} onChange={e => setVerticalData({...verticalData, videoLink: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div className={styles.formGroup}>
                  <label>Cover Image <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: 400 }}>(Recommended ratio 4:1, e.g. 1200x300)</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Explicit 3 Slots Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      {[0, 1, 2].map(idx => {
                        const c = verticalData.covers[idx];
                        return (
                          <div key={idx} style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: c ? (c.startsWith('http') ? `url(${c})` : c) : 'none', backgroundColor: c ? 'transparent' : 'var(--background-alt)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            {c ? (
                              <button type="button" onClick={() => setVerticalData(prev => ({ ...prev, covers: prev.covers.filter((_, i) => i !== idx) }))} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.9)', color: 'red', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>Remove</button>
                            ) : (
                              <label style={{ cursor: verticalData.uploadingImg ? 'not-allowed' : 'pointer', opacity: verticalData.uploadingImg ? 0.5 : 1 }}>
                                <UploadCloud size={32} style={{ color: 'var(--primary)' }} />
                                <input type="file" accept="image/*" style={{ display: 'none' }} disabled={verticalData.uploadingImg} onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setVerticalData(prev => ({ ...prev, uploadingImg: true }));
                                  try {
                                    const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
                                    const publicUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
                                    setVerticalData(prev => {
                                      const newCovers = [...prev.covers];
                                      newCovers[idx] = publicUrl;
                                      return { ...prev, covers: newCovers.filter(Boolean), uploadingImg: false };
                                    });
                                  } catch (err: any) {
                                    alert('Image upload failed: ' + err.message);
                                    setVerticalData(prev => ({ ...prev, uploadingImg: false }));
                                  }
                                }} />
                              </label>
                            )}
                            <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(255,255,255,0.8)', color: 'var(--heading)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Image {idx + 1}</div>
                          </div>
                        );
                      })}
                    </div>
                </div>
                </div>
                
                <h4 style={{marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem'}}>Featured Reviews</h4>
                {verticalData.reviews.map((r, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--background-alt)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <textarea rows={2} style={{flex: 2}} value={r.text} onChange={e => updateReview(i, 'text', e.target.value)} placeholder="Review Text..." required />
                      <input type="text" style={{flex: 1}} value={r.author} onChange={e => updateReview(i, 'author', e.target.value)} placeholder="Author" required />
                      <button type="button" className="btn btn-accent" onClick={() => removeReview(i)} style={{color: '#ef4444'}}><Trash size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>Reviewer Image (Optional):</label>
                      <input type="file" id={`reviewImg-${i}`} accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
                          const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
                          const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
                          const publicUrl = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${projectId}`;
                          updateReview(i, 'img', publicUrl);
                        } catch (err: any) { alert('Image upload failed: ' + err.message); }
                      }} />
                      <label htmlFor={`reviewImg-${i}`} className="btn btn-accent" style={{ cursor: 'pointer', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                        <UploadCloud size={14} style={{ marginRight: '0.25rem' }} /> {r.img ? 'Replace Image' : 'Upload Image'}
                      </label>
                      {r.img && <img src={r.img} alt="preview" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />}
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-accent" onClick={addReview} style={{marginBottom: '1rem'}}><Plus size={16} /> Add Review</button>

                <div style={{marginTop: '1rem'}}>

                  <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                    <h4 style={{ marginBottom: "1rem", color: 'var(--foreground)' }}>Frequently Asked Questions</h4>
                    {(verticalData.faqs || []).map((faq, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem", padding: "1rem", background: "var(--background-alt)", border: "1px solid var(--card-border)", borderRadius: "8px" }}>
                         <input type="text" placeholder="Question" value={faq.question} onChange={e => { const f = [...(verticalData.faqs || [])]; f[i].question = e.target.value; setVerticalData({...verticalData, faqs: f}); }} style={{ background: "transparent", color: "var(--foreground)", padding: "0.5rem", border: "1px solid var(--card-border)", borderRadius: "4px", width: "100%" }} />
                         <textarea placeholder="Answer" rows={2} value={faq.answer} onChange={e => { const f = [...(verticalData.faqs || [])]; f[i].answer = e.target.value; setVerticalData({...verticalData, faqs: f}); }} style={{ background: "transparent", color: "var(--foreground)", padding: "0.5rem", border: "1px solid var(--card-border)", borderRadius: "4px", width: "100%", resize: "vertical" }} />
                         <button type="button" onClick={() => setVerticalData(prev => ({...prev, faqs: (prev.faqs || []).filter((_, idx) => idx !== i)}))} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.875rem" }}>Remove FAQ</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-accent" onClick={() => setVerticalData(prev => ({ ...prev, faqs: [...(prev.faqs || []), { question: "", answer: "" }] }))}>+ Add FAQ</button>
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes to {selectedVertical.name}</button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* SOCIAL LINKS TAB */}
        {activeTab === 'socials' && (
          <div className={styles.tabContent}>
            <h2 className="title-gradient">Social Media & Footer Links</h2>
            <div className={`glass ${styles.formCard}`} style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Social Networks</h3>
              <p style={{ color: 'var(--foreground)', marginBottom: '2rem' }}>These icons appear on the right side of the main footer.</p>
              <form className={styles.form} onSubmit={async (e) => {
                e.preventDefault();
                const socials = ['Facebook','LinkedIn','Twitter','Instagram','YouTube','Google'];
                const abbrs = ['FB','IN','TW','IG','YT','GO'];
                const keys = ['facebook','linkedin','twitter','instagram','youtube','google'];
                try {
                  for (let i = 0; i < socials.length; i++) {
                    const url = socialLinks[keys[i]];
                    if (!url || url.trim() === "") {
                      try {
                        await databases.deleteDocument(DB_ID, COL_SOCIALS, keys[i]);
                      } catch (err: any) { /* ignore if already deleted */ }
                      continue;
                    }
                    try {
                      await databases.updateDocument(DB_ID, COL_SOCIALS, keys[i], { platform: socials[i], url, abbreviation: abbrs[i] });
                    } catch (err: any) {
                      if (err.code === 404) await databases.createDocument(DB_ID, COL_SOCIALS, keys[i], { platform: socials[i], url, abbreviation: abbrs[i] });
                    }
                  }
                  alert('Social Links saved!');
                } catch (err: any) { alert('Error: ' + err.message); }
              }}>
                {[
                  ['Facebook', 'facebook'],
                  ['LinkedIn', 'linkedin'],
                  ['Twitter / X', 'twitter'],
                  ['Instagram', 'instagram'],
                  ['YouTube', 'youtube'],
                  ['Google', 'google']
                ].map(([label, key]) => (
                  <div key={key} className={styles.formGroup}>
                    <label>{label} URL</label>
                    <input
                      type="url"
                      value={socialLinks[key] || ''}
                      onChange={e => setSocialLinks(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`https://${key === 'twitter' ? 'x' : key}.com/...`}
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Social Links</button>
              </form>
            </div>
          </div>
        )}

        {/* AUTOMATIONS TAB */}
        {activeTab === 'automations' && (
          <div className={styles.tabContent}>
             <h2 className="title-gradient">Form Automations</h2>
             <p style={{ color: 'var(--foreground)', marginBottom: '2rem' }}>Configure the automated email dispatched when users submit contact formats.</p>
             
             <div className={`glass ${styles.formCard}`}>
               <form className={styles.form} onSubmit={saveAutomations}>
                 <div className={styles.formGroup}>
                   <label>Global Greeting Prefix (e.g. Hey, Hello, Dear)</label>
                   <input type="text" value={greetingPrefix} onChange={e => setGreetingPrefix(e.target.value)} placeholder="Hey" required />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Auto-Response: General Contact Leads</label>
                   <textarea rows={4} value={contactAutoMessage} onChange={e => setContactAutoMessage(e.target.value)} placeholder="Email response for contact form leads..." required />
                 </div>
                 
                  

                 <button type="submit" className="btn btn-primary" style={{marginTop: '1.5rem'}}>Enable Configuration</button>
               </form>
             </div>
          </div>
        )}

        {/* 2. BLOGS CRUD TAB */}
        {activeTab === 'mindfulness' && (
          <div className={styles.tabPane}>
            <div className={styles.header}>
              <h2>Popup Setting Settings</h2>
              <p>Configure the Lead Generation Popup that appears on the homepage after 15 seconds.</p>
            </div>
            
            <div className={`glass ${styles.formCard}`}>
              <form className={styles.form} onSubmit={saveMindfulnessConfig}>
                <div className={styles.formGroup}>
                  <label>Popup Title</label>
                  <input type="text" value={testTitle} onChange={e => setTestTitle(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Popup Description</label>
                  <textarea rows={4} value={testContent} onChange={e => setTestContent(e.target.value)} />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Popup Image (Optional) <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: 400 }}>(Recommended ratio 2:1, e.g. 800x400)</span></label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {popupImage && <img src={popupImage} alt="preview" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />}
                    <input type="file" accept="image/*" onChange={handlePopupImageUpload} disabled={uploadingPopupImg} />
                    {uploadingPopupImg && <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Uploading...</span>}
                  </div>
                  {popupImage && (
                    <button type="button" onClick={() => setPopupImage("")} style={{ marginTop: '0.5rem', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Remove Image
                    </button>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Button Text</label>
                  <input type="text" value={testBtnText} onChange={e => setTestBtnText(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Redirecting Link (Google Form, Typeform, etc.)</label>
                  <input type="url" value={testLink} onChange={e => setTestLink(e.target.value)} placeholder="https://forms.google.com/..." />
                </div>
                
                <button type="submit" className="btn btn-accent" style={{marginTop: '1rem'}}>
                  <Save size={18} /> Save Settings
                </button>
              </form>
            </div>
          </div>
        )}
        {activeTab === 'blogs' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2 className="title-gradient">Blog Management</h2>
              {!editingBlog && (
                <button className="btn btn-primary" onClick={() => setEditingBlog({ $id: 'new', title: '', content: '', date: '' })}>
                  <Plus size={18} /> New Post
                </button>
              )}
            </div>
            
            {editingBlog ? (
              <div className={`glass ${styles.formCard}`}>
                <h3 style={{marginBottom: '1.5rem'}}>{editingBlog.$id === 'new' ? 'Draft New Post' : 'Edit Post'}</h3>
                <form className={styles.form} onSubmit={saveBlog}>
                  <div className={styles.formGroup}>
                    <label>Blog Title</label>
                    <input type="text" value={editingBlog.title} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cover Image (Optional) <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: 400 }}>(Recommended ratio 4:1, e.g. 1200x300)</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--background-alt)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                      <input type="file" id="blogImgUpload" accept="image/*" style={{display: 'none'}} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
                          const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
                          const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
                          const publicUrl = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${projectId}`;
                          setEditingBlog({...editingBlog, image: publicUrl});
                        } catch (err: any) { alert('Image upload failed: ' + err.message); }
                      }} />
                      <label htmlFor="blogImgUpload" className="btn btn-accent" style={{cursor: 'pointer'}}>
                        <UploadCloud size={16} /> {editingBlog.image ? 'Replace Image' : 'Upload Image'}
                      </label>
                      {editingBlog.image && <img src={editingBlog.image} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />}
                    </div>
                  </div>
                                    <div className={styles.formGroup}>
                    <label>Tags (comma separated, e.g. mindfulness, health)</label>
                    <input type="text" value={editingBlog.tags || ""} onChange={e => setEditingBlog({...editingBlog, tags: e.target.value})} placeholder="therapy, wellness" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Content</label>
                    <textarea rows={8} value={editingBlog.content} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Save to Appwrite</button>
                    <button type="button" className="btn btn-accent" onClick={() => setEditingBlog(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className={`glass ${styles.dataList}`}>
                {blogs.map(blog => (
                  <div key={blog.$id} className={styles.dataItem}>
                    <div>
                      <h4 style={{fontSize: '1.1rem'}}>{blog.title}</h4>
                      <p style={{color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.2rem'}}>Published • {blog.date}</p>
                    </div>
                    <div className={styles.itemActions} style={{display: 'flex', gap: '0.5rem'}}>
                       <button className="btn btn-accent" onClick={() => setEditingBlog(blog)}><Edit size={16} /></button>
                       <button className="btn btn-accent" onClick={() => deleteBlog(blog.$id as string)} style={{color: '#ef4444'}}><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        
                    {/* 3. ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className={styles.tabContent}>
            <h2 className="title-gradient">Announcement Banner</h2>
            <div className={`glass ${styles.formCard}`} style={{ marginTop: '2rem' }}>
              <form className={styles.form} onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const payload = JSON.stringify({ text: announcementText, link: announcementLink, status: announcementStatus });
                  try {
                    await databases.updateDocument(DB_ID, COL_SETTINGS, 'announcement', { content: payload });
                  } catch (err: any) {
                    if (err.code === 404) await databases.createDocument(DB_ID, COL_SETTINGS, 'announcement', { content: payload });
                    else throw err;
                  }
                  alert('Announcement saved successfully!');
                } catch (err: any) { alert('Error: ' + err.message); }
              }}>
                <div className={styles.formGroup}>
                  <label>Announcement Text</label>
                  <textarea
                    rows={2}
                    value={announcementText}
                    onChange={e => setAnnouncementText(e.target.value)}
                    placeholder="e.g. Join our upcoming seminar this Friday!"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Redirect Link (URL when clicked)</label>
                  <input
                    type="url"
                    value={announcementLink}
                    onChange={e => setAnnouncementLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={announcementStatus}
                    onChange={e => setAnnouncementStatus(e.target.value)}
                    style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', padding: '0.75rem', borderRadius: '8px' }}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Announcement</button>
              </form>

            </div>
          </div>
        )}

        {/* 4. LEGAL PAGES TAB */}
        {activeTab === 'pages' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2 className="title-gradient">Legal Pages</h2>
              {!editingPage && (
                <button className="btn btn-primary" onClick={() => setEditingPage({ $id: 'new', slug: '', title: '', content: '' })}>
                  <Plus size={18} /> Add Page
                </button>
              )}
            </div>
            
            {editingPage ? (
              <div className={`glass ${styles.formCard}`}>
                <h3 style={{marginBottom: '1.5rem'}}>{editingPage.$id === 'new' ? 'Create New Page' : 'Edit Page'}</h3>
                <form className={styles.form} onSubmit={savePage}>
                  <div className={styles.formGroup}>
                    <label>Page Title (e.g. Terms of Service, About Us)</label>
                    <input type="text" value={editingPage.title} onChange={e => setEditingPage({...editingPage, title: e.target.value})} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>URL Slug (e.g. terms, about-us)</label>
                    <input type="text" value={editingPage.slug} onChange={e => setEditingPage({...editingPage, slug: e.target.value})} required placeholder="lowercase, no spaces" pattern="[a-z0-9\-]+" title="Lowercase letters, numbers, and dashes only" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cover Image (Optional) <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: 400 }}>(Recommended ratio 4:1, e.g. 1200x300)</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {editingPage.image && editingPage.image !== "null" && <img src={editingPage.image} alt="preview" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />}
                      <input type="file" accept="image/*" onChange={handlePageImageUpload} disabled={uploadingPageImg} />
                      {uploadingPageImg && <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Uploading...</span>}
                    </div>
                    {editingPage.image && editingPage.image !== "null" && (
                      <button type="button" onClick={() => setEditingPage({...editingPage, image: ""})} style={{ marginTop: '0.5rem', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.85rem' }}>
                        Remove Image
                      </button>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Content</label>
                    <textarea rows={10} value={editingPage.content} onChange={e => setEditingPage({...editingPage, content: e.target.value})} required placeholder="Enter content here..." />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Save Page</button>
                    <button type="button" className="btn btn-accent" onClick={() => setEditingPage(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className={`glass ${styles.dataList}`}>
                {pages.map(p => (
                  <div key={p.$id} className={styles.dataItem}>
                    <div>
                      <h4 style={{fontSize: '1.1rem'}}>{p.title}</h4>
                      <p style={{color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.2rem'}}>url: /{p.slug}</p>
                    </div>
                    <div className={styles.itemActions} style={{display: 'flex', gap: '0.5rem'}}>
                       <button className="btn btn-accent" onClick={() => setEditingPage(p)}><Edit size={16} /></button>
                       <button className="btn btn-accent" onClick={() => deletePage(p.$id as string)} style={{color: '#ef4444', opacity: p.slug === 'about-me' ? 0.3 : 1, cursor: p.slug === 'about-me' ? 'not-allowed' : 'pointer' }} disabled={p.slug === 'about-me'}><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
                {pages.length === 0 && (
                  <p style={{color: '#94a3b8', fontStyle: 'italic', padding: '1rem 0'}}>No pages created yet. Click "Add Page" to get started.</p>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
