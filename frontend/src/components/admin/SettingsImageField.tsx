import { useRef, useState } from 'react';
import { ImageIcon, Upload } from 'lucide-react';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/Button';
import { resolveMediaUrl } from '@/utils/media';

interface SettingsImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
}

export function SettingsImageField({
  label,
  value,
  onChange,
  folder = 'pages',
  hint,
}: SettingsImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<{ data: { url: string } }>(
        `/upload?folder=${folder}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      onChange(data.data.url);
    } catch {
      setError('Upload failed. Use PNG, JPG, or WebP under 10 MB.');
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = value ? resolveMediaUrl(value) : '';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex gap-2">
          {value && (
            <Button type="button" variant="outline" size="sm" onClick={() => onChange('')}>
              Remove
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            Upload
          </Button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
      />

      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-brand-red-600">{error}</p>}

      {previewUrl ? (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <img src={previewUrl} alt="" className="aspect-[21/9] w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
          <div className="text-center text-slate-400">
            <ImageIcon className="mx-auto h-7 w-7" />
            <p className="mt-1.5 text-xs">No image set</p>
          </div>
        </div>
      )}
    </div>
  );
}
