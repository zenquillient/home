import { getPageData, getVerticalNames, getAllReviews } from '@/lib/cms';
import LeadGenPopup from '@/components/LeadGenPopup/LeadGenPopup';
import PageLayout from '@/components/PageLayout/PageLayout';

import type { Review } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [pageData, verticals, allReviews] = await Promise.all([
    getPageData('home'),
    getVerticalNames(),
    getAllReviews()
  ]);

  const gradients = ["transparent", "transparent", "transparent", "transparent"];
  const subtitles = [
    "Guided mindfulness practices tailored for you.",
    "Transform your team's mental health.",
    "1-on-1 guidance to navigate life's challenges.",
    "Embrace a balanced lifestyle."
  ];
  if (verticals.length >= 4) {
    pageData.images = verticals.map((v, i) => ({
      title: v.name,
      subtitle: v.subtitle || subtitles[i],
      // Use real uploaded image if available, otherwise use gradient
      img: v.img && v.img.startsWith('http') ? v.img : gradients[i],
      href: v.href
    }));
  }


  return (
    <>
      
      {/* Shared Layout for Content + Reviews + Form */}
      <LeadGenPopup />
      <PageLayout pageData={pageData} allReviews={allReviews} verticals={verticals} />
    </>
  );
}
