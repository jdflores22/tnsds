import { useProducts } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { FeaturedProductSpotlight } from '@/components/marketing/FeaturedProductSpotlight';
import { Spinner } from '@/components/ui/Spinner';
import { useFeaturedProductAppearance } from '@/hooks/useFeaturedProductAppearance';

export function FeaturedProduct() {
  const { data: products, isLoading } = useProducts();
  const featured = (products ?? []).find((p) => p.isFeatured) ?? null;
  const { sectionStyle } = useFeaturedProductAppearance();

  if (isLoading) {
    return (
      <PageSection
        sectionId="home_featured_product"
        variant="white"
        style={sectionStyle}
        className="!py-20"
      >
        <Container className="flex justify-center py-12">
          <Spinner size="lg" />
        </Container>
      </PageSection>
    );
  }

  if (!featured) return null;

  return <FeaturedProductSpotlight product={featured} />;
}
