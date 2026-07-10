import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { usePublishedNavLinks } from '@/hooks/usePublishedNavLinks';
import { usePageVisibilityMap } from '@/hooks/usePageVisibility';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/common/Logo';
import type { CompanyTextColors } from '@/hooks/useHeaderBrandingText';
import { cn } from '@/utils/cn';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  dark?: boolean;
  panelClassName?: string;
  panelStyle?: CSSProperties;
  logoVariant?: 'light' | 'dark';
  logoTextColors?: CompanyTextColors;
}

export function MobileNav({
  isOpen,
  onClose,
  dark = false,
  panelClassName,
  panelStyle,
  logoVariant = 'light',
  logoTextColors,
}: MobileNavProps) {
  const navLinks = usePublishedNavLinks();
  const { isPagePublished } = usePageVisibilityMap();
  const showContact = isPagePublished('contact');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div className="absolute inset-0 bg-primary-950/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'absolute right-0 top-0 flex h-full w-72 flex-col shadow-xl',
          dark ? panelClassName || 'bg-primary-900' : 'bg-white',
        )}
        style={dark ? panelStyle : undefined}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b px-4 py-4',
            dark ? 'border-white/10' : 'border-slate-100',
          )}
        >
          {dark ? (
            <Logo variant={logoVariant} textColors={logoTextColors} />
          ) : (
            <Logo variant="dark" />
          )}
          <button type="button" onClick={onClose} aria-label="Close menu">
            <X className={cn('h-5 w-5', dark ? 'text-white' : 'text-primary-800')} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-sm font-medium',
                dark
                  ? 'text-white/90 hover:bg-white/10 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-primary-900',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {showContact && (
          <div className={cn('border-t p-4', dark ? 'border-white/10' : 'border-slate-200')}>
            <Link to="/contact" onClick={onClose}>
              <Button className="w-full">Contact us</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
