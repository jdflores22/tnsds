import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import type { CompanyTextColors } from '@/hooks/useHeaderBrandingText';
import { CompanyBrandText } from '@/components/common/CompanyBrandText';
import { CompanyLogoImage } from '@/components/common/CompanyLogoImage';
import { isTransparentLogoUrl } from '@/utils/logo';
import { resolveMediaUrl } from '@/utils/media';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
  /** Header-only CMS text colors. Omit for footer and other surfaces. */
  textColors?: CompanyTextColors;
}

const DEFAULT_LOGO = '/logo.png';

export function Logo({ variant = 'light', className, showText = true, textColors }: LogoProps) {
  const isLight = variant === 'light';
  const { get } = useSiteSettingsMap();

  const companyName = get('company_name', 'TRANS-NET');
  const tagline = get('company_tagline', 'Software Development Services');
  const logoSrc = resolveMediaUrl(get('company_logo', DEFAULT_LOGO));
  const logoMedia = get('company_logo_media', 'png');
  const transparent = isTransparentLogoUrl(logoSrc, logoMedia);
  const nameParts = companyName.includes('-') ? companyName.split('-') : null;

  return (
    <Link to="/" className={cn('flex items-center gap-3', className)}>
      <CompanyLogoImage
        src={logoSrc}
        alt={`${companyName} logo`}
        size="md"
        mediaHint={logoMedia}
        bare={isLight || transparent}
      />
      {showText &&
        (textColors ? (
          <CompanyBrandText
            companyName={companyName}
            tagline={tagline}
            nameColor={textColors.nameColor}
            accentColor={textColors.accentColor}
            taglineColor={textColors.taglineColor}
          />
        ) : (
          <div className="leading-tight">
            <span
              className={cn(
                'block text-base font-medium tracking-wide',
                isLight ? 'text-white' : 'text-primary-900',
              )}
            >
              {nameParts ? (
                <>
                  {nameParts[0]}-
                  <span className={isLight ? 'text-brand-gold-400' : 'text-brand-gold-500'}>
                    {nameParts.slice(1).join('-')}
                  </span>
                </>
              ) : (
                companyName
              )}
            </span>
            <span
              className={cn(
                'block text-[10px] font-medium uppercase tracking-wider',
                isLight ? 'text-slate-300' : 'text-primary-600',
              )}
            >
              {tagline}
            </span>
          </div>
        ))}
    </Link>
  );
}
