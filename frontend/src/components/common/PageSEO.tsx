import { useSeoByPageKey } from '@/api/hooks';
import { SEOHead, type SEOHeadProps } from '@/components/common/SEOHead';

export interface PageSEOProps extends SEOHeadProps {
  pageKey?: string;
}

export function PageSEO({ pageKey, title, description, keywords, ogImage }: PageSEOProps) {
  const { data: seo } = useSeoByPageKey(pageKey ?? '');

  return (
    <SEOHead
      title={seo?.title || title}
      description={seo?.description || description}
      keywords={seo?.keywords || keywords}
      ogImage={seo?.ogImage || ogImage}
    />
  );
}
