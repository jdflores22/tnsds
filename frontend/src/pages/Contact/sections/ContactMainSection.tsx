import { Globe, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useSectionContent, useSectionDarkBackground } from '@/hooks/useSectionContent';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { sectionSurfaceClass, sectionTheme } from '@/utils/sectionSurface';
import { formatWebsiteHref } from '@/utils/media';
import { cn } from '@/utils/cn';
import { ContactFormCard } from './ContactFormCard';
import { ContactOfficeHours } from './ContactOfficeHours';

const QUICK_LINKS = [
  { label: 'Our services', href: '/services' },
  { label: 'Software products', href: '/products' },
  { label: 'Case studies', href: '/portfolio' },
  { label: 'Careers', href: '/careers' },
] as const;

interface ContactMethodProps {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  isDark: boolean;
}

function ContactMethodCard({ icon: Icon, label, value, href, isDark }: ContactMethodProps) {
  const content = (
    <div
      className={cn(
        'group flex h-full flex-col rounded-xl border p-5 transition-colors',
        isDark
          ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
          : 'border-slate-200 bg-white hover:border-brand-gold-400/40 hover:shadow-sm',
        href && 'cursor-pointer',
      )}
    >
      <div
        className={cn(
          'mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
          isDark ? 'bg-brand-gold-500/15' : 'bg-brand-gold-500/10',
        )}
      >
        <Icon className="h-5 w-5 text-brand-gold-500" strokeWidth={1.5} />
      </div>
      <p className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
        {label}
      </p>
      <p
        className={cn(
          'mt-1 flex items-start gap-1 text-sm font-medium leading-snug',
          isDark ? 'text-white' : 'text-primary-900',
        )}
      >
        <span className="flex-1">{value}</span>
        {href && (
          <ArrowUpRight
            className={cn(
              'mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100',
              isDark ? 'text-brand-gold-400' : 'text-brand-gold-600',
            )}
          />
        )}
      </p>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

export function ContactMainSection() {
  const isDark = useSectionDarkBackground('contact_main');
  const theme = sectionTheme(isDark);
  const { get } = useSiteSettingsMap();
  const section = useSectionContent('contact_main', {
    eyebrow: 'Contact details',
    title: 'Let’s start a conversation',
    subtitle:
      'Whether you need a product demo, custom development, or ongoing support — reach out and we’ll connect you with the right team.',
  });

  const email = get('company_email', 'info@trans-net.com');
  const phone = get('company_phone', '+1-800-TRANS-NET');
  const address = get('company_address', 'Global Headquarters');
  const website = get('company_website', 'www.trans-net.com');
  const websiteHref = formatWebsiteHref(website);

  const formTitle = get('contact_form_title', 'Send us a message');
  const formSubtitle = get(
    'contact_form_subtitle',
    'Fill out the form and our team will get back to you within one business day.',
  );

  return (
    <section className={sectionSurfaceClass(isDark, 'muted')}>
      <Container>
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          align="left"
          theme={theme}
          className="mb-10 max-w-2xl"
        />

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ContactMethodCard
                icon={Mail}
                label="Email"
                value={email}
                href={`mailto:${email}`}
                isDark={isDark}
              />
              <ContactMethodCard
                icon={Phone}
                label="Phone"
                value={phone}
                href={`tel:${phone.replace(/\s/g, '')}`}
                isDark={isDark}
              />
              <ContactMethodCard
                icon={Globe}
                label="Website"
                value={website}
                href={websiteHref}
                isDark={isDark}
              />
              <ContactMethodCard icon={MapPin} label="Address" value={address} isDark={isDark} />
            </div>

            <ContactOfficeHours isDark={isDark} />

            <div>
              <p
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  isDark ? 'text-slate-400' : 'text-slate-500',
                )}
              >
                Quick links
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        'inline-flex rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        isDark
                          ? 'border-white/15 text-slate-200 hover:border-white/30 hover:bg-white/10'
                          : 'border-slate-200 text-slate-700 hover:border-primary-300 hover:text-primary-900',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactFormCard
              isDark={isDark}
              formTitle={formTitle}
              formSubtitle={formSubtitle}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
