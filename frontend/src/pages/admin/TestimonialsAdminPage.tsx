import {
  useAdminTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useReorderTestimonials,
} from '@/api/hooks';
import type { Testimonial } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';
import { Badge } from '@/components/ui/Badge';

export default function TestimonialsAdminPage() {
  const { data: items, isLoading } = useAdminTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();
  const reorderMutation = useReorderTestimonials();

  return (
    <AdminCrudPage<Testimonial>
      title="Testimonials"
      description="Manage client testimonials shown on the homepage"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'company', label: 'Company' },
        {
          key: 'isPublished',
          label: 'Status',
          render: (item) => (
            <Badge variant={item.isPublished ? 'success' : 'warning'}>
              {item.isPublished ? 'Published' : 'Draft'}
            </Badge>
          ),
        },
      ]}
      onReorder={(ordered) => reorderMutation.mutateAsync(ordered)}
      isReordering={reorderMutation.isPending}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { sortOrder: 0, rating: 5, isPublished: true }}
          fields={[
            { name: 'name', label: 'Name' },
            { name: 'company', label: 'Company' },
            { name: 'quote', label: 'Quote', type: 'textarea', rows: 3 },
            { name: 'avatarUrl', label: 'Avatar URL' },
            { name: 'rating', label: 'Rating (1-5)', type: 'number' },
            { name: 'sortOrder', label: 'Sort Order', type: 'number' },
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
