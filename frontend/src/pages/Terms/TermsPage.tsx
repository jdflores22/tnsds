import { SEOHead } from '@/components/common/SEOHead';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';

export default function TermsPage() {
  const { get } = useSiteSettingsMap();
  const content = get(
    'terms_content',
    '<p>Last updated: June 2026</p><h2>Acceptance of Terms</h2><p>By accessing and using the TRANS-NET website, you accept and agree to be bound by these Terms and Conditions.</p><h2>Use of Services</h2><p>Our services are provided for lawful business purposes.</p><h2>Intellectual Property</h2><p>All content on this website is the property of TRANS-NET.</p><h2>Limitation of Liability</h2><p>TRANS-NET shall not be liable for any indirect, incidental, or consequential damages.</p>',
  );

  return (
    <>
      <SEOHead title="Terms & Conditions | TRANS-NET" />
      <PageHero title="Terms & Conditions" />
      <Container className="py-16">
        <div
          className="prose prose-slate mx-auto max-w-3xl space-y-6 text-slate-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </>
  );
}
