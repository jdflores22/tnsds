import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { footerNavLinks } from '@/constants/navigation';
import { useServices } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { Logo } from '@/components/common/Logo';
import { NewsletterSignup } from '@/components/common/NewsletterSignup';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { formatWebsiteHref } from '@/utils/media';

export function Footer() {
  const { get } = useSiteSettingsMap();
  const { data: services } = useServices();
  const topServices = [...(services ?? [])].sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 5);

  const companyName = get('company_name', 'TRANS-NET');
  const footerText = get(
    'footer_text',
    'Custom software development for businesses that need reliable delivery and a long-term development partner.',
  );
  const email = get('company_email', 'info@trans-net.com');
  const phone = get('company_phone', '+1 (555) 123-4567');
  const address = get('company_address', '123 Tech Boulevard, Suite 500');
  const website = get('company_website', 'www.trans-net.com');
  const websiteHref = formatWebsiteHref(website);
  const facebook = get('social_facebook', '');
  const linkedin = get('social_linkedin', '');

  return (
    <footer className="border-t border-slate-800 bg-primary-950 text-slate-300">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{footerText}</p>
            <div className="mt-5 flex gap-3">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-medium text-slate-400 transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-400"
                  aria-label="LinkedIn"
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5" />
                  LinkedIn
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-medium text-slate-400 transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-400"
                  aria-label="Facebook"
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5" />
                  Facebook
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-slate-400 transition-colors hover:text-brand-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-sm font-semibold text-white">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {topServices.length > 0 ? (
                topServices.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-slate-400 transition-colors hover:text-brand-gold-400"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">No services published yet.</li>
              )}
              <li>
                <Link to="/products" className="font-medium text-brand-gold-400 hover:text-brand-gold-300">
                  Software products →
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-sm font-semibold text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-brand-gold-400" />
                <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-brand-gold-400" />
                {phone}
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Globe className="h-4 w-4 shrink-0 text-brand-gold-400" />
                <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {website}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-400" />
                {address}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <NewsletterSignup variant="dark" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-800 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-brand-gold-400">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-gold-400">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
