import { useForm, Controller } from 'react-hook-form';
import type { SoftwareProduct } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface ProductFormProps {
  item?: SoftwareProduct | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

interface FormValues {
  name: string;
  slug: string;
  shortDescription: string;
  sortOrder: number;
  isPublished: boolean;
  logo: string[];
}

function toFormValues(item?: SoftwareProduct | null): FormValues {
  return {
    name: item?.name ?? '',
    slug: item?.slug ?? '',
    shortDescription: item?.shortDescription ?? '',
    sortOrder: item?.sortOrder ?? 0,
    isPublished: item?.isPublished ?? true,
    logo: item?.logoUrl ? [item.logoUrl] : [],
  };
}

export function ProductForm({ item, isSubmitting, onCancel, onSubmit }: ProductFormProps) {
  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: toFormValues(item),
  });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit({
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
          shortDescription: data.shortDescription,
          sortOrder: Number(data.sortOrder) || 0,
          isPublished: data.isPublished === true,
          logoUrl: data.logo[0] ?? '',
        }),
      )}
      className="space-y-4"
    >
      <Input label="Product name" {...register('name', { required: true })} />
      <Input label="Slug" {...register('slug')} placeholder="auto-generated if empty" />
      <Textarea
        label="Short description"
        rows={2}
        {...register('shortDescription')}
        placeholder="Brief description shown on the homepage"
      />

      <Controller
        name="logo"
        control={control}
        render={({ field }) => (
          <ImageUploadField
            label="Product logo"
            value={field.value}
            onChange={field.onChange}
            folder="products"
            multiple={false}
            preview="logo"
            uploadLabel="Upload logo"
            hint="Logo or icon for this software product (ECMS, CRM, etc.)."
          />
        )}
      />

      <Input label="Sort order" type="number" {...register('sortOrder', { valueAsNumber: true })} />

      <Controller
        name="isPublished"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-700"
            />
            <span className="font-medium text-primary-900">Published on website</span>
          </label>
        )}
      />

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
