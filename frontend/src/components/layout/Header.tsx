import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Menu } from 'lucide-react';
import { usePublishedNavLinks } from '@/hooks/usePublishedNavLinks';
import { usePageVisibilityMap } from '@/hooks/usePageVisibility';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { MobileNav } from '@/components/layout/MobileNav';
import { useHeaderAppearance } from '@/hooks/useHeaderAppearance';
import { useHeaderBrandingText } from '@/hooks/useHeaderBrandingText';
import { cn } from '@/utils/cn';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = usePublishedNavLinks();
  const { isPagePublished } = usePageVisibilityMap();
  const showContact = isPagePublished('contact');
  const header = useHeaderAppearance();
  const headerTextColors = useHeaderBrandingText(header.logoVariant === 'light' ? 'light' : 'dark');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b',
        header.borderClassName,
        header.headerClassName,
      )}
      style={header.headerStyle}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo variant={header.logoVariant} textColors={headerTextColors} />

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) => header.navLinkClass(isActive)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {showContact && (
          <div className="hidden xl:block">
            <Link to="/contact">
              <Button size="md" variant={header.contactButtonVariant}>
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <button
          type="button"
          className={cn('rounded-lg p-2 xl:hidden', header.menuButtonClassName)}
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        dark={header.mobileDark}
        panelClassName={header.headerClassName}
        panelStyle={header.headerStyle}
        logoVariant={header.logoVariant}
        logoTextColors={headerTextColors}
      />
    </header>
  );
}
