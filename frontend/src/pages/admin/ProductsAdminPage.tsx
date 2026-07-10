import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/api/hooks';
import type { SoftwareProduct } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { ProductForm } from '@/components/admin/ProductForm';
import { Badge } from '@/components/ui/Badge';
import { resolveMediaUrl } from '@/utils/media';

export default function ProductsAdminPage() {
  const { data: items, isLoading } = useAdminProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  return (
    <AdminCrudPage<SoftwareProduct>
      title="Software products"
      description="Manage your software solutions (ECMS, CRM, ERP, etc.) shown in the homepage Products section. Use Portfolio for client project case studies."
      createLabel="Add product"
      searchPlaceholder="Search products…"
      items={items}
      isLoading={isLoading}
      columns={[
        {
          key: 'logoUrl',
          label: 'Logo',
          render: (item) =>
            item.logoUrl ? (
              <img
                src={resolveMediaUrl(item.logoUrl)}
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
        <ProductForm
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
