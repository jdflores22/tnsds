import { ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getPortfolioCoverImage } from '@/utils/portfolio';

interface PortfolioCoverImageProps {
  imagesJson: string;
  alt: string;
  className?: string;
}

export function PortfolioCoverImage({ imagesJson, alt, className }: PortfolioCoverImageProps) {
  const src = getPortfolioCoverImage(imagesJson);

  if (src) {
    return (
      <div className={cn('relative aspect-video overflow-hidden bg-slate-100', className)}>
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex aspect-video items-center justify-center bg-gradient-to-br from-primary-100 via-slate-50 to-brand-gold-100',
        className,
      )}
    >
      <ImageIcon className="h-10 w-10 text-primary-300" aria-hidden />
    </div>
  );
}
