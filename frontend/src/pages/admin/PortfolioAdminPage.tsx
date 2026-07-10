import {
  useAdminPortfolio,
  useCreatePortfolio,
  useUpdatePortfolio,
  useDeletePortfolio,
  useReorderPortfolio,
} from '@/api/hooks';
import type { Portfolio } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { PortfolioForm } from '@/components/admin/PortfolioForm';
import { Badge } from '@/components/ui/Badge';
import { getPortfolioCoverImage } from '@/utils/portfolio';
import { resolveMediaUrl } from '@/utils/media';

export default function PortfolioAdminPage() {
  const { data: items, isLoading } = useAdminPortfolio();
  const createMutation = useCreatePortfolio();
  const updateMutation = useUpdatePortfolio();
  const deleteMutation = useDeletePortfolio();
  const reorderMutation = useReorderPortfolio();

  return (
    <AdminCrudPage<Portfolio>
      title="Portfolio"
      description="Manage client project case studies and success stories. For software products (ECMS, CRM), use Products instead."
      items={items}
      isLoading={isLoading}
      columns={[
        {
          key: 'logoUrl',
          label: 'Logo',
          render: (item) =>
            item.logoUrl ? (
              <img
                src={resolveMediaUrl(item.logoUrl)}
                alt=""
                className="h-10 w-10 rounded bg-white object-contain p-1 ring-1 ring-slate-200"
              />
            ) : (
              <span className="text-xs text-slate-400">—</span>
            ),
        },
        {
          key: 'imagesJson',
          label: 'Cover',
          render: (item) => {
            const cover = getPortfolioCoverImage(item.imagesJson);
            return cover ? (
              <img src={cover} alt="" className="h-10 w-16 rounded object-cover" />
            ) : (
              <span className="text-xs text-slate-400">No image</span>
            );
          },
        },
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        {
          key: 'isFeatured',
          label: 'Featured',
          render: (item) => (item.isFeatured ? <Badge variant="accent">Yes</Badge> : 'No'),
        },
      ]}
      onReorder={(ordered) => reorderMutation.mutateAsync(ordered)}
      isReordering={reorderMutation.isPending}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <PortfolioForm
          item={item}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={onClose}
          onSubmit={(data) => {
            if (item) {
              updateMutation.mutate({ id: item.id, data }, { onSuccess: onClose });
            } else {
              createMutation.mutate(data as never, { onSuccess: onClose });
            }
          }}
        />
      )}
    />
  );
}
