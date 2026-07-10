import { cn } from '@/utils/cn';

export function sectionSurfaceClass(dark: boolean, lightVariant: 'white' | 'muted' = 'white') {
  return cn(
    'border-b py-16 sm:py-20',
    dark
      ? 'border-white/10 bg-primary-900 text-white circuit-bg'
      : lightVariant === 'muted'
        ? 'border-slate-200 bg-slate-50'
        : 'border-slate-200 bg-white',
  );
}

export function sectionTheme(dark: boolean): 'light' | 'dark' {
  return dark ? 'dark' : 'light';
}

export function sectionMutedTextClass(dark: boolean) {
  return dark ? 'text-slate-300' : 'text-slate-600';
}

export function sectionSubtleTextClass(dark: boolean) {
  return dark ? 'text-slate-400' : 'text-slate-500';
}
