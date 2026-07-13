import { useState } from 'react';
import { AlertCircle, CheckCircle2, Globe, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useEmailStatus, useSendTestEmail, useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';
import { normalizeGoogleMapEmbedInput } from '@/utils/media';
import { toast } from '@/store/toastStore';
import { isAxiosError } from 'axios';

const CONTACT_FIELDS = [
  { key: 'company_email', label: 'Email', icon: Mail, placeholder: 'info@trans-net.com' },
  { key: 'company_phone', label: 'Phone', icon: Phone, placeholder: '+1-800-TRANS-NET' },
  { key: 'company_website', label: 'Website', icon: Globe, placeholder: 'www.trans-net.com' },
  { key: 'company_address', label: 'Address', icon: MapPin, placeholder: 'Global Headquarters' },
] as const;

const OFFICE_HOURS_FIELDS = [
  { key: 'contact_office_hours_title', label: 'Office hours title', default: 'Office hours' },
  {
    key: 'contact_office_hours',
    label: 'Schedule (one line per row: Day range|Hours)',
    default: 'Mon–Fri|9:00 AM – 6:00 PM (PHT)\nSat–Sun|Closed',
    type: 'textarea' as const,
  },
  {
    key: 'contact_office_hours_note',
    label: 'Footnote',
    default: 'Times shown in Philippines Standard Time (PHT).',
  },
] as const;

const MAP_FIELD = {
  key: 'contact_map_embed_url',
  label: 'Google Maps embed URL',
  placeholder: 'https://www.google.com/maps/embed?pb=...',
  hint: 'Optional. Leave blank to auto-embed from your address. Or paste Google Maps → Share → Embed a map iframe src.',
} as const;

export function ContactSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const { data: emailStatus, isLoading: emailStatusLoading } = useEmailStatus();
  const testEmailMutation = useSendTestEmail();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [saved, setSaved] = useState(false);

  const values = Object.fromEntries(
    [...CONTACT_FIELDS, ...OFFICE_HOURS_FIELDS, MAP_FIELD].map(({ key }) => [
      key,
      settings?.find((s) => s.key === key)?.value ?? '',
    ]),
  );

  const saveField = async (key: string, value: string) => {
    const normalizedValue =
      key === MAP_FIELD.key ? normalizeGoogleMapEmbedInput(value) : value;
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({
        id: existing.id,
        data: { value: normalizedValue, group: 'contact', isPublic: true },
      });
    } else {
      await createMutation.mutateAsync({
        key,
        value: normalizedValue,
        group: 'contact',
        isPublic: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    await Promise.all(
      [...CONTACT_FIELDS, ...OFFICE_HOURS_FIELDS, MAP_FIELD].map(({ key }) =>
        saveField(key, String(formData.get(key) ?? '')),
      ),
    );
    setSaved(true);
  };

  const handleSendTestEmail = async () => {
    try {
      const result = await testEmailMutation.mutateAsync();
      toast.success('Test email sent', result.message);
    } catch (error) {
      const apiMessage = isAxiosError(error)
        ? error.response?.data?.errors?.[0] ??
          error.response?.data?.data?.message ??
          error.message
        : error instanceof Error
          ? error.message
          : 'Test email failed';
      toast.error('Test email failed', apiMessage);
    }
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
      description="Used on the contact page, footer, and homepage hero bar. The contact form sends notifications to the email below."
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
              {key === 'company_email' && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Contact form submissions are emailed to this address (when SMTP is configured).
                </p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Email delivery (SMTP)</p>
                <p className="mt-1 text-xs text-slate-500">
                  Messages are always saved in Admin → Messages. Email notifications require SMTP on the API server.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={testEmailMutation.isPending}
                onClick={() => void handleSendTestEmail()}
              >
                <Send className="h-4 w-4" />
                Send test email
              </Button>
            </div>

            {emailStatusLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Spinner size="sm" />
                Checking SMTP configuration…
              </div>
            ) : emailStatus ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {emailStatus.isConfigured ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="text-emerald-800">
                        SMTP configured ({emailStatus.host}:{emailStatus.port})
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                      <span className="text-amber-800">SMTP not configured — emails will not send</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Test recipient: <span className="font-medium">{emailStatus.companyEmail}</span>
                  {emailStatus.from ? (
                    <>
                      {' '}
                      · From: <span className="font-medium">{emailStatus.from}</span>
                    </>
                  ) : null}
                </p>
                {!emailStatus.isConfigured && emailStatus.configurationHint && (
                  <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    {emailStatus.configurationHint} Locally, set values in{' '}
                    <code className="rounded bg-white px-1">appsettings.Development.json</code> or Railway env vars{' '}
                    <code className="rounded bg-white px-1">Smtp__Host</code>,{' '}
                    <code className="rounded bg-white px-1">Smtp__Username</code>,{' '}
                    <code className="rounded bg-white px-1">Smtp__Password</code>.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="sm:col-span-2 mt-2 border-t border-slate-100 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Office hours
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {OFFICE_HOURS_FIELDS.map((field) =>
                'type' in field && field.type === 'textarea' ? (
                  <div key={field.key} className="sm:col-span-2">
                    <Textarea
                      name={field.key}
                      label={field.label}
                      rows={3}
                      defaultValue={values[field.key] || field.default}
                    />
                  </div>
                ) : (
                  <Input
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    defaultValue={values[field.key] || field.default}
                  />
                ),
              )}
            </div>
          </div>

          <div className="sm:col-span-2 border-t border-slate-100 pt-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Map embed
            </p>
            <p className="mb-3 text-xs text-slate-500">
              {MAP_FIELD.hint} You can paste the full iframe HTML — we extract the URL automatically.
            </p>
            <Textarea
              name={MAP_FIELD.key}
              label={MAP_FIELD.label}
              rows={3}
              placeholder={MAP_FIELD.placeholder}
              defaultValue={normalizeGoogleMapEmbedInput(values[MAP_FIELD.key])}
            />
          </div>
        </div>
      </form>
    </SettingsPanel>
  );
}
