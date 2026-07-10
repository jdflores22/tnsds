import {
  useAdminTechnologies,
  useCreateTechnology,
  useUpdateTechnology,
  useDeleteTechnology,
  useReorderTechnologies,
} from '@/api/hooks';
import type { Technology } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { TechnologyForm } from '@/components/admin/TechnologyForm';
import { Badge } from '@/components/ui/Badge';
import { resolveMediaUrl } from '@/utils/media';

export default function TechnologiesAdminPage() {
  const { data: items, isLoading } = useAdminTechnologies();
  const createMutation = useCreateTechnology();
  const updateMutation = useUpdateTechnology();
  const deleteMutation = useDeleteTechnology();
  const reorderMutation = useReorderTechnologies();

  return (
    <AdminCrudPage<Technology>
      title="Technologies"
      description="Manage technology stack items and logos shown in the homepage carousel."
      createLabel="Add technology"
      searchPlaceholder="Search technologies…"
      items={items}
      isLoading={isLoading}
      columns={[
        {
          key: 'iconUrl',
          label: 'Logo',
          render: (item) =>
            item.iconUrl ? (
              <img
                src={resolveMediaUrl(item.iconUrl)}
                alt=""
                className="h-10 w-10 rounded-lg bg-white object-contain p-1 ring-1 ring-slate-200"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-sm font-medium text-primary-700">
                {item.name.charAt(0)}
              </span>
            ),
        },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'sortOrder', label: 'Order' },
        {
          key: 'isPublished',
          label: 'Status',
          render: (item) =>
            item.isPublished ? (
              <Badge variant="accent">Published</Badge>
            ) : (
              <Badge>Draft</Badge>
            ),
        },
      ]}
      onReorder={(ordered) => reorderMutation.mutateAsync(ordered)}
      isReordering={reorderMutation.isPending}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <TechnologyForm
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
