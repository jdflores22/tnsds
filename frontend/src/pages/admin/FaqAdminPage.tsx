import {
  useAdminFaqItems,
  useCreateFaqItem,
  useUpdateFaqItem,
  useDeleteFaqItem,
} from '@/api/hooks';
import type { FaqItem } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';

export default function FaqAdminPage() {
  const { data: items, isLoading } = useAdminFaqItems();
  const createMutation = useCreateFaqItem();
  const updateMutation = useUpdateFaqItem();
  const deleteMutation = useDeleteFaqItem();

  return (
    <AdminCrudPage<FaqItem>
      title="FAQ"
      description="Manage frequently asked questions on the homepage."
      createLabel="Add question"
      searchPlaceholder="Search FAQ…"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'question', label: 'Question' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { sortOrder: 0, isPublished: true }}
          fields={[
            { name: 'question', label: 'Question' },
            { name: 'answer', label: 'Answer', type: 'textarea' },
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
