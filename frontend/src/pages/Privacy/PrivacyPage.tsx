import { SEOHead } from '@/components/common/SEOHead';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';

export default function PrivacyPage() {
  const { get } = useSiteSettingsMap();
  const content = get(
    'privacy_content',
    '<p>Last updated: June 2026</p><h2>Information We Collect</h2><p>We collect information you provide directly, such as when you fill out our contact form, subscribe to our newsletter, or apply for a career opportunity.</p><h2>How We Use Your Information</h2><p>We use collected information to respond to inquiries, provide services, improve our website, and communicate with you about our offerings.</p><h2>Data Security</h2><p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.</p><h2>Contact</h2><p>For privacy-related inquiries, contact us at privacy@trans-net.com.</p>',
  );

  return (
    <>
      <SEOHead title="Privacy Policy | TRANS-NET" />
      <PageHero title="Privacy Policy" />
      <Container className="py-16">
        <div
          className="prose prose-slate mx-auto max-w-3xl space-y-6 text-slate-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </>
  );
}
