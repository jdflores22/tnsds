import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'checkbox';
  rows?: number;
}

export interface EntityFormProps {
  defaultValues?: object;
  fields: FormField[];
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function normalizeFormData(
  data: Record<string, unknown>,
  fields: FormField[],
): Record<string, unknown> {
  const normalized = { ...data };

  for (const field of fields) {
    if (field.type === 'checkbox') {
      normalized[field.name] = data[field.name] === true;
    } else if (field.type === 'number') {
      normalized[field.name] = Number(data[field.name]) || 0;
    }
  }

  return normalized;
}

export function EntityForm({
  defaultValues,
  fields,
  onSubmit,
  onCancel,
  isSubmitting,
}: EntityFormProps) {
  const { register, handleSubmit, control } = useForm<Record<string, unknown>>({
    defaultValues: defaultValues as Record<string, unknown>,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(normalizeFormData(data, fields)))}
      className="space-y-5"
    >
      {fields.map((field) =>
        field.type === 'textarea' ? (
          <Textarea
            key={field.name}
            label={field.label}
            rows={field.rows || 4}
            {...register(field.name)}
          />
        ) : field.type === 'checkbox' ? (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: f }) => (
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(f.value)}
                  onChange={(e) => f.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-brand-gold-400"
                />
                <span className="font-medium text-primary-900">{field.label}</span>
              </label>
            )}
          />
        ) : (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            {...register(field.name)}
          />
        ),
      )}
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
