import {
  useAdminCareers,
  useCreateCareer,
  useUpdateCareer,
  useDeleteCareer,
} from '@/api/hooks';
import type { Career } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';
import { Badge } from '@/components/ui/Badge';

export default function CareersAdminPage() {
  const { data: items, isLoading } = useAdminCareers();
  const createMutation = useCreateCareer();
  const updateMutation = useUpdateCareer();
  const deleteMutation = useDeleteCareer();

  return (
    <AdminCrudPage<Career>
      title="Careers"
      description="Manage job openings"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'department', label: 'Department' },
        { key: 'location', label: 'Location' },
        {
          key: 'type',
          label: 'Type',
          render: (item) => <Badge>{item.type}</Badge>,
        },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { type: 'Full-time', isPublished: true }}
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'slug', label: 'Slug' },
            { name: 'department', label: 'Department' },
            { name: 'location', label: 'Location' },
            { name: 'type', label: 'Type' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'requirements', label: 'Requirements', type: 'textarea' },
            { name: 'isPublished', label: 'Published', type: 'checkbox' },
          ]}
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
