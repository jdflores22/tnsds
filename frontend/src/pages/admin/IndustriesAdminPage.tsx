import {
  useAdminIndustries,
  useCreateIndustry,
  useUpdateIndustry,
  useDeleteIndustry,
} from '@/api/hooks';
import type { Industry } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { IndustryForm } from '@/components/admin/IndustryForm';
import { Badge } from '@/components/ui/Badge';
import { resolveMediaUrl } from '@/utils/media';

export default function IndustriesAdminPage() {
  const { data: items, isLoading } = useAdminIndustries();
  const createMutation = useCreateIndustry();
  const updateMutation = useUpdateIndustry();
  const deleteMutation = useDeleteIndustry();

  return (
    <AdminCrudPage<Industry>
      title="Sector expertise"
      description="Manage industries shown in the Sector Expertise sections on the homepage, about page, and /industries page."
      createLabel="Add industry"
      searchPlaceholder="Search industries…"
      items={items}
      isLoading={isLoading}
      columns={[
        {
          key: 'iconUrl',
          label: 'Icon',
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
        { key: 'shortDescription', label: 'Description' },
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
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <IndustryForm
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
