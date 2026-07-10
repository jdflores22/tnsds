import { useState } from 'react';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';

const CONTACT_FIELDS = [
  { key: 'company_email', label: 'Email', icon: Mail, placeholder: 'info@trans-net.com' },
  { key: 'company_phone', label: 'Phone', icon: Phone, placeholder: '+1-800-TRANS-NET' },
  { key: 'company_website', label: 'Website', icon: Globe, placeholder: 'www.trans-net.com' },
  { key: 'company_address', label: 'Address', icon: MapPin, placeholder: 'Global Headquarters' },
] as const;

export function ContactSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [saved, setSaved] = useState(false);

  const values = Object.fromEntries(
    CONTACT_FIELDS.map(({ key }) => [key, settings?.find((s) => s.key === key)?.value ?? '']),
  );

  const saveField = async (key: string, value: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({
        id: existing.id,
        data: { value, group: 'contact', isPublic: true },
      });
    } else {
      await createMutation.mutateAsync({ key, value, group: 'contact', isPublic: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    await Promise.all(
      CONTACT_FIELDS.map(({ key }) => saveField(key, String(formData.get(key) ?? ''))),
    );
    setSaved(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <SettingsPanel
      icon={Phone}
      title="Contact information"
      description="Used on the contact page, footer, and homepage hero bar."
      footer={
        <>
          <Button type="submit" form="contact-settings-form" isLoading={isSaving}>
            Save contact info
          </Button>
          <SaveFeedback saved={saved} isSaving={isSaving} />
        </>
      }
    >
      <form id="contact-settings-form" onSubmit={(e) => void handleSubmit(e)}>
        <div className="grid gap-5 sm:grid-cols-2">
          {CONTACT_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key} className={key === 'company_address' ? 'sm:col-span-2' : undefined}>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Icon className="h-4 w-4 text-brand-gold-500" />
                {label}
              </label>
              <Input name={key} defaultValue={values[key]} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </form>
    </SettingsPanel>
  );
}
