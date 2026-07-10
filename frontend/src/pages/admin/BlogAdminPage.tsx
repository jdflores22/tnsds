import {
  useAdminBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
} from '@/api/hooks';
import type { Blog } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';
import { Badge } from '@/components/ui/Badge';

export default function BlogAdminPage() {
  const { data: items, isLoading } = useAdminBlogs();
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const deleteMutation = useDeleteBlog();

  return (
    <AdminCrudPage<Blog>
      title="Blog"
      description="Manage blog articles"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
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
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { isPublished: true }}
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'slug', label: 'Slug' },
            { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
            { name: 'content', label: 'Content', type: 'textarea' },
            { name: 'featuredImageUrl', label: 'Featured Image URL' },
            { name: 'seoTitle', label: 'SEO Title' },
            { name: 'seoDescription', label: 'SEO Description', type: 'textarea', rows: 2 },
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
