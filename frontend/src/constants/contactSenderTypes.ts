export const CONTACT_SENDER_TYPES = [
  { value: 'trucker', label: 'Trucker' },
  { value: 'shipping_lines', label: 'Shipping Lines' },
  { value: 'container_yard', label: 'Container Yard' },
  { value: 'private_company', label: 'Private Company' },
] as const;

export type ContactSenderType = (typeof CONTACT_SENDER_TYPES)[number]['value'];

export function formatContactSenderType(value?: string | null): string {
  if (!value) return 'Not specified';
  const match = CONTACT_SENDER_TYPES.find((item) => item.value === value);
  return match?.label ?? value;
}
