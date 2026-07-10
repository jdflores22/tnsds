import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { usePageSectionTheme } from '@/hooks/useSectionContent';
import { usePageVisibilityMap } from '@/hooks/usePageVisibility';

export function HomeIntroBanner() {
  const { get } = useSiteSettingsMap();
  const { isPagePublished } = usePageVisibilityMap();
  const showAbout = isPagePublished('about');

  const line1 = get('home_intro_line1', 'A software partner focused on');
  const line2 = get('home_intro_line2', 'delivering value');
  const line3 = get('home_intro_line3', '');
  const introBody = get(
    'home_intro_body',
    'TRANS-NET combines skilled engineers, domain understanding, and proven delivery practices to guide software from idea to release. We help organizations build reliable products, improve operations, and maintain systems with confidence.',
  );

  const theme = usePageSectionTheme('home_intro');

  return (
    <PageSection sectionId="home_intro" variant="white">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className={theme === 'dark' ? 'pro-eyebrow-dark mb-5' : 'pro-eyebrow mb-5'}>What we do</p>
            <h2 className={`text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl ${theme === 'dark' ? 'text-white' : 'text-primary-900'}`}>
              {line1}
              <span className={`block ${theme === 'dark' ? 'text-brand-gold-400' : 'text-primary-800'}`}>{line2}</span>
              {line3 ? <span className={`block ${theme === 'dark' ? 'text-slate-300' : 'text-primary-700'}`}>{line3}</span> : null}
            </h2>
            <p className={`mx-auto mt-6 max-w-3xl text-base leading-relaxed sm:text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {introBody}
            </p>
            {showAbout && (
              <Link
                to="/about"
                className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold ${theme === 'dark' ? 'text-brand-gold-400 hover:text-brand-gold-300' : 'sm-link'}`}
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
        </div>
      </Container>
    </PageSection>
  );
}
