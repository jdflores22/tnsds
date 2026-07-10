import {
  useAdminClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/api/hooks';
import type { Client } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';

export default function ClientsAdminPage() {
  const { data: items, isLoading } = useAdminClients();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  return (
    <AdminCrudPage<Client>
      title="Clients"
      description="Manage client companies"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'website', label: 'Website' },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { isPublished: true }}
          fields={[
            { name: 'name', label: 'Name' },
            { name: 'logoUrl', label: 'Logo URL' },
            { name: 'website', label: 'Website' },
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
