import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';

export function OrganizationJsonLd() {
  const { get } = useSiteSettingsMap();
  const name = get('company_name', 'TRANS-NET');
  const url = get('company_website', 'https://www.trans-net.com');
  const email = get('company_email', 'info@trans-net.com');
  const phone = get('company_phone', '');
  const address = get('company_address', '');
  const logo = '/logo.png';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: url.startsWith('http') ? url : `https://${url}`,
    logo,
    email,
    telephone: phone,
    address: address
      ? { '@type': 'PostalAddress', streetAddress: address }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
