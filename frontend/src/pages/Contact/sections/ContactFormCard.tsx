import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { useSubmitContact } from '@/api/hooks';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject is required'),
  body: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

interface ContactFormCardProps {
  isDark?: boolean;
  formTitle?: string;
  formSubtitle?: string;
}

export function ContactFormCard({
  isDark = false,
  formTitle = 'Send us a message',
  formSubtitle = 'Fill out the form and our team will get back to you shortly.',
}: ContactFormCardProps) {
  const mutation = useSubmitContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <div
      id="contact-form"
      className={cn(
        'rounded-2xl border p-6 shadow-sm sm:p-8',
        isDark ? 'border-white/15 bg-white/5' : 'border-slate-200 bg-white',
      )}
    >
      <h3 className={cn('text-xl font-semibold tracking-tight', isDark ? 'text-white' : 'text-primary-900')}>
        {formTitle}
      </h3>
      {formSubtitle && (
        <p className={cn('mt-2 text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
          {formSubtitle}
        </p>
      )}

      {mutation.isSuccess && (
        <div
          className={cn(
            'mt-5 rounded-lg border p-4 text-sm',
            isDark
              ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
              : 'border-primary-100 bg-primary-50 text-primary-800',
          )}
        >
          Thank you! Your message has been sent successfully.
        </div>
      )}
      {mutation.isError && (
        <div className="mt-5 rounded-lg border border-brand-red-500/20 bg-brand-red-500/10 p-4 text-sm text-brand-red-700">
          Failed to send message. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        </div>
        <Input label="Subject" error={errors.subject?.message} {...register('subject')} />
        <Textarea label="Message" rows={5} error={errors.body?.message} {...register('body')} />
        <Button type="submit" className="w-full sm:w-auto" isLoading={mutation.isPending}>
          Send message
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
