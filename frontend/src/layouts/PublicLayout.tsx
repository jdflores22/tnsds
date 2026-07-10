import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PreFooterCTA } from '@/components/marketing/PreFooterCTA';
import { MaintenancePage } from '@/components/common/MaintenancePage';
import { PageLoader } from '@/components/ui/Spinner';
import { pathnameToPageKey } from '@/constants/pageVisibility';
import { usePageVisibility } from '@/hooks/usePageVisibility';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function PublicLayout() {
  const { pathname } = useLocation();
  const pageKey = pathnameToPageKey(pathname);
  const { isLoading, isPublished, maintenanceMessage } = usePageVisibility(pageKey);

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
    </div>
  );
}
