import { useState } from 'react';
import { Send } from 'lucide-react';
import { useSubscribe } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'light' | 'dark';
}

export function NewsletterSignup({
  title = 'Stay in the loop',
  description = 'Get product updates, engineering insights, and company news.',
  className,
  variant = 'dark',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const subscribe = useSubscribe();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setDone(true);
          setEmail('');
        },
      },
    );
  };

  const isDark = variant === 'dark';

  return (
    <div className={cn('rounded-xl border p-5', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50', className)}>
      <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-primary-900')}>{title}</h3>
      <p className={cn('mt-1 text-xs leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500')}>{description}</p>
      {done ? (
        <p className={cn('mt-4 text-sm font-medium', isDark ? 'text-brand-gold-400' : 'text-primary-700')}>
          Thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex gap-2">
          <Input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn('flex-1', isDark && 'border-white/15 bg-white/10 text-white placeholder:text-slate-500')}
          />
          <Button type="submit" size="sm" isLoading={subscribe.isPending} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
