import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';

/** Injects GA4 when ga_measurement_id is set in site settings. */
export function AnalyticsScript() {
  const { get } = useSiteSettingsMap();
  const gaId = get('ga_measurement_id', '');

  if (!gaId) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
