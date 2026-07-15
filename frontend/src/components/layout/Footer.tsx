import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { useServices } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { Logo } from '@/components/common/Logo';
import { NewsletterSignup } from '@/components/common/NewsletterSignup';
import { FacebookIcon, LinkedInIcon } from '@/components/common/SocialBrandIcons';
import { usePublishedFooterLinks, usePagePublishFlags } from '@/hooks/usePublishedNavLinks';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { isSocialLinkVisible } from '@/utils/socialLinks';
import { formatWebsiteHref } from '@/utils/media';

export function Footer() {
  const { get } = useSiteSettingsMap();
  const { data: services } = useServices();
  const companyLinks = usePublishedFooterLinks();
  const pages = usePagePublishFlags();

  const topServices = pages.services
    ? [...(services ?? [])].sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 5)
    : [];

  const showServicesColumn = pages.services || pages.products;

  const companyName = get('company_name', 'TRANS-NET');
  const footerText = get(
    'footer_text',
    'Custom software development for businesses that need reliable delivery and a long-term development partner.',
  );
  const email = get('company_email', 'info@trans-net.com');
  const phone = get('company_phone', '+1 (555) 123-4567');
  const address = get('company_address', '412 Regina Bldg., Escolta St, Binondo, Manila');
  const website = get('company_website', 'www.tnsds.ph');
  const websiteHref = formatWebsiteHref(website);

  const facebookUrl = get('social_facebook', '');
  const linkedinUrl = get('social_linkedin', '');
  const showLinkedin = isSocialLinkVisible(linkedinUrl, get('social_linkedin_enabled', 'true'));
  const showFacebook = isSocialLinkVisible(facebookUrl, get('social_facebook_enabled', 'true'));

  return (
    <footer className="border-t border-slate-800 bg-primary-950 text-slate-300">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{footerText}</p>
            {(showLinkedin || showFacebook) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {showLinkedin && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-medium text-slate-400 transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-400"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="mr-1.5 h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
                {showFacebook && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-medium text-slate-400 transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-400"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="mr-1.5 h-3.5 w-3.5" />
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>

          {companyLinks.length > 0 && (
            <div className="lg:col-span-2">
              <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-2.5 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-slate-400 transition-colors hover:text-brand-gold-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showServicesColumn && (
            <div className="lg:col-span-2">
              <h4 className="mb-4 text-sm font-semibold text-white">Services</h4>
              <ul className="space-y-2.5 text-sm">
                {pages.services &&
                  (topServices.length > 0 ? (
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
                  ))}
                {pages.products && (
                  <li>
                    <Link
                      to="/products"
                      className="font-medium text-brand-gold-400 hover:text-brand-gold-300"
                    >
                      Software products →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

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
          <p>
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          {(pages.privacy || pages.terms) && (
            <div className="flex gap-6">
              {pages.privacy && (
                <Link to="/privacy" className="hover:text-brand-gold-400">
                  Privacy
                </Link>
              )}
              {pages.terms && (
                <Link to="/terms" className="hover:text-brand-gold-400">
                  Terms
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>
    </footer>
  );
}
