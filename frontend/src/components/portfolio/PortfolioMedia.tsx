import type { Portfolio } from '@/types';
import { PortfolioCoverImage } from '@/components/portfolio/PortfolioCoverImage';
import { PortfolioLogoBadge } from '@/components/portfolio/PortfolioLogoBadge';

interface PortfolioMediaProps {
  item: Portfolio;
}

export function PortfolioMedia({ item }: PortfolioMediaProps) {
  return (
    <div className="relative">
      <PortfolioCoverImage imagesJson={item.imagesJson} alt={item.title} />
      <PortfolioLogoBadge logoUrl={item.logoUrl} title={item.title} />
    </div>
  );
}
