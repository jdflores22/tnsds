import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { footerNavLinks } from '@/constants/navigation';
import { Container } from '@/components/common/Container';
import { Logo } from '@/components/common/Logo';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { formatWebsiteHref } from '@/utils/media';

export function Footer() {
  const { get } = useSiteSettingsMap();
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

  return (
    <footer className="border-t border-slate-800 bg-primary-950 text-slate-300">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{footerText}</p>
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

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-sm font-semibold text-white">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Custom Software Development</li>
              <li>Web & Mobile Applications</li>
              <li>Enterprise Application Development</li>
              <li>API Integration</li>
              <li>Ongoing Support & Maintenance</li>
            </ul>
          </div>

          <div className="lg:col-span-3">
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
