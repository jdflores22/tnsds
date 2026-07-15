import { useState, type ComponentType } from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';
import { SectionToggleSwitch } from '@/components/admin/SectionToggleSwitch';
import { FacebookIcon, LinkedInIcon } from '@/components/common/SocialBrandIcons';
import type { SiteSetting } from '@/types';
import { cn } from '@/utils/cn';

type SocialNetwork = {
  id: string;
  label: string;
  urlKey: string;
  enabledKey: string;
  placeholder: string;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
};

const SOCIAL_NETWORKS: SocialNetwork[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    urlKey: 'social_linkedin',
    enabledKey: 'social_linkedin_enabled',
    placeholder: 'https://linkedin.com/company/...',
    icon: LinkedInIcon,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    urlKey: 'social_facebook',
    enabledKey: 'social_facebook_enabled',
    placeholder: 'https://facebook.com/...',
    icon: FacebookIcon,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    urlKey: 'social_whatsapp',
    enabledKey: 'social_whatsapp_enabled',
    placeholder: '639171234567',
    icon: MessageCircle,
    hint: 'Digits only — shown on the sticky chat button when enabled.',
  },
];

function getValue(settings: SiteSetting[] | undefined, key: string) {
  return settings?.find((s) => s.key === key)?.value ?? '';
}

function isEnabledValue(value: string) {
  return value !== 'false';
}

export function SocialLinksSettings({ variant = 'panel' }: { variant?: 'panel' | 'compact' }) {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);
  const [urls, setUrls] = useState<Record<string, string> | null>(null);

  const resolvedUrls =
    urls ??
    Object.fromEntries(SOCIAL_NETWORKS.map((n) => [n.urlKey, getValue(settings, n.urlKey)]));

  const saveField = async (key: string, value: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({
        id: existing.id,
        data: { value, group: 'social', isPublic: true },
      });
    } else {
      await createMutation.mutateAsync({
        key,
        value,
        group: 'social',
        isPublic: true,
      });
    }
  };

  const handleToggle = async (network: SocialNetwork) => {
    const currentlyOn = isEnabledValue(getValue(settings, network.enabledKey));
    const next = currentlyOn ? 'false' : 'true';
    setTogglingKey(network.enabledKey);
    setSaved(false);
    try {
      await saveField(network.enabledKey, next);
      setSaved(true);
    } finally {
      setTogglingKey(null);
    }
  };

  const handleSaveUrls = async () => {
    setSaved(false);
    setSaving(true);
    try {
      await Promise.all(
        SOCIAL_NETWORKS.map((n) => saveField(n.urlKey, resolvedUrls[n.urlKey]?.trim() ?? '')),
      );
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const form = (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Toggle visibility immediately — hidden networks disappear from the footer (and WhatsApp
        sticky button). Save only if you change URLs.
      </p>
      {SOCIAL_NETWORKS.map((network) => {
        const Icon = network.icon;
        const isOn = isEnabledValue(getValue(settings, network.enabledKey));
        const isToggling = togglingKey === network.enabledKey;
        return (
          <div
            key={network.id}
            className={cn(
              'rounded-xl border p-4 transition-colors',
              isOn ? 'border-slate-200 bg-white' : 'border-amber-200/80 bg-amber-50/40',
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    isOn ? 'bg-primary-50 text-primary-800' : 'bg-slate-100 text-slate-400',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-900">{network.label}</p>
                  {!isOn && <p className="text-xs text-amber-700">Hidden on the website</p>}
                </div>
              </div>
              <SectionToggleSwitch
                size="sm"
                enabled={isOn}
                disabled={isToggling || updateMutation.isPending || createMutation.isPending}
                label={`${isOn ? 'Hide' : 'Show'} ${network.label}`}
                onToggle={() => void handleToggle(network)}
              />
            </div>
            <Input
              label={`${network.label} ${network.id === 'whatsapp' ? 'number' : 'URL'}`}
              value={resolvedUrls[network.urlKey] ?? ''}
              onChange={(e) =>
                setUrls((prev) => ({
                  ...(prev ?? resolvedUrls),
                  [network.urlKey]: e.target.value,
                }))
              }
              placeholder={network.placeholder}
              disabled={!isOn}
            />
            {network.hint && <p className="mt-1.5 text-xs text-slate-500">{network.hint}</p>}
          </div>
        );
      })}

      <div className="flex items-center justify-between gap-3 pt-1">
        <SaveFeedback show={saved} />
        <Button type="button" onClick={() => void handleSaveUrls()} disabled={saving}>
          {saving ? 'Saving…' : 'Save URLs'}
        </Button>
      </div>
    </div>
  );

  if (variant === 'compact') return form;

  return (
    <SettingsPanel
      title="Social links"
      description="Show or hide LinkedIn, Facebook, and WhatsApp on the public site."
    >
      {form}
    </SettingsPanel>
  );
}
