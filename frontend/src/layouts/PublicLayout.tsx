import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PreFooterCTA } from '@/components/marketing/PreFooterCTA';
import { MaintenancePage } from '@/components/common/MaintenancePage';
import { StickyCta } from '@/components/common/StickyCta';
import { AnalyticsScript } from '@/components/common/AnalyticsScript';
import { OrganizationJsonLd } from '@/components/common/OrganizationJsonLd';
import { PageLoader } from '@/components/ui/Spinner';
import { pathnameToPageKey } from '@/constants/pageVisibility';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { usePublicSiteSettings } from '@/hooks/useSiteSettingsMap';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function PublicLayout() {
  const { pathname } = useLocation();
  const pageKey = pathnameToPageKey(pathname);
  const { isLoading: visibilityLoading, isPublished, maintenanceMessage } = usePageVisibility(pageKey);
  // Wait for site settings too, so section headings/visibility never flash their
  // hardcoded defaults before the real CMS content arrives (noticeable in production).
  const { isLoading: settingsLoading } = usePublicSiteSettings();
  const isLoading = visibilityLoading || settingsLoading;

  if (pageKey && !isLoading && !isPublished) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <MaintenancePage pageKey={pageKey} message={maintenanceMessage} />
        </main>
        <Footer />
      </div>
    );
  }

  if (pageKey && isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <OrganizationJsonLd />
      <AnalyticsScript />
      <Header />
      <motion.main
        className="flex-1"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      {pathname !== '/' && <PreFooterCTA />}
      <Footer />
      <StickyCta />
    </div>
  );
}
