import { Link } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import { isSocialLinkVisible } from '@/utils/socialLinks';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { cn } from '@/utils/cn';

export function StickyCta() {
  const { get } = useSiteSettingsMap();
  const whatsapp = get('social_whatsapp', '');
  const showWhatsapp = isSocialLinkVisible(whatsapp, get('social_whatsapp_enabled', 'true'));
  const calendly = get('calendly_url', '');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {showWhatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      )}
      <Link
        to={calendly || '/contact'}
        target={calendly ? '_blank' : undefined}
        rel={calendly ? 'noopener noreferrer' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-800 hover:shadow-xl',
        )}
      >
        <Phone className="h-4 w-4" />
        {calendly ? 'Book a call' : 'Get a quote'}
      </Link>
    </div>
  );
}
