import { getPageData } from '@/lib/cms';
import PageLayout from '@/components/PageLayout/PageLayout';
import LeadGenPopup from '@/components/LeadGenPopup/LeadGenPopup';

export const revalidate = 60; // Cache pages for 60 seconds

export default async function Home() {
  const pageData = await getPageData('home');

  return (
    <>
      <LeadGenPopup />
      <PageLayout pageData={pageData} />
    </>
  );
}
