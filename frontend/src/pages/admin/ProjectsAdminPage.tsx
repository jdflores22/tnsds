import {
  useAdminProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/api/hooks';
import { ProjectStatus } from '@/types';
import type { Project } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';
import { Badge } from '@/components/ui/Badge';

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.Planning]: 'Planning',
  [ProjectStatus.InProgress]: 'In Progress',
  [ProjectStatus.Completed]: 'Completed',
  [ProjectStatus.OnHold]: 'On Hold',
};

export default function ProjectsAdminPage() {
  const { data: items, isLoading } = useAdminProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  return (
    <AdminCrudPage<Project>
      title="Projects"
      description="Manage client projects"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'title', label: 'Title' },
        {
          key: 'status',
          label: 'Status',
          render: (item) => <Badge variant="accent">{statusLabels[item.status]}</Badge>,
        },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { status: ProjectStatus.Planning, isPublished: true }}
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'serviceId', label: 'Service ID' },
            { name: 'status', label: 'Status (0-3)', type: 'number' },
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
