import {
  useAdminProcessSteps,
  useCreateProcessStep,
  useUpdateProcessStep,
  useDeleteProcessStep,
} from '@/api/hooks';
import type { ProcessStep } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';

export default function ProcessStepsAdminPage() {
  const { data: items, isLoading } = useAdminProcessSteps();
  const createMutation = useCreateProcessStep();
  const updateMutation = useUpdateProcessStep();
  const deleteMutation = useDeleteProcessStep();

  return (
    <AdminCrudPage<ProcessStep>
      title="Development process"
      description="Manage process steps shown on the homepage and about page."
      createLabel="Add step"
      searchPlaceholder="Search steps…"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'stepLabel', label: 'Step' },
        { key: 'title', label: 'Title' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { sortOrder: 0, isPublished: true }}
          fields={[
            { name: 'stepLabel', label: 'Step label (e.g. 01)' },
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'sortOrder', label: 'Sort order', type: 'number' },
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
