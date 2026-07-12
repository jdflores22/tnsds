import { MessageSquare, PhoneCall, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useSectionContent, useSectionDarkBackground } from '@/hooks/useSectionContent';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { sectionSurfaceClass, sectionTheme } from '@/utils/sectionSurface';
import { cn } from '@/utils/cn';

const STEP_ICONS: LucideIcon[] = [MessageSquare, PhoneCall, Rocket];

interface StepProps {
  step: number;
  title: string;
  text: string;
  icon: LucideIcon;
  isDark: boolean;
}

function ExpectStep({ step, title, text, icon: Icon, isDark }: StepProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 sm:p-7',
        isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm',
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
            isDark ? 'bg-brand-gold-500/20 text-brand-gold-400' : 'bg-brand-gold-500/15 text-brand-gold-600',
          )}
        >
          {step}
        </span>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            isDark ? 'bg-primary-800/80' : 'bg-primary-50',
          )}
        >
          <Icon className={cn('h-5 w-5', isDark ? 'text-brand-gold-400' : 'text-primary-700')} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className={cn('text-lg font-semibold tracking-tight', isDark ? 'text-white' : 'text-primary-900')}>
        {title}
      </h3>
      <p className={cn('mt-2 text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>{text}</p>
    </div>
  );
}

export function ContactExpectSection() {
  const isDark = useSectionDarkBackground('contact_expect', true);
  const theme = sectionTheme(isDark);
  const { get } = useSiteSettingsMap();
  const section = useSectionContent('contact_expect', {
    eyebrow: 'What happens next',
    title: 'A clear path from first message to next steps',
    subtitle: 'We keep the process straightforward so you know what to expect after reaching out.',
  });

  const steps = [
    {
      title: get('contact_expect_step1_title', 'Send your message'),
      text: get(
        'contact_expect_step1_text',
        'Tell us about your project, timeline, and goals — the more context, the better we can help.',
      ),
    },
    {
      title: get('contact_expect_step2_title', 'We review & respond'),
      text: get(
        'contact_expect_step2_text',
        'A solutions consultant reviews your inquiry and replies within one business day.',
      ),
    },
    {
      title: get('contact_expect_step3_title', 'Plan next steps'),
      text: get(
        'contact_expect_step3_text',
        "We'll schedule a call to scope requirements and recommend the best path forward.",
      ),
    },
  ];

  return (
    <section className={sectionSurfaceClass(isDark)}>
      <Container>
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          theme={theme}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <ExpectStep
              key={step.title}
              step={index + 1}
              title={step.title}
              text={step.text}
              icon={STEP_ICONS[index] ?? MessageSquare}
              isDark={isDark}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
