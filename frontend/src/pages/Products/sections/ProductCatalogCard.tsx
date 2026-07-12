import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SoftwareProduct } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { parseJsonArray } from '@/utils/jsonArray';
import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

const brandAccents = [
  'from-brand-gold-500/20 to-transparent',
  'from-primary-700/15 to-transparent',
  'from-sky-500/15 to-transparent',
] as const;

interface ProductCatalogCardProps {
  product: SoftwareProduct;
  index: number;
}

export function ProductCatalogCard({ product, index }: ProductCatalogCardProps) {
  const logoUrl = product.logoUrl ? resolveMediaUrl(product.logoUrl) : null;
  const screenshots = parseJsonArray(product.screenshotsJson);
  const screenshotUrl = screenshots[0] ? resolveMediaUrl(screenshots[0]) : null;
  const features = parseJsonArray(product.featuresJson).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="w-full max-w-sm sm:w-[calc(50%-0.625rem)] sm:max-w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)] lg:max-w-[calc(33.333%-0.84rem)]"
    >
      <Link to={`/products/${product.slug}`} className="group block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold-400/50 hover:shadow-[0_24px_50px_-30px_rgba(10,26,46,0.45)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            {screenshotUrl ? (
              <>
                <img
                  src={screenshotUrl}
                  alt=""
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-t opacity-60',
                    brandAccents[index % brandAccents.length],
                  )}
                />
              </>
            ) : (
              <div
                className={cn(
                  'flex h-full items-center justify-center bg-gradient-to-br',
                  index % 3 === 0
                    ? 'from-primary-50 to-white'
                    : index % 3 === 1
                      ? 'from-slate-50 to-white'
                      : 'from-brand-gold-500/5 to-white',
                )}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="max-h-16 max-w-[70%] object-contain" />
                ) : (
                  <span className="text-4xl font-bold text-primary-200">{product.name.charAt(0)}</span>
                )}
              </div>
            )}

            {logoUrl && screenshotUrl && (
              <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1.5 shadow-md ring-1 ring-slate-200/80">
                <img src={logoUrl} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-6">
            <h2 className="text-lg font-semibold tracking-tight text-primary-900 group-hover:text-primary-700">
              {product.name}
            </h2>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
              {product.shortDescription}
            </p>

            {features.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {features.map((feature) => (
                  <Badge key={feature} className="text-[11px] font-medium">
                    {feature.length > 28 ? `${feature.slice(0, 26)}…` : feature}
                  </Badge>
                ))}
              </div>
            )}

            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-800 group-hover:text-brand-gold-600">
              View product
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
