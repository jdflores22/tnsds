import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/api/hooks';
import type { User } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';
import { Badge } from '@/components/ui/Badge';

export default function UsersAdminPage() {
  const { data: items, isLoading } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  return (
    <AdminCrudPage<User>
      title="Users"
      description="Manage admin users"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'email', label: 'Email' },
        {
          key: 'firstName',
          label: 'Name',
          render: (item) => `${item.firstName} ${item.lastName}`,
        },
        {
          key: 'isActive',
          label: 'Status',
          render: (item) => (
            <Badge variant={item.isActive ? 'success' : 'danger'}>
              {item.isActive ? 'Active' : 'Inactive'}
            </Badge>
          ),
        },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={
            item || { isActive: true, roleId: '00000000-0000-0000-0000-000000000001' }
          }
          fields={[
            { name: 'email', label: 'Email' },
            ...(!item ? [{ name: 'password', label: 'Password' }] : []),
            { name: 'firstName', label: 'First Name' },
            { name: 'lastName', label: 'Last Name' },
            { name: 'roleId', label: 'Role ID' },
            { name: 'isActive', label: 'Active', type: 'checkbox' },
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
