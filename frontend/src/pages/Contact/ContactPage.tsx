import { PageSEO } from '@/components/common/PageSEO';
import { useContactSectionsVisibility } from '@/hooks/useSectionContent';
import { ContactHero } from '@/pages/Contact/sections/ContactHero';
import { ContactMainSection } from '@/pages/Contact/sections/ContactMainSection';
import { ContactExpectSection } from '@/pages/Contact/sections/ContactExpectSection';
import { ContactFAQSection } from '@/pages/Contact/sections/ContactFAQSection';
import { ContactMapSection } from '@/pages/Contact/sections/ContactMapSection';
import { ContactCareersSection } from '@/pages/Contact/sections/ContactCareersSection';

export default function ContactPage() {
  const sections = useContactSectionsVisibility();

  return (
    <>
      <PageSEO
        pageKey="contact"
        title="Contact | TRANS-NET"
        description="Get in touch with TRANS-NET for software development, product demos, and enterprise solutions."
      />

      <ContactHero />

      {sections.contact_main && <ContactMainSection />}

      {sections.contact_map && <ContactMapSection />}

      {sections.contact_expect && <ContactExpectSection />}

      {sections.contact_careers && <ContactCareersSection />}

      {sections.contact_faq && <ContactFAQSection />}
    </>
  );
}
